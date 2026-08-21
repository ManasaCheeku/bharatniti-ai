import os
import json
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.models import CitizenRequest, DevelopmentData, PublicInvestment, AIAnalysis
from app.services.priority_service import calculate_priority_score

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data"))

def seed_database(db: Session):
    """Populates database with seed citizen requests, district demographic indicators, and public investment data."""
    
    # 1. Seed Districts / Development Data
    districts_file = os.path.join(DATA_DIR, "districts.json")
    if os.path.exists(districts_file):
        with open(districts_file, "r", encoding="utf-8") as f:
            districts_data = json.load(f)
            
        for dist_item in districts_data:
            existing = db.query(DevelopmentData).filter_by(
                state=dist_item["state"], district=dist_item["district"]
            ).first()
            
            if not existing:
                dev_entry = DevelopmentData(
                    country=dist_item.get("country", "India"),
                    region=dist_item.get("region", dist_item["state"]),
                    state=dist_item["state"],
                    district=dist_item["district"],
                    population=dist_item.get("population", 1500000),
                    lat=dist_item.get("lat", 20.5937),
                    lng=dist_item.get("lng", 78.9629),
                    healthcare_facilities=dist_item.get("healthcare_facilities", 30),
                    schools=dist_item.get("schools", 250),
                    road_index=dist_item.get("road_index", 60.0),
                    digital_connectivity_index=dist_item.get("digital_connectivity_index", 65.0),
                    public_transport_index=dist_item.get("public_transport_index", 55.0),
                    water_access_index=dist_item.get("water_access_index", 60.0),
                    vulnerability_score=dist_item.get("vulnerability_score", 60.0)
                )
                db.add(dev_entry)
        db.commit()

    # 2. Seed Public Investment Data
    invest_file = os.path.join(DATA_DIR, "public_investment.json")
    if os.path.exists(invest_file):
        with open(invest_file, "r", encoding="utf-8") as f:
            invest_data = json.load(f)
            
        for inv in invest_data:
            existing = db.query(PublicInvestment).filter_by(
                district=inv["district"], category=inv["category"]
            ).first()
            
            if not existing:
                inv_entry = PublicInvestment(
                    country=inv.get("country", "India"),
                    region=inv.get("region", inv.get("state", "Karnataka")),
                    district=inv["district"],
                    category=inv["category"],
                    planned_investment_inr_cr=inv.get("planned_investment_inr_cr", 40.0),
                    investment_coverage_percent=inv.get("investment_coverage_percent", 35.0),
                    investment_gap_percent=inv.get("investment_gap_percent", 65.0),
                    primary_funding_scheme=inv.get("primary_funding_scheme", "State Development Scheme")
                )
                db.add(inv_entry)
        db.commit()

    # 3. Seed Citizen Requests
    requests_file = os.path.join(DATA_DIR, "citizen_requests.json")
    if os.path.exists(requests_file):
        with open(requests_file, "r", encoding="utf-8") as f:
            reqs_data = json.load(f)
            
        channels = ["Web", "Voice", "Messaging App", "Demo Dataset"]

        for idx, r_item in enumerate(reqs_data):
            existing = db.query(CitizenRequest).filter_by(
                original_text=r_item["original_text"]
            ).first()
            
            if not existing:
                u = float(r_item.get("urgency", 75))
                g = float(r_item.get("infrastructure_gap", 70))
                pop = float(r_item.get("affected_population_factor", 70))
                vuln = float(r_item.get("regional_vulnerability", 65))
                
                priority = calculate_priority_score(u, g, pop, vuln, 75.0)

                created_at_dt = datetime.utcnow()
                if "created_at" in r_item:
                    try:
                        created_at_dt = datetime.fromisoformat(r_item["created_at"])
                    except Exception:
                        pass

                source_val = r_item.get("source") or channels[idx % len(channels)]

                req_entry = CitizenRequest(
                    country=r_item.get("country", "India"),
                    source=source_val,
                    original_text=r_item["original_text"],
                    detected_language=r_item.get("detected_language", "English"),
                    translated_text=r_item.get("translated_text", r_item["original_text"]),
                    state=r_item.get("state", "Karnataka"),
                    district=r_item.get("district", "Mysuru"),
                    category=r_item.get("category", "Healthcare"),
                    subcategory=r_item.get("subcategory", "General Infrastructure"),
                    issue_summary=r_item.get("issue_summary", r_item["original_text"][:150]),
                    urgency=u,
                    priority_score=priority,
                    affected_population_estimate=int(pop * 450),
                    infrastructure_gap=g,
                    status="Analyzed",
                    created_at=created_at_dt
                )
                db.add(req_entry)
                db.flush()

                # Add matching AI Analysis entry
                ai_entry = AIAnalysis(
                    request_id=req_entry.id,
                    ai_mode="Demo AI Mode (Seeded)",
                    model_name="gemini-2.5-flash",
                    structured_output=json.dumps(r_item),
                    recommended_intervention=r_item.get("recommended_intervention", "Infrastructure upgrade required."),
                    reasoning=r_item.get("reasoning", "High citizen urgency reported.")
                )
                db.add(ai_entry)

        db.commit()
