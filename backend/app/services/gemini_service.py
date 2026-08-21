import os
import json
import random
import logging
from typing import Dict, Any
from dotenv import load_dotenv
from app.services.priority_service import calculate_priority_score

load_dotenv()

logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

def _generate_request_id() -> str:
    return f"REQ-BN-{random.randint(10000, 99999)}"

# Fallback analyzer data generator
def _get_fallback_analysis(text: str, user_state: str = None, user_district: str = None, user_cat: str = None, user_country: str = "India", user_source: str = "Web") -> Dict[str, Any]:
    """Provides realistic fallback structured output when Gemini API key is unavailable or fails."""
    lower_text = text.lower()
    
    # Language detection heuristics for 6 supported languages
    if any(b in text for b in ["আমাদের", "হাসপাতাল", "গ্রামের", "সমস্যা", "জল", "স্কুল", "রাস্তা"]):
        detected_lang = "Bengali"
        translated = "Our village lacks essential hospital/road/school/water infrastructure."
        state_def = "West Bengal"
        dist_def = "Bankura"
    elif any(k in text for k in ["ನಮ್ಮ", "ಆಸ್ಪತ್ರೆ", "ಗ್ರಾಮದಲ್ಲಿ", "ರಸ್ತೆ", "ಶೌಚಾಲಯ", "ಕೃಷಿ", "ಶಾಲೆ"]):
        detected_lang = "Kannada"
        translated = "Our village lacks essential hospital/road/school/water infrastructure."
        state_def = "Karnataka"
        dist_def = "Mysuru"
    elif any(h in text for h in ["हमारे", "गांव", "अस्पताल", "सड़क", "स्कूल", "पानी", "बिजली"]):
        detected_lang = "Hindi"
        translated = "Our village lacks proper hospital/road/school/water infrastructure."
        state_def = "Uttar Pradesh"
        dist_def = "Varanasi"
    elif any(t in text for t in ["எங்கள்", "மருத்துவமனை", "கிராமத்தில்", "பள்ளி", "தண்ணீர்", "சாலை"]):
        detected_lang = "Tamil"
        translated = "Our village lacks essential hospital/road/school/water infrastructure."
        state_def = "Tamil Nadu"
        dist_def = "Dharmapuri"
    elif any(te in text for te in ["మా", "ఆసుపత్రి", "గ్రామంలో", "బడి", "నీరు", "రోడ్డు"]):
        detected_lang = "Telugu"
        translated = "Our village lacks essential hospital/road/school/water infrastructure."
        state_def = "Telangana"
        dist_def = "Warangal"
    else:
        detected_lang = "English"
        translated = text
        state_def = "Karnataka"
        dist_def = "Mysuru"

    # Category matching
    if any(w in lower_text for w in ["hospital", "doctor", "health", "nurse", "medical", "ಆಸ್ಪತ್ರೆ", "अस्पताल", "হাসপাতাল", "மருத்துவமனை", "ఆసుపత్రి"]):
        cat = "Healthcare"
        subcat = "Primary Healthcare Access"
        summary = "Shortage or absence of accessible healthcare facility and medical staff."
        urgency = 90
        gap = 88
        pop_factor = 80
        vuln = 75
        intervention = "Construct a 24/7 Primary Health Centre with emergency transport access."
        reasoning = "Lack of nearby healthcare creates high risk during emergency travel."
    elif any(w in lower_text for w in ["road", "bridge", "pavement", "highway", "ರಸ್ತೆ", "सड़क", "রাস্তা", "சாலை", "రోడ్డు"]):
        cat = "Roads"
        subcat = "Rural All-Weather Road Connectivity"
        summary = "Poor road condition or missing bridge blocking access during monsoons."
        urgency = 86
        gap = 82
        pop_factor = 85
        vuln = 65
        intervention = "Upgrade rural village road to all-weather paved road."
        reasoning = "Unpaved road blocks emergency vehicles and restricts economic access."
    elif any(w in lower_text for w in ["water", "drinking", "scarcity", "pipe", "ನೀರು", "पानी", "জল", "தண்ணீர்", "నీరు"]):
        cat = "Water & Sanitation"
        subcat = "Piped Drinking Water Supply"
        summary = "Severe drinking water scarcity or non-functional tap water scheme."
        urgency = 94
        gap = 90
        pop_factor = 90
        vuln = 85
        intervention = "Accelerate Jal Jeevan Mission bulk water pipeline and tank commissioning."
        reasoning = "Clean drinking water scarcity poses immediate public health risks."
    elif any(w in lower_text for w in ["school", "teacher", "toilet", "education", "ಶಾಲೆಯಲ್ಲಿ", "स्कूल", "স্কুল", "பள்ளி", "బడి"]):
        cat = "Education"
        subcat = "School Infrastructure & Staffing"
        summary = "Inadequate school building repair, sanitation facilities, or teacher deficit."
        urgency = 84
        gap = 80
        pop_factor = 75
        vuln = 70
        intervention = "Repair school infrastructure, construct functional toilets, and assign teachers."
        reasoning = "Inadequate facilities impair literacy retention and female student attendance."
    else:
        cat = user_cat or "Digital Infrastructure"
        subcat = "Public Infrastructure Enhancement"
        summary = "Community request for localized infrastructure development and public service upgrade."
        urgency = 78
        gap = 75
        pop_factor = 70
        vuln = 65
        intervention = "Deploy targeted public infrastructure investment and municipal services."
        reasoning = "Community feedback indicates unfulfilled local public infrastructure demand."

    state = user_state or state_def
    district = user_district or dist_def
    country = user_country or "India"
    source = user_source or "Web"
    req_code = _generate_request_id()
    
    # Priority calculation
    priority = calculate_priority_score(urgency, gap, pop_factor, vuln, 75.0)

    return {
        "request_id_code": req_code,
        "detected_language": detected_lang,
        "translated_text": translated,
        "category": cat,
        "subcategory": subcat,
        "issue_summary": summary,
        "country": country,
        "state": state,
        "district": district,
        "source": source,
        "urgency": float(urgency),
        "infrastructure_gap": float(gap),
        "affected_population_factor": float(pop_factor),
        "regional_vulnerability": float(vuln),
        "recommended_intervention": intervention,
        "reasoning": reasoning,
        "priority_score": float(priority),
        "affected_population_estimate": int(pop_factor * 500),
        "ai_mode": "Demo AI Mode",
        "model_name": "Fallback Analyzer (Demo)",
        "raw_output": None
    }


def analyze_citizen_request(text: str, user_state: str = None, user_district: str = None, user_cat: str = None, user_country: str = "India", user_source: str = "Web") -> Dict[str, Any]:
    """
    Analyzes citizen request text using Google Gemini API (`google-genai` SDK).
    Falls back gracefully to Demo AI Mode if API Key is missing or request fails.
    """
    api_key = os.getenv("GEMINI_API_KEY", "").strip()

    if not api_key:
        logger.info("GEMINI_API_KEY is not set. Operating in Demo AI Mode.")
        return _get_fallback_analysis(text, user_state, user_district, user_cat, user_country, user_source)

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)

        prompt = f"""
You are an expert AI governance analyst for the Digital Public Infrastructure platform (BharatNiti AI).
Analyze the following citizen request:
"{text}"

User context hints (if provided):
Country: {user_country or 'India'}
State/Region: {user_state or 'Unknown'}
District: {user_district or 'Unknown'}
Category: {user_cat or 'Unknown'}
Input Channel Source: {user_source or 'Web'}

Identify and return a valid JSON object matching this schema exactly:
{{
  "detected_language": "Bengali / Kannada / Hindi / Tamil / Telugu / English / etc.",
  "translated_text": "English translation of original text",
  "category": "Healthcare / Education / Roads / Public Transport / Water & Sanitation / Electricity / Digital Infrastructure / Housing / Agriculture / Environment / Public Safety / Other",
  "subcategory": "Specific subcategory title",
  "issue_summary": "1-2 sentence core grievance summary",
  "country": "Country name (Default: India)",
  "state": "State/Region name",
  "district": "District/City name",
  "urgency": 0-100 numeric score,
  "infrastructure_gap": 0-100 numeric score,
  "affected_population_factor": 0-100 numeric score,
  "regional_vulnerability": 0-100 numeric score,
  "recommended_intervention": "Actionable development policy intervention",
  "reasoning": "Clear justification for urgency and priority"
}}
"""
        response = client.models.generate_content(
            model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )

        raw_json = json.loads(response.text)
        
        # Calculate transparent priority score deterministically
        u = float(raw_json.get("urgency", 75))
        g = float(raw_json.get("infrastructure_gap", 75))
        pop = float(raw_json.get("affected_population_factor", 70))
        vuln = float(raw_json.get("regional_vulnerability", 65))
        
        priority = calculate_priority_score(u, g, pop, vuln, 75.0)

        st = user_state or raw_json.get("state") or "Karnataka"
        dist = user_district or raw_json.get("district") or "Mysuru"
        cat = user_cat or raw_json.get("category") or "Healthcare"
        cntry = user_country or raw_json.get("country") or "India"
        req_code = _generate_request_id()

        return {
            "request_id_code": req_code,
            "detected_language": raw_json.get("detected_language", "English"),
            "translated_text": raw_json.get("translated_text", text),
            "category": cat,
            "subcategory": raw_json.get("subcategory", "General Infrastructure"),
            "issue_summary": raw_json.get("issue_summary", text[:150]),
            "country": cntry,
            "state": st,
            "district": dist,
            "source": user_source or "Web",
            "urgency": u,
            "infrastructure_gap": g,
            "affected_population_factor": pop,
            "regional_vulnerability": vuln,
            "recommended_intervention": raw_json.get("recommended_intervention", "Infrastructure upgrade required."),
            "reasoning": raw_json.get("reasoning", "High citizen demand reported."),
            "priority_score": priority,
            "affected_population_estimate": int(pop * 450),
            "ai_mode": "Gemini AI Engine",
            "model_name": os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
            "raw_output": raw_json
        }

    except Exception as e:
        logger.error(f"Gemini API execution failed: {str(e)}. Falling back to Demo AI Mode.")
        return _get_fallback_analysis(text, user_state, user_district, user_cat, user_country, user_source)


def generate_policy_brief(state: str, district: str, category: str, country: str = "India", citizen_requests_count: int = 15, avg_priority: float = 85.0) -> Dict[str, Any]:
    """Generates an evidence-backed AI Policy Brief including public investment context."""
    api_key = os.getenv("GEMINI_API_KEY", "").strip()

    fallback_response = {
        "country": country,
        "state": state,
        "district": district,
        "category": category,
        "problem_summary": f"High citizen demand and infrastructure bottleneck detected in {category} across {district}, {state} ({country}).",
        "evidence": f"Analyzed {citizen_requests_count} verified citizen requests with an average AI priority score of {avg_priority:.1f}/100.",
        "infrastructure_gap_analysis": f"District {category} infrastructure metrics indicate a 42% gap compared to national DPI benchmarks.",
        "public_investment_context": f"Public investment coverage in {category} for {district} is currently at 35%, leaving a 65% funding and execution gap.",
        "affected_population_estimate": citizen_requests_count * 1800,
        "recommended_intervention": f"Deploy targeted infrastructure enhancement program for {category} in {district} under State Development Mission.",
        "implementation_roadmap": [
            "Phase 1 (Months 1-2): Comprehensive site feasibility survey and public investment alignment.",
            "Phase 2 (Months 3-6): Tendering, vendor onboarding, and civil works initiation.",
            "Phase 3 (Months 7-10): Equipment installation and quality assurance testing.",
            "Phase 4 (Months 11-12): Operational handover, staff training, and citizen feedback loop monitoring."
        ],
        "expected_impact": f"Will directly resolve core accessibility challenges for ~{citizen_requests_count * 1800:,} citizens and reduce emergency transit time by 60%.",
        "risk_mitigation": "Establish a joint District Monitoring Committee and implement real-time geo-tagged construction tracking.",
        "success_indicators": [
            "100% reduction in unserviced citizen complaints in targeted block",
            "Average access distance reduced to under 5 km",
            "Continuous 24/7 facility operational uptime"
        ],
        "ai_mode": "Demo AI Mode (Fallback)",
        "disclaimer": "Illustrative AI-generated decision-support recommendation — not an official government decision or budget."
    }

    if not api_key:
        return fallback_response

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)

        prompt = f"""
You are a senior policy architect for Digital Public Infrastructure & Governance.
Generate an evidence-backed AI Policy Recommendation Brief for:
Country: {country}
State/Region: {state}
District: {district}
Category: {category}
Citizen Demand Count: {citizen_requests_count}
Average Priority Score: {avg_priority}

Return valid JSON with these exact keys:
{{
  "problem_summary": "Detailed problem statement",
  "evidence": "Synthesized evidence from citizen request metrics",
  "infrastructure_gap_analysis": "Comparative infrastructure gap analysis",
  "public_investment_context": "Public investment gap context",
  "affected_population_estimate": 45000,
  "recommended_intervention": "Actionable government policy intervention",
  "implementation_roadmap": [
    "Phase 1: ...",
    "Phase 2: ...",
    "Phase 3: ...",
    "Phase 4: ..."
  ],
  "expected_impact": "Quantifiable expected public impact",
  "risk_mitigation": "Key risk factors and mitigation strategies",
  "success_indicators": [
    "Metric 1",
    "Metric 2"
  ]
}}
"""
        response = client.models.generate_content(
            model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        raw_json = json.loads(response.text)
        raw_json["country"] = country
        raw_json["state"] = state
        raw_json["district"] = district
        raw_json["category"] = category
        raw_json["ai_mode"] = "Gemini AI Engine"
        raw_json["disclaimer"] = "Illustrative AI-generated decision-support recommendation — not an official government decision or budget."
        return raw_json
    except Exception as e:
        logger.error(f"Gemini Policy Brief generation failed: {str(e)}")
        return fallback_response
