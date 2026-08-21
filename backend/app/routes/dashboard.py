from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.models import CitizenRequest, DevelopmentData, PublicInvestment
from app.schemas.schemas import (
    DashboardSummaryResponse,
    HotspotItem,
    CategoryDistributionItem,
    StateDistributionItem,
    ChannelDistributionItem,
    LanguageDistributionItem
)

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(db: Session = Depends(get_db)):
    """Provides top-level KPI indicators, channel distribution, and multilingual distribution for policymaker dashboard."""
    total_requests = db.query(func.count(CitizenRequest.id)).scalar() or 0
    high_priority = db.query(func.count(CitizenRequest.id)).filter(CitizenRequest.priority_score >= 80).scalar() or 0
    medium_priority = db.query(func.count(CitizenRequest.id)).filter(
        CitizenRequest.priority_score >= 60, CitizenRequest.priority_score < 80
    ).scalar() or 0
    low_priority = db.query(func.count(CitizenRequest.id)).filter(CitizenRequest.priority_score < 60).scalar() or 0

    # Count distinct hotspots
    hotspots_query = db.query(
        CitizenRequest.district, CitizenRequest.category
    ).group_by(CitizenRequest.district, CitizenRequest.category).having(func.avg(CitizenRequest.priority_score) >= 75).all()
    hotspots_count = len(hotspots_query)

    # Affected population sum
    total_affected = db.query(func.sum(CitizenRequest.affected_population_estimate)).scalar() or 0

    # Channel distribution
    channel_counts = db.query(
        CitizenRequest.source, func.count(CitizenRequest.id).label("c_count")
    ).group_by(CitizenRequest.source).all()
    channels = [ChannelDistributionItem(channel=c.source or "Web", count=c.c_count) for c in channel_counts]

    # Multilingual distribution (Bengali, Kannada, Hindi, Tamil, Telugu, English)
    lang_counts = db.query(
        CitizenRequest.detected_language, func.count(CitizenRequest.id).label("l_count")
    ).group_by(CitizenRequest.detected_language).order_by(func.count(CitizenRequest.id).desc()).all()
    languages = [LanguageDistributionItem(language=l.detected_language or "English", count=l.l_count) for l in lang_counts]

    return DashboardSummaryResponse(
        total_requests=total_requests,
        high_priority_count=high_priority,
        medium_priority_count=medium_priority,
        low_priority_count=low_priority,
        hotspots_count=hotspots_count,
        estimated_population_affected=total_affected,
        brics_readiness="Architecture-ready for BRICS adaptation (Default: India)",
        channel_distribution=channels,
        language_distribution=languages
    )

@router.get("/hotspots", response_model=List[HotspotItem])
def get_dashboard_hotspots(
    state: Optional[str] = Query(None),
    min_priority: float = Query(60.0),
    db: Session = Depends(get_db)
):
    """Calculates development hotspots with public investment gap & Development Gap Score."""
    query = db.query(
        CitizenRequest.country,
        CitizenRequest.state,
        CitizenRequest.district,
        CitizenRequest.category,
        func.count(CitizenRequest.id).label("req_count"),
        func.avg(CitizenRequest.priority_score).label("avg_priority"),
        func.sum(CitizenRequest.affected_population_estimate).label("sum_pop"),
        func.avg(CitizenRequest.infrastructure_gap).label("avg_gap")
    )

    if state:
        query = query.filter(CitizenRequest.state.ilike(f"%{state}%"))

    grouped = query.group_by(
        CitizenRequest.country, CitizenRequest.state, CitizenRequest.district, CitizenRequest.category
    ).having(func.avg(CitizenRequest.priority_score) >= min_priority).order_by(
        func.avg(CitizenRequest.priority_score).desc()
    ).all()

    hotspots = []
    for g in grouped:
        dev_info = db.query(DevelopmentData).filter_by(state=g.state, district=g.district).first()
        lat = dev_info.lat if dev_info else 20.5937
        lng = dev_info.lng if dev_info else 78.9629

        pub_inv = db.query(PublicInvestment).filter_by(district=g.district, category=g.category).first()
        inv_gap = pub_inv.investment_gap_percent if pub_inv else 65.0

        avg_prio = round(float(g.avg_priority), 1)
        avg_infra_gap = round(float(g.avg_gap), 1)
        dev_gap_score = round((avg_infra_gap * 0.5) + (inv_gap * 0.5), 1)

        why = f"High citizen demand ({g.req_count} requests, avg priority {avg_prio}) combined with a {avg_infra_gap}% infrastructure gap and a {inv_gap}% public investment deficit makes this a critical development hotspot."

        hotspots.append(HotspotItem(
            country=g.country or "India",
            state=g.state,
            district=g.district,
            category=g.category,
            request_count=g.req_count,
            average_priority=avg_prio,
            estimated_affected_population=int(g.sum_pop or 0),
            infrastructure_gap=avg_infra_gap,
            investment_gap_percent=inv_gap,
            development_gap_score=dev_gap_score,
            why_hotspot=why,
            lat=lat,
            lng=lng
        ))

    return hotspots

@router.get("/categories", response_model=List[CategoryDistributionItem])
def get_categories_distribution(db: Session = Depends(get_db)):
    """Aggregates request counts, average priority scores, and average investment gaps per category."""
    results = db.query(
        CitizenRequest.category,
        func.count(CitizenRequest.id).label("cat_count"),
        func.avg(CitizenRequest.priority_score).label("avg_priority")
    ).group_by(CitizenRequest.category).order_by(func.count(CitizenRequest.id).desc()).all()

    items = []
    for r in results:
        inv_avg = db.query(func.avg(PublicInvestment.investment_gap_percent)).filter(
            PublicInvestment.category == r.category
        ).scalar() or 60.0

        items.append(CategoryDistributionItem(
            category=r.category,
            count=r.cat_count,
            average_priority=round(float(r.avg_priority), 1),
            investment_gap_avg=round(float(inv_avg), 1)
        ))

    return items

@router.get("/states", response_model=List[StateDistributionItem])
def get_states_distribution(db: Session = Depends(get_db)):
    """Aggregates request counts and high-priority flags per state."""
    results = db.query(
        CitizenRequest.state,
        func.count(CitizenRequest.id).label("st_count")
    ).group_by(CitizenRequest.state).order_by(func.count(CitizenRequest.id).desc()).all()

    items = []
    for r in results:
        hp_count = db.query(func.count(CitizenRequest.id)).filter(
            CitizenRequest.state == r.state, CitizenRequest.priority_score >= 80
        ).scalar() or 0

        items.append(StateDistributionItem(
            state=r.state,
            count=r.st_count,
            high_priority_count=hp_count
        ))

    return items
