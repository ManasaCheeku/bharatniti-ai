import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.database import engine, Base, SessionLocal
from app.services.seed_service import seed_database
from app.routes.requests import router as requests_router
from app.routes.dashboard import router as dashboard_router
from app.routes.recommendations import router as recommendations_router

load_dotenv()

app = FastAPI(
    title="BharatNiti AI API",
    description="Multilingual Citizen-Development Intelligence Platform for Digital Public Infrastructure & Governance",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_db_event():
    """Auto-creates database tables and seeds initial demo dataset on startup."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

@app.get("/api/health", tags=["Health"])
def health_check():
    """Service health check endpoint."""
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    ai_mode = "Gemini AI Engine" if api_key else "Demo AI Mode (Fallback Active)"
    return {
        "status": "healthy",
        "service": "BharatNiti AI Engine",
        "ai_integration": ai_mode,
        "model": os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    }

app.include_router(requests_router)
app.include_router(dashboard_router)
app.include_router(recommendations_router)
