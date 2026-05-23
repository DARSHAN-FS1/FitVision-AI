from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
import uvicorn

from app.routers import auth, profile, workouts, nutrition, scan, analytics

app = FastAPI(
    title="FitVision AI API",
    description="Production-grade AI fitness coach backend",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── Middleware ────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Tighten to your domains in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth.router,      prefix="/auth",      tags=["Auth"])
app.include_router(profile.router,   prefix="/profile",   tags=["Profile"])
app.include_router(workouts.router,  prefix="/workouts",  tags=["Workouts"])
app.include_router(nutrition.router, prefix="/nutrition", tags=["Nutrition"])
app.include_router(scan.router,      prefix="/scan",      tags=["AI Scan"])
app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])


@app.get("/")
async def root():
    return {"status": "ok", "service": "FitVision AI API", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
