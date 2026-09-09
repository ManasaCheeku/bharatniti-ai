import os
import time
from collections import defaultdict, deque
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

from sqlalchemy import inspect, text
from app.database import engine, Base, SessionLocal
from app.services.seed_service import seed_database, backfill_request_metrics
from app.services.gemini_service import get_configured_gemini_api_key
from app.routes.requests import router as requests_router
from app.routes.dashboard import router as dashboard_router
from app.routes.recommendations import router as recommendations_router

load_dotenv()

def _configured_origins() -> list[str]:
    vercel_url = os.getenv("VERCEL_URL")
    default_origins = "http://localhost:3000,http://127.0.0.1:3000"
    if vercel_url:
        default_origins += f",https://{vercel_url}"
    configured = os.getenv("CORS_ORIGINS", default_origins)
    return [origin.strip() for origin in configured.split(",") if origin.strip() and origin.strip() != "*"]


MAX_REQUEST_BODY_BYTES = int(os.getenv("MAX_REQUEST_BODY_BYTES", "262144"))
RATE_LIMIT_WINDOW_SECONDS = 60
RATE_LIMITS = {
    "/api/requests": 30,
    "/api/requests/analyze": 30,
    "/api/recommendations/generate": 20,
}
_rate_limit_buckets = defaultdict(deque)

app = FastAPI(
    title="BharatNiti AI API",
    description="Multilingual Citizen-Development Intelligence Platform for Digital Public Infrastructure & Governance",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=_configured_origins(),
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


@app.middleware("http")
async def security_middleware(request: Request, call_next):
    content_length = request.headers.get("content-length")
    if content_length:
        try:
            if int(content_length) > MAX_REQUEST_BODY_BYTES:
                return JSONResponse(status_code=413, content={"detail": "Request body is too large"})
        except ValueError:
            return JSONResponse(status_code=400, content={"detail": "Invalid Content-Length header"})
    elif request.method in {"POST", "PUT", "PATCH"}:
        body = await request.body()
        if len(body) > MAX_REQUEST_BODY_BYTES:
            return JSONResponse(status_code=413, content={"detail": "Request body is too large"})

    limit = RATE_LIMITS.get(request.url.path) if request.method == "POST" else None
    if limit:
        client_ip = request.client.host if request.client else "unknown"
        bucket_key = f"{client_ip}:{request.url.path}"
        now = time.monotonic()
        bucket = _rate_limit_buckets[bucket_key]
        while bucket and now - bucket[0] >= RATE_LIMIT_WINDOW_SECONDS:
            bucket.popleft()
        if len(bucket) >= limit:
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Please try again later."},
                headers={"Retry-After": str(RATE_LIMIT_WINDOW_SECONDS)}
            )
        bucket.append(now)

    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["Permissions-Policy"] = "camera=(self), microphone=(self), geolocation=(self)"
    return response


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    import logging
    logging.getLogger(__name__).exception("Unhandled API exception")
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})

@app.on_event("startup")
def startup_db_event():
    """Auto-creates database tables and seeds initial demo dataset on startup."""
    Base.metadata.create_all(bind=engine)
    existing_columns = {column["name"] for column in inspect(engine).get_columns("citizen_requests")}
    missing_columns = {
        "demand": "FLOAT DEFAULT 0",
        "affected_population_factor": "FLOAT DEFAULT 50",
        "regional_vulnerability": "FLOAT DEFAULT 50"
    }
    for column_name, column_definition in missing_columns.items():
        if column_name not in existing_columns:
            with engine.begin() as connection:
                connection.execute(text(f"ALTER TABLE citizen_requests ADD COLUMN {column_name} {column_definition}"))
    db = SessionLocal()
    try:
        seed_database(db)
        backfill_request_metrics(db)
    finally:
        db.close()

@app.get("/api/health", tags=["Health"])
def health_check():
    """Service health check endpoint."""
    api_key = get_configured_gemini_api_key()
    ai_mode = "Gemini AI Engine" if api_key else "Demo AI Mode (Fallback Active)"
    return {
        "status": "healthy",
        "service": "BharatNiti AI Engine",
        "ai_integration": ai_mode,
        "model": os.getenv("GEMINI_MODEL", "gemini-3.6-flash"),
        "gemini_configured": bool(api_key)
    }

app.include_router(requests_router)
app.include_router(dashboard_router)
app.include_router(recommendations_router)
