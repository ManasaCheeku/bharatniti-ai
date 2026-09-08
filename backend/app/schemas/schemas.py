from datetime import datetime
from typing import List, Optional, Any, Dict, Literal
from pydantic import BaseModel, ConfigDict, Field, model_validator

SUPPORTED_STATES = (
    "Karnataka", "Maharashtra", "Tamil Nadu", "Kerala", "Uttar Pradesh",
    "Bihar", "Rajasthan", "Gujarat", "West Bengal", "Telangana"
)
SUPPORTED_DISTRICTS = (
    "Mysuru", "Belagavi", "Shivamogga", "Mandya", "Bengaluru Urban",
    "Varanasi", "Mirzapur", "Latur", "Thane", "Mumbai Suburban", "Gaya",
    "Darbhanga", "Barmer", "Jalor", "Dharmapuri", "Warangal", "Dahod", "Bankura", "Palakkad"
)
SUPPORTED_CATEGORIES = (
    "Healthcare", "Education", "Roads", "Public Transport", "Water & Sanitation",
    "Electricity", "Digital Infrastructure", "Housing", "Agriculture", "Environment",
    "Public Safety", "Other"
)
SUPPORTED_LANGUAGES = ("Auto-detect", "English", "Kannada", "Hindi", "Bengali", "Tamil", "Telugu", "Malayalam", "Gujarati")
SUPPORTED_SOURCES = ("Web", "Voice", "Messaging App", "Demo Dataset")

class RequestAnalyzeInput(BaseModel):
    model_config = ConfigDict(extra="forbid")

    original_text: str = Field(..., min_length=5, max_length=6000, description="Citizen grievance or request text")
    language: Literal[SUPPORTED_LANGUAGES] = Field("Auto-detect", description="Specified input language or Auto-detect")
    country: Literal["India"] = Field("India", description="Country context")
    source: Literal[SUPPORTED_SOURCES] = Field("Web", description="Input channel")
    state: Optional[Literal[SUPPORTED_STATES]] = Field(None, description="Target state if specified")
    district: Optional[Literal[SUPPORTED_DISTRICTS]] = Field(None, description="Target district if specified")
    category: Optional[Literal[SUPPORTED_CATEGORIES]] = Field(None, description="Category override if specified")

    @model_validator(mode="after")
    def validate_location(self):
        if self.district and not self.state:
            return self
        if self.state and self.district:
            state_districts = {
                "Karnataka": {"Mysuru", "Belagavi", "Shivamogga", "Mandya", "Bengaluru Urban"},
                "Maharashtra": {"Latur", "Thane", "Mumbai Suburban"},
                "Tamil Nadu": {"Dharmapuri"}, "Kerala": {"Palakkad"},
                "Uttar Pradesh": {"Varanasi", "Mirzapur"}, "Bihar": {"Gaya", "Darbhanga"},
                "Rajasthan": {"Barmer", "Jalor"}, "Gujarat": {"Dahod"},
                "West Bengal": {"Bankura"}, "Telangana": {"Warangal"}
            }
            if self.district not in state_districts[self.state]:
                raise ValueError("District is not valid for the selected state")
        return self

class RequestCreateInput(BaseModel):
    model_config = ConfigDict(extra="forbid")

    original_text: str = Field(..., min_length=5, max_length=6000)
    language: Literal[SUPPORTED_LANGUAGES] = "Auto-detect"
    country: Literal["India"] = "India"
    source: Literal[SUPPORTED_SOURCES] = "Web"
    state: Optional[Literal[SUPPORTED_STATES]] = None
    district: Optional[Literal[SUPPORTED_DISTRICTS]] = None
    category: Optional[Literal[SUPPORTED_CATEGORIES]] = None
    video_ref: Optional[str] = Field(None, max_length=120, pattern=r"^[A-Za-z0-9._-]+$")

    @model_validator(mode="after")
    def validate_location(self):
        if self.state and self.district:
            state_districts = {
                "Karnataka": {"Mysuru", "Belagavi", "Shivamogga", "Mandya", "Bengaluru Urban"},
                "Maharashtra": {"Latur", "Thane", "Mumbai Suburban"}, "Tamil Nadu": {"Dharmapuri"},
                "Kerala": {"Palakkad"}, "Uttar Pradesh": {"Varanasi", "Mirzapur"},
                "Bihar": {"Gaya", "Darbhanga"}, "Rajasthan": {"Barmer", "Jalor"},
                "Gujarat": {"Dahod"}, "West Bengal": {"Bankura"}, "Telangana": {"Warangal"}
            }
            if self.district not in state_districts[self.state]:
                raise ValueError("District is not valid for the selected state")
        return self

class AIAnalysisResult(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

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
    demand: float = 0.0
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
    demand: float = 0.0
    affected_population_factor: float = 0.0
    regional_vulnerability: float = 0.0
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
    average_infrastructure_gap: float = 0.0
    average_demand: float = 0.0
    average_priority: float = 0.0
    average_investment_gap: float = 0.0
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
    investment_gap_percent: Optional[float] = None
    development_gap_score: Optional[float] = None
    why_hotspot: str = "High citizen demand combined with infrastructure and public investment gaps."
    lat: float
    lng: float

class CategoryDistributionItem(BaseModel):
    category: str
    count: int
    average_priority: float
    investment_gap_avg: Optional[float] = None

class StateDistributionItem(BaseModel):
    state: str
    count: int
    high_priority_count: int

class RecommendationInput(BaseModel):
    model_config = ConfigDict(extra="forbid")

    country: Literal["India"] = "India"
    state: Literal[SUPPORTED_STATES]
    district: Literal[SUPPORTED_DISTRICTS]
    category: Literal[SUPPORTED_CATEGORIES]

    @model_validator(mode="after")
    def validate_location(self):
        location_map = {
            "Karnataka": {"Mysuru", "Belagavi", "Shivamogga", "Mandya", "Bengaluru Urban"},
            "Maharashtra": {"Latur", "Thane", "Mumbai Suburban"}, "Tamil Nadu": {"Dharmapuri"},
            "Kerala": {"Palakkad"}, "Uttar Pradesh": {"Varanasi", "Mirzapur"},
            "Bihar": {"Gaya", "Darbhanga"}, "Rajasthan": {"Barmer", "Jalor"},
            "Gujarat": {"Dahod"}, "West Bengal": {"Bankura"}, "Telangana": {"Warangal"}
        }
        if self.district not in location_map[self.state]:
            raise ValueError("District is not valid for the selected state")
        return self

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
