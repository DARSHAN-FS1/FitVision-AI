from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from datetime import datetime, timedelta

from app.schemas.schemas import WorkoutSessionLog, WorkoutSessionResponse
from app.services.firebase_admin import get_current_user, require_user_match

router = APIRouter()

MOCK_PLANS = [
    {
        "id": "plan_ppl", "name": "Push Pull Legs", "category": "strength",
        "difficulty": "intermediate", "duration_minutes": 45,
        "exercise_count": 6, "thumbnail_emoji": "🏋️", "is_ai_recommended": True,
    },
    {
        "id": "plan_morning_yoga", "name": "Morning Yoga Flow", "category": "yoga",
        "difficulty": "beginner", "duration_minutes": 20,
        "exercise_count": 8, "thumbnail_emoji": "🧘", "is_ai_recommended": False,
    },
    {
        "id": "plan_hiit", "name": "HIIT Cardio Blast", "category": "cardio",
        "difficulty": "advanced", "duration_minutes": 25,
        "exercise_count": 10, "thumbnail_emoji": "🔥", "is_ai_recommended": True,
    },
]


@router.get("/plans")
async def get_plans(
    category: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user),
):
    plans = MOCK_PLANS
    if category:
        plans = [p for p in plans if p["category"] == category]
    if difficulty:
        plans = [p for p in plans if p["difficulty"] == difficulty]
    return plans


@router.post("/log", response_model=WorkoutSessionResponse)
async def log_session(
    session: WorkoutSessionLog,
    current_user: dict = Depends(get_current_user),
):
    require_user_match(session.user_id, current_user)

    session_id = f"session_{int(datetime.utcnow().timestamp() * 1000)}"
    # Persist to Firestore / PostgreSQL
    # db.collection('workout_sessions').document(session_id).set({...session.dict(), 'id': session_id})

    return WorkoutSessionResponse(
        id=session_id,
        **session.model_dump(),
    )


@router.get("/history/{user_id}")
async def get_history(
    user_id: str,
    limit: int = Query(10, le=50),
    current_user: dict = Depends(get_current_user),
):
    require_user_match(user_id, current_user)
    # Query Firestore:
    # sessions = db.collection('workout_sessions')
    #     .where('user_id', '==', user_id)
    #     .order_by('started_at', direction=firestore.Query.DESCENDING)
    #     .limit(limit).stream()
    return []


@router.get("/stats/{user_id}")
async def get_stats(
    user_id: str,
    current_user: dict = Depends(get_current_user),
):
    require_user_match(user_id, current_user)
    return {
        "total_sessions": 42,
        "total_duration_minutes": 1840,
        "total_calories": 24600,
        "avg_session_duration": 43,
        "most_trained_category": "strength",
        "current_streak": 12,
        "best_streak": 21,
    }
