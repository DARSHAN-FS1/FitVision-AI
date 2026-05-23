from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from typing import List

from app.schemas.schemas import (
    ScanStartRequest, ScanStartResponse,
    ScanResultRequest, ScanReportResponse, SuggestionItemSchema,
)
from app.services.firebase_admin import get_current_user, require_user_match

router = APIRouter()


def generate_report(session: ScanResultRequest) -> ScanReportResponse:
    suggestions: List[SuggestionItemSchema] = []

    if session.avg_knee_angle < 80:
        suggestions.append(SuggestionItemSchema(
            type="warning",
            title="Knee Angle Too Shallow",
            description=f"Your average knee angle was {round(session.avg_knee_angle)}°. Aim for 80–95° for optimal squat depth.",
            priority="high",
        ))
    if session.avg_back_angle < 155:
        suggestions.append(SuggestionItemSchema(
            type="warning",
            title="Back Not Upright",
            description=f"Back angle averaged {round(session.avg_back_angle)}°. Keep chest tall to protect your lumbar spine.",
            priority="high",
        ))
    if session.avg_form_score >= 85:
        suggestions.append(SuggestionItemSchema(
            type="success",
            title="Excellent Form!",
            description=f"You maintained {round(session.avg_form_score)}% form accuracy throughout the session.",
            priority="low",
        ))
    if session.total_reps >= 10:
        suggestions.append(SuggestionItemSchema(
            type="tip",
            title="Progressive Overload Ready",
            description=f"{session.total_reps} reps completed. Consider increasing weight by 5% next session.",
            priority="medium",
        ))
    suggestions.append(SuggestionItemSchema(
        type="tip",
        title="Recovery Window",
        description="Allow 48 hours before training this muscle group again for optimal recovery.",
        priority="low",
    ))

    return ScanReportResponse(
        session=session,
        posture_score=session.avg_form_score,
        suggestions=suggestions,
        improvements=[s.title for s in suggestions if s.type == "warning"],
        next_steps=[
            "Warm up with bodyweight squats next session",
            "Focus on controlled descent — 3 seconds down",
            "Film from the side for better angle feedback",
        ],
    )


@router.post("/start", response_model=ScanStartResponse)
async def start_scan(
    request: ScanStartRequest,
    current_user: dict = Depends(get_current_user),
):
    require_user_match(request.user_id, current_user)
    session_id = f"scan_{int(datetime.utcnow().timestamp() * 1000)}"
    started_at = datetime.utcnow().isoformat()
    # Optionally create a pending doc in Firestore
    return ScanStartResponse(session_id=session_id, started_at=started_at)


@router.post("/result", response_model=ScanReportResponse)
async def save_scan_result(
    session: ScanResultRequest,
    current_user: dict = Depends(get_current_user),
):
    require_user_match(session.user_id, current_user)
    # Persist to Firestore:
    # db.collection('scan_sessions').document(session.id).set(session.dict())
    report = generate_report(session)
    return report


@router.get("/history/{user_id}")
async def get_scan_history(
    user_id: str,
    limit: int = 10,
    current_user: dict = Depends(get_current_user),
):
    require_user_match(user_id, current_user)
    # Query Firestore for completed scan sessions
    return []


@router.get("/report/{session_id}")
async def get_scan_report(
    session_id: str,
    current_user: dict = Depends(get_current_user),
):
    # Fetch from Firestore
    raise HTTPException(status_code=404, detail="Session not found")
