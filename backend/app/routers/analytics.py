from fastapi import APIRouter, Depends, Query
from typing import Optional
from datetime import datetime, timedelta

from app.schemas.schemas import DailyMetricsSchema, HomeDashboardResponse, WeeklyProgressSchema
from app.services.firebase_admin import get_current_user, require_user_match

router = APIRouter()


@router.get("/daily/{user_id}", response_model=DailyMetricsSchema)
async def get_daily_metrics(
    user_id: str,
    date: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user),
):
    require_user_match(user_id, current_user)
    target_date = date or datetime.utcnow().strftime("%Y-%m-%d")

    # In production: aggregate from Firestore workout_sessions + nutrition_logs
    # for the given date and user_id. For now returns a realistic mock.
    return DailyMetricsSchema(
        date=target_date,
        calories_burned=842,
        calories_consumed=1840,
        hydration_liters=1.8,
        recovery_percent=78.0,
        hrv=54.0,
        sleep_hours=7.2,
        streak_days=12,
        steps_count=8420,
    )


@router.get("/weekly/{user_id}")
async def get_weekly_progress(
    user_id: str,
    current_user: dict = Depends(get_current_user),
):
    require_user_match(user_id, current_user)

    today = datetime.utcnow()
    weeks = []
    for i in range(4):
        week_start = today - timedelta(weeks=i + 1)
        weeks.append(WeeklyProgressSchema(
            week_start=week_start.strftime("%Y-%m-%d"),
            total_workouts=5 - i,
            total_calories_burned=3200 - (i * 200),
            avg_form_score=88.0 - (i * 3),
            total_reps=240 - (i * 20),
            most_trained="strength",
        ))

    return weeks


@router.get("/summary/{user_id}")
async def get_analytics_summary(
    user_id: str,
    current_user: dict = Depends(get_current_user),
):
    require_user_match(user_id, current_user)

    return {
        "total_workouts": 42,
        "total_scan_sessions": 18,
        "total_calories_burned": 34200,
        "avg_weekly_workouts": 4.2,
        "best_form_score": 98.0,
        "avg_form_score": 84.5,
        "total_reps_logged": 3840,
        "current_streak_days": 12,
        "best_streak_days": 21,
        "most_trained_category": "strength",
        "posture_trend": [72, 75, 80, 83, 85, 87, 90],
        "calorie_trend": [1800, 2100, 1950, 2200, 1780, 2350, 1840],
        "workout_days_this_month": 18,
    }


@router.get("/home/{user_id}", response_model=HomeDashboardResponse)
async def get_home_dashboard(
    user_id: str,
    current_user: dict = Depends(get_current_user),
):
    """
    Single aggregated endpoint for the Home screen.
    One call replaces 5 individual fetches — faster load, less battery drain.
    """
    require_user_match(user_id, current_user)

    daily = DailyMetricsSchema(
        date=datetime.utcnow().strftime("%Y-%m-%d"),
        calories_burned=842,
        calories_consumed=1840,
        hydration_liters=1.8,
        recovery_percent=78.0,
        hrv=54.0,
        sleep_hours=7.2,
        streak_days=12,
        steps_count=8420,
    )

    ai_insights = [
        "📈 Squat depth improved 12% this week",
        "😴 Sleep 7.2h · Optimal recovery",
        "💓 HRV 54ms · Well recovered — good day to train",
        "🎯 Weight loss goal on track · -0.4kg this week",
        "⚠️ Right knee angle needs attention · aim for 85–95°",
    ]

    return HomeDashboardResponse(
        daily_metrics=daily,
        recent_workouts=[],
        ai_insights=ai_insights,
        streak_days=12,
        calories_today=842,
        recovery_score=78.0,
    )
