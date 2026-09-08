# BharatNiti AI — Multilingual Citizen-Development Intelligence Platform

> **Build with AI: Code for Communities — Second Edition**  
> **Track 1**: AI for Digital Public Infrastructure & Governance  
> **Tagline**: *From Citizen Voices to Development Priorities*

---

## 🇮🇳 Project Overview

Governments across India receive thousands of citizen development requests and infrastructure grievances every day across fragmented channels and regional languages (English, Kannada, Hindi, etc.). Without intelligent consolidation, infrastructure capital is misallocated, leaving critical healthcare, road connectivity, water access, and educational gaps unaddressed.

**BharatNiti AI** transforms fragmented citizen requests into structured development intelligence. By combining Google Gemini AI (`google-genai` Python SDK) with baseline demographic and infrastructure indicators, BharatNiti AI computes transparent **AI-Assisted Development Priority Scores (0–100)**, visualizes India-wide development hotspots, and generates evidence-backed policy recommendation briefs for decision-makers.

---

## 🌟 Key Features

1. **Multilingual Citizen Intake Portal (`/citizen`)**:
   - Supports text and Web Speech API voice input.
   - Multilingual processing in **English**, **Kannada (ಕನ್ನಡ)**, **Hindi (हिंदी)**, Bengali, Tamil, and Telugu.
   - Clickable realistic preset samples for instant testing.
2. **Google Gemini AI NLU Engine**:
   - Built using official `google-genai` Python SDK.
   - Automated language detection, English translation, category classification, subcategory tagging, issue summarization, and infrastructure gap evaluation.
   - Graceful **Demo AI Mode** fallback when `GEMINI_API_KEY` is not provided in environment.
3. **Transparent Priority Scoring Model**:
   - Deterministic formula combining Demand (30%), Urgency (25%), Infrastructure Gap (20%), Affected Population (15%), and Regional Vulnerability (10%).
   - Clearly labeled as AI-assisted decision support (not official financial decisions).
4. **Policymaker Intelligence Dashboard (`/dashboard`)**:
   - High-level KPI indicators (Total Requests, High Priority Requests, Hotspots, Affected Population).
   - Recharts visual analytics (Requests by Category, State distribution, Priority distribution pie chart, Urgency trends).
   - Searchable, filterable priority ledger.
5. **Interactive Regional Hotspots View (`/hotspots`)**:
   - Leaflet + OpenStreetMap interactive geographic map view with color-coded priority indicators (High, Medium, Low).
   - Hotspot cluster cards for India-wide district level intelligence across 10 states.
6. **AI Policy Brief Studio (`/recommendations`)**:
   - Single-click policy recommendation brief generation.
   - Detailed synthesis including Problem Statement, Evidence Base, Infrastructure Gap Analysis, Implementation Roadmap, Expected Impact, and Risk Mitigation.

---

## 🏗️ System Architecture

```
                       ┌─────────────────────────┐
                       │     Citizen Portal      │
                       │ (React + Web Speech API)│
                       └────────────┬────────────┘
                                    │
                                    ▼
                       ┌─────────────────────────┐
                       │     FastAPI Backend     │
                       └────────────┬────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          │                         │                         │
          ▼                         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ Gemini AI Engine │      │ Priority Scoring │      │ Development Data │
│ (google-genai /  │      │ Engine           │      │ Layer            │
│  Demo Fallback)  │      │ (Deterministic)  │      │ (SQLite DB)      │
└──────────────────┘      └──────────────────┘      └──────────────────┘
          │                         │                         │
          └─────────────────────────┼─────────────────────────┘
                                    │
                                    ▼
                       ┌─────────────────────────┐
                       │  Policymaker Dashboard  │
                       │    (Recharts & Map)     │
                       └────────────┬────────────┘
```

---

## 🧮 Priority Scoring Formula

The AI Priority Score is computed deterministically in the backend:

$$\text{Priority Score} = (0.30 \times \text{Demand}) + (0.25 \times \text{Urgency}) + (0.20 \times \text{Infra Gap}) + (0.15 \times \text{Affected Pop}) + (0.10 \times \text{Vulnerability})$$

---

## 🗺️ India-Wide Scalability & Coverage

The repository currently includes **12 synthetic citizen requests** across **6 Indian States**. The district reference layer covers the intended 10-state design:
- Karnataka
- Maharashtra
- Tamil Nadu
- Kerala
- Uttar Pradesh
- Bihar
- Rajasthan
- Gujarat
- West Bengal
- Telangana

Across the represented request data, categories include Healthcare, Education, Roads, Public Transport, and Water & Sanitation. Synthetic data is for demonstration and is not official government statistics.

---

## ⚡ Quickstart & Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Configure Environment Variables
Copy `.env.example` to `.env` in `backend/`:
```bash
cp backend/.env.example backend/.env
```
Edit `backend/.env`:
```env
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
DATABASE_URL=sqlite:///./bharatniti.db
PORT=8000
```

### 2. Backend Setup & Database Seeding
```bash
# Navigate to project root
cd bharatniti-ai

# Install backend dependencies
pip install -r backend/requirements.txt

# Run database table creation and seed script (seeds 50 realistic requests)
python backend/seed_db.py

# Start FastAPI Uvicorn backend server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The backend server will run at `http://localhost:8000`. API documentation is available at `http://localhost:8000/docs`.

### 3. Frontend Setup
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install frontend npm dependencies
npm install

# Start Vite React development server
npm run dev
```

The frontend application will be available at `http://localhost:3000`.

---

## 🛠️ API Reference

- `GET /api/health`: Health status & AI engine active mode.
- `POST /api/requests`: Submit & analyze citizen request.
- `GET /api/requests`: List all citizen requests.
- `POST /api/requests/analyze`: Ad-hoc request analysis test.
- `GET /api/dashboard/summary`: High-level KPI indicators.
- `GET /api/dashboard/hotspots`: Regional hotspot aggregations.
- `GET /api/dashboard/categories`: Request distributions by category.
- `GET /api/dashboard/states`: Request distributions by state.
- `POST /api/recommendations/generate`: Generate AI Policy Brief.

---

## 🚀 Deployment Instructions

- **Backend**: Containerize with Docker and deploy to **Google Cloud Run** or Railway.
- **Frontend**: Deploy to **Vercel** or Netlify with `VITE_API_BASE_URL` pointing to the deployed backend URL.

---

## 📝 Synthetic Demo Data Notice

> **Important Hackathon Note**: All citizen request texts and district baseline metrics included in this prototype are synthetic demo samples created for hackathon testing purposes and do not represent official government statistical publications or financial allocations.
