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
import json

router = APIRouter(prefix="/api/requests", tags=["Requests"])

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
            user_source=input_data.source or "Web"
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

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

        req_entry = CitizenRequest(
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
            priority_score=ai_result["priority_score"],
            affected_population_estimate=ai_result["affected_population_estimate"],
            infrastructure_gap=ai_result["infrastructure_gap"],
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

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to submit request: {str(e)}")

@router.get("", response_model=List[CitizenRequestResponse])
def get_all_requests(
    country: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    source: Optional[str] = Query(None),
    min_priority: Optional[float] = Query(None),
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
def get_request_by_id(request_id: int, db: Session = Depends(get_db)):
    """Retrieves single request details by ID."""
    req = db.query(CitizenRequest).filter(CitizenRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    
    res_item = CitizenRequestResponse.model_validate(req)
    latest_analysis = db.query(AIAnalysis).filter_by(request_id=req.id).first()
    if latest_analysis:
        res_item.ai_mode = latest_analysis.ai_mode
    return res_item
