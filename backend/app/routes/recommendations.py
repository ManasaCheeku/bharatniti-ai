from fastapi import APIRouter, Depends, HTTPException
import logging
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.models import CitizenRequest, DevelopmentData, PublicInvestment
from app.schemas.schemas import RecommendationInput, RecommendationResponse
from app.services.gemini_service import generate_policy_brief

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])
logger = logging.getLogger(__name__)

@router.post("/generate", response_model=RecommendationResponse)
def generate_recommendation_endpoint(input_data: RecommendationInput, db: Session = Depends(get_db)):
    """Generates an evidence-backed AI Policy Brief for a specified state, district, and category."""
    try:
        # Fetch matching requests metrics
        reqs = db.query(CitizenRequest).filter(
            CitizenRequest.state.ilike(f"%{input_data.state}%"),
            CitizenRequest.district.ilike(f"%{input_data.district}%"),
            CitizenRequest.category.ilike(f"%{input_data.category}%")
        ).all()

        req_count = len(reqs)
        avg_prio = sum(r.priority_score for r in reqs) / req_count if reqs else 0.0
        development = db.query(DevelopmentData).filter_by(
            state=input_data.state, district=input_data.district
        ).first()
        investment = db.query(PublicInvestment).filter_by(
            district=input_data.district, category=input_data.category
        ).first()

        result = generate_policy_brief(
            state=input_data.state,
            district=input_data.district,
            category=input_data.category,
            citizen_requests_count=req_count,
            avg_priority=avg_prio,
            affected_population=development.population if development else 0,
            infrastructure_gap=(100 - (development.water_access_index if input_data.category == "Water & Sanitation" else development.road_index)) if development else 0,
            investment_gap=investment.investment_gap_percent if investment else 0,
            investment_coverage=investment.investment_coverage_percent if investment else 0,
            planned_investment=investment.planned_investment_inr_cr if investment else 0
        )
        return result
    except Exception:
        logger.exception("Policy recommendation generation failed")
        raise HTTPException(status_code=500, detail="Recommendation generation failed")
