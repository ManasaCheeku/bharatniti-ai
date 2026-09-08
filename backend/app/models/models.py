from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class CitizenRequest(Base):
    __tablename__ = "citizen_requests"

    id = Column(Integer, primary_key=True, index=True)
    request_id_code = Column(String(50), index=True, nullable=True) # e.g. REQ-BN-84920
    country = Column(String(50), default="India", index=True)
    source = Column(String(50), default="Web", index=True) # Web, Voice, Messaging App, Demo Dataset
    original_text = Column(Text, nullable=False)
    detected_language = Column(String(50), default="English", index=True)
    translated_text = Column(Text, nullable=True)
    state = Column(String(100), index=True, nullable=False) # Region/State
    district = Column(String(100), index=True, nullable=False)
    category = Column(String(100), index=True, nullable=False)
    subcategory = Column(String(100), nullable=True)
    issue_summary = Column(Text, nullable=True)
    urgency = Column(Float, default=50.0)
    demand = Column(Float, default=0.0)
    affected_population_factor = Column(Float, default=50.0)
    regional_vulnerability = Column(Float, default=50.0)
    priority_score = Column(Float, default=50.0)
    affected_population_estimate = Column(Integer, default=10000)
    infrastructure_gap = Column(Float, default=50.0)
    video_ref = Column(String(150), nullable=True) # Video reference if uploaded
    status = Column(String(50), default="Submitted")
    created_at = Column(DateTime, default=datetime.utcnow)

    analyses = relationship("AIAnalysis", back_populates="request", cascade="all, delete-orphan")

class DevelopmentData(Base):
    __tablename__ = "development_data"

    id = Column(Integer, primary_key=True, index=True)
    country = Column(String(50), default="India", index=True)
    region = Column(String(100), default="Karnataka")
    state = Column(String(100), index=True, nullable=False)
    district = Column(String(100), index=True, nullable=False, unique=True)
    population = Column(Integer, default=1000000)
    lat = Column(Float, default=20.5937)
    lng = Column(Float, default=78.9629)
    healthcare_facilities = Column(Integer, default=20)
    schools = Column(Integer, default=150)
    road_index = Column(Float, default=60.0)
    digital_connectivity_index = Column(Float, default=65.0)
    public_transport_index = Column(Float, default=55.0)
    water_access_index = Column(Float, default=60.0)
    vulnerability_score = Column(Float, default=60.0)

class PublicInvestment(Base):
    __tablename__ = "public_investments"

    id = Column(Integer, primary_key=True, index=True)
    country = Column(String(50), default="India", index=True)
    region = Column(String(100), default="Karnataka")
    district = Column(String(100), index=True, nullable=False)
    category = Column(String(100), index=True, nullable=False)
    planned_investment_inr_cr = Column(Float, default=50.0)
    investment_coverage_percent = Column(Float, default=40.0)
    investment_gap_percent = Column(Float, default=60.0)
    primary_funding_scheme = Column(String(150), default="National DPI Development Mission")

class AIAnalysis(Base):
    __tablename__ = "ai_analyses"

    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("citizen_requests.id"), nullable=False)
    ai_mode = Column(String(50), default="Gemini AI") # "Gemini AI" or "Demo Fallback"
    model_name = Column(String(100), default="gemini-2.5-flash")
    structured_output = Column(Text, nullable=True) # JSON string of raw extraction
    recommended_intervention = Column(Text, nullable=True)
    reasoning = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    request = relationship("CitizenRequest", back_populates="analyses")
