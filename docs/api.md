# BharatNiti AI — REST API Documentation

Base URL: `http://localhost:8000`

---

## Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Service health status |
| `POST` | `/api/requests` | Submit & analyze a citizen request |
| `GET` | `/api/requests` | List all submitted citizen requests |
| `GET` | `/api/requests/{id}` | Retrieve single request with detailed AI analysis |
| `POST` | `/api/requests/analyze` | Run ad-hoc AI analysis without database persistence |
| `GET` | `/api/dashboard/summary` | High-level KPI indicators |
| `GET` | `/api/dashboard/hotspots` | Regional hotspot aggregations |
| `GET` | `/api/dashboard/categories` | Request distributions by category |
| `GET` | `/api/dashboard/states` | Request distributions by state |
| `POST` | `/api/recommendations/generate` | Generate AI Policy Brief for a hotspot |

---

## Detailed Endpoint Contracts

### 1. `POST /api/requests`
**Request Body**:
```json
{
  "original_text": "ನಮ್ಮ ಗ್ರಾಮದಲ್ಲಿ ಆಸ್ಪತ್ರೆ ಇಲ್ಲ.",
  "detected_language": "Kannada",
  "state": "Karnataka",
  "district": "Mysuru",
  "category": "Healthcare"
}
```

**Response (200 OK)**:
```json
{
  "id": 1,
  "original_text": "ನಮ್ಮ ಗ್ರಾಮದಲ್ಲಿ ಆಸ್ಪತ್ರೆ ಇಲ್ಲ.",
  "detected_language": "Kannada",
  "translated_text": "There is no hospital in our village.",
  "state": "Karnataka",
  "district": "Mysuru",
  "category": "Healthcare",
  "subcategory": "Primary Healthcare Access",
  "issue_summary": "Absence of nearby hospital in rural area.",
  "urgency": 90,
  "priority_score": 88.5,
  "affected_population_estimate": 42000,
  "infrastructure_gap": 85,
  "recommended_intervention": "Establish a 24/7 Primary Health Centre in the block.",
  "created_at": "2026-08-21T23:15:00",
  "ai_mode": "Gemini 1.5 Flash"
}
```

### 2. `POST /api/recommendations/generate`
**Request Body**:
```json
{
  "state": "Karnataka",
  "district": "Mysuru",
  "category": "Healthcare"
}
```

**Response (200 OK)**:
```json
{
  "state": "Karnataka",
  "district": "Mysuru",
  "category": "Healthcare",
  "problem_summary": "High rural travel time for urgent medical emergencies.",
  "evidence": "24 citizen requests submitted reporting 30km travel distances.",
  "infrastructure_gap_analysis": "District healthcare facility density is 40% below national benchmark.",
  "recommended_intervention": "Construct a 30-bed upgraded Community Health Centre.",
  "implementation_roadmap": [
    "Phase 1: Land allocation & site survey (Months 1-2)",
    "Phase 2: Equipment procurement & building construction (Months 3-8)",
    "Phase 3: Staff staffing & operationalization (Months 9-12)"
  ],
  "expected_impact": "Will benefit ~45,000 rural residents and reduce emergency transport time by 75%.",
  "ai_mode": "Gemini 1.5 Flash"
}
```
