import secrets
import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import CitizenRequest, AIAnalysis
from app.schemas.schemas import (
    RequestAnalyzeInput,
    RequestCreateInput,
    AIAnalysisResult,
    CitizenRequestResponse
)
from app.services.gemini_service import analyze_citizen_request
from app.services.priority_service import calculate_demand_score, calculate_priority_score
import json

router = APIRouter(prefix="/api/requests", tags=["Requests"])
logger = logging.getLogger(__name__)

@router.post("/analyze", response_model=AIAnalysisResult)
def analyze_request_endpoint(input_data: RequestAnalyzeInput):
    """Ad-hoc analysis of a citizen request using Gemini or Fallback AI without database persistence."""
    try:
        result = analyze_citizen_request(
            text=input_data.original_text,
            user_state=input_data.state,
            user_district=input_data.district,
            user_cat=input_data.category,
            user_country=input_data.country or "India",
            user_source=input_data.source or "Web",
            include_request_id=False
        )
        return result
    except Exception:
        logger.exception("Ad-hoc request analysis failed")
        raise HTTPException(status_code=500, detail="Analysis failed")

@router.post("", response_model=CitizenRequestResponse)
def create_citizen_request(input_data: RequestCreateInput, db: Session = Depends(get_db)):
    """Submits, analyzes via Gemini, scores priority, and saves a citizen request."""
    try:
        ai_result = analyze_citizen_request(
            text=input_data.original_text,
            user_state=input_data.state,
            user_district=input_data.district,
            user_cat=input_data.category,
            user_country=input_data.country or "India",
            user_source=input_data.source or "Web"
        )

        relevant_count = db.query(CitizenRequest).filter(
            CitizenRequest.state == ai_result["state"],
            CitizenRequest.district == ai_result["district"],
            CitizenRequest.category == ai_result["category"]
        ).count() + 1
        demand = calculate_demand_score(relevant_count)
        priority = calculate_priority_score(
            ai_result["urgency"],
            ai_result["infrastructure_gap"],
            ai_result["affected_population_factor"],
            ai_result["regional_vulnerability"],
            demand
        )
        request_id_code = _next_request_id(db)

        req_entry = CitizenRequest(
            request_id_code=request_id_code,
            country=ai_result.get("country", "India"),
            source=input_data.source or ai_result.get("source", "Web"),
            original_text=input_data.original_text,
            detected_language=ai_result["detected_language"],
            translated_text=ai_result["translated_text"],
            state=ai_result["state"],
            district=ai_result["district"],
            category=ai_result["category"],
            subcategory=ai_result["subcategory"],
            issue_summary=ai_result["issue_summary"],
            urgency=ai_result["urgency"],
            demand=demand,
            affected_population_factor=ai_result["affected_population_factor"],
            regional_vulnerability=ai_result["regional_vulnerability"],
            priority_score=priority,
            affected_population_estimate=ai_result["affected_population_estimate"],
            infrastructure_gap=ai_result["infrastructure_gap"],
            video_ref=input_data.video_ref,
            status="Analyzed"
        )
        db.add(req_entry)
        db.commit()
        db.refresh(req_entry)

        ai_entry = AIAnalysis(
            request_id=req_entry.id,
            ai_mode=ai_result["ai_mode"],
            model_name=ai_result["model_name"],
            structured_output=json.dumps(ai_result.get("raw_output") or {}),
            recommended_intervention=ai_result["recommended_intervention"],
            reasoning=ai_result["reasoning"]
        )
        db.add(ai_entry)
        db.commit()

        response_data = CitizenRequestResponse.model_validate(req_entry)
        response_data.ai_mode = ai_result["ai_mode"]
        return response_data

    except Exception:
        db.rollback()
        logger.exception("Citizen request submission failed")
        raise HTTPException(status_code=500, detail="Failed to submit request")


def _next_request_id(db: Session) -> str:
    """Create a backend-owned ID and guard against collisions in the database."""
    for _ in range(10):
        candidate = f"REQ-BN-{secrets.randbelow(900000) + 100000}"
        if not db.query(CitizenRequest).filter_by(request_id_code=candidate).first():
            return candidate
    raise HTTPException(status_code=500, detail="Unable to allocate a unique request ID")

@router.get("", response_model=List[CitizenRequestResponse])
def get_all_requests(
    country: Optional[str] = Query(None, max_length=50),
    state: Optional[str] = Query(None, max_length=100),
    district: Optional[str] = Query(None, max_length=100),
    category: Optional[str] = Query(None, max_length=100),
    source: Optional[str] = Query(None, max_length=50),
    min_priority: Optional[float] = Query(None, ge=0, le=100),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db)
):
    """Retrieves all citizen requests with optional country/state/district/category/source/priority filters."""
    query = db.query(CitizenRequest)

    if country:
        query = query.filter(CitizenRequest.country.ilike(f"%{country}%"))
    if state:
        query = query.filter(CitizenRequest.state.ilike(f"%{state}%"))
    if district:
        query = query.filter(CitizenRequest.district.ilike(f"%{district}%"))
    if category:
        query = query.filter(CitizenRequest.category.ilike(f"%{category}%"))
    if source:
        query = query.filter(CitizenRequest.source.ilike(f"%{source}%"))
    if min_priority is not None:
        query = query.filter(CitizenRequest.priority_score >= min_priority)

    requests = query.order_by(CitizenRequest.priority_score.desc()).limit(limit).all()
    
    result = []
    for r in requests:
        res_item = CitizenRequestResponse.model_validate(r)
        latest_analysis = db.query(AIAnalysis).filter_by(request_id=r.id).first()
        if latest_analysis:
            res_item.ai_mode = latest_analysis.ai_mode
        result.append(res_item)
        
    return result

@router.get("/{request_id}", response_model=CitizenRequestResponse)
def get_request_by_id(request_id: str, db: Session = Depends(get_db)):
    """Retrieves a request by its canonical code or legacy numeric database ID."""
    query = db.query(CitizenRequest)
    req = query.filter(CitizenRequest.request_id_code == request_id).first()
    if not req and request_id.isdigit():
        req = query.filter(CitizenRequest.id == int(request_id)).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    
    res_item = CitizenRequestResponse.model_validate(req)
    latest_analysis = db.query(AIAnalysis).filter_by(request_id=req.id).first()
    if latest_analysis:
        res_item.ai_mode = latest_analysis.ai_mode
    return res_item
