from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

class RequestAnalyzeInput(BaseModel):
    original_text: str = Field(..., min_length=5, description="Citizen grievance or request text")
    language: Optional[str] = Field("Auto-detect", description="Specified input language or Auto-detect")
    country: Optional[str] = Field("India", description="Country context (Default: India)")
    source: Optional[str] = Field("Web", description="Input channel: Web, Voice, Messaging App")
    state: Optional[str] = Field(None, description="Target state if specified")
    district: Optional[str] = Field(None, description="Target district if specified")
    category: Optional[str] = Field(None, description="Category override if specified")

class RequestCreateInput(BaseModel):
    original_text: str = Field(..., min_length=5)
    language: Optional[str] = "Auto-detect"
    country: Optional[str] = "India"
    source: Optional[str] = "Web"
    state: Optional[str] = None
    district: Optional[str] = None
    category: Optional[str] = None
    video_ref: Optional[str] = None

class AIAnalysisResult(BaseModel):
    request_id_code: Optional[str] = None
    detected_language: str
    translated_text: str
    category: str
    subcategory: str
    issue_summary: str
    country: str = "India"
    state: str
    district: str
    source: str = "Web"
    urgency: float
    infrastructure_gap: float
    affected_population_factor: float
    regional_vulnerability: float
    recommended_intervention: str
    reasoning: str
    priority_score: float
    affected_population_estimate: int
    video_ref: Optional[str] = None
    ai_mode: str
    model_name: str
    raw_output: Optional[Dict[str, Any]] = None

class CitizenRequestResponse(BaseModel):
    id: int
    request_id_code: Optional[str] = None
    country: str = "India"
    source: str = "Web"
    original_text: str
    detected_language: str
    translated_text: Optional[str]
    state: str
    district: str
    category: str
    subcategory: Optional[str]
    issue_summary: Optional[str]
    urgency: float
    priority_score: float
    affected_population_estimate: int
    infrastructure_gap: float
    video_ref: Optional[str] = None
    status: str
    created_at: datetime
    ai_mode: Optional[str] = "Demo AI Mode"

    class Config:
        from_attributes = True

class ChannelDistributionItem(BaseModel):
    channel: str
    count: int

class LanguageDistributionItem(BaseModel):
    language: str
    count: int

class DashboardSummaryResponse(BaseModel):
    total_requests: int
    high_priority_count: int
    medium_priority_count: int
    low_priority_count: int
    hotspots_count: int
    estimated_population_affected: int
    brics_readiness: str = "Architecture-ready for BRICS adaptation (Default: India)"
    channel_distribution: List[ChannelDistributionItem] = []
    language_distribution: List[LanguageDistributionItem] = []

class HotspotItem(BaseModel):
    country: str = "India"
    state: str
    district: str
    category: str
    request_count: int
    average_priority: float
    estimated_affected_population: int
    infrastructure_gap: float
    investment_gap_percent: float = 65.0
    development_gap_score: float = 82.5
    why_hotspot: str = "High citizen demand combined with infrastructure and public investment gaps."
    lat: float
    lng: float

class CategoryDistributionItem(BaseModel):
    category: str
    count: int
    average_priority: float
    investment_gap_avg: float = 60.0

class StateDistributionItem(BaseModel):
    state: str
    count: int
    high_priority_count: int

class RecommendationInput(BaseModel):
    country: Optional[str] = "India"
    state: str
    district: str
    category: str

class RecommendationResponse(BaseModel):
    country: str = "India"
    state: str
    district: str
    category: str
    problem_summary: str
    evidence: str
    infrastructure_gap_analysis: str
    public_investment_context: str = "Illustrative public investment gap analysis based on demo indicators."
    affected_population_estimate: int
    recommended_intervention: str
    implementation_roadmap: List[str]
    expected_impact: str
    risk_mitigation: str
    success_indicators: List[str]
    ai_mode: str
    disclaimer: str = "Illustrative AI-generated decision-support recommendation — not an official government decision or budget."
