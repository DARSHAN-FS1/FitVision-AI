from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


# ── Enums ─────────────────────────────────────────────────────────────────────
class Gender(str, Enum):
    male = "male"
    female = "female"
    other = "other"
    prefer_not = "prefer_not_to_say"


class ActivityLevel(str, Enum):
    sedentary = "sedentary"
    light = "light"
    moderate = "moderate"
    active = "active"
    very_active = "very_active"


class FitnessGoal(str, Enum):
    weight_loss = "weight_loss"
    muscle_gain = "muscle_gain"
    endurance = "endurance"
    flexibility = "flexibility"
    general = "general_fitness"


class ExerciseType(str, Enum):
    squat = "squat"
    pushup = "pushup"
    deadlift = "deadlift"
    lunge = "lunge"
    pullup = "pullup"
    plank = "plank"
    custom = "custom"


class MealType(str, Enum):
    breakfast = "breakfast"
    lunch = "lunch"
    dinner = "dinner"
    snack = "snack"
    pre_workout = "pre_workout"
    post_workout = "post_workout"


# ── Auth ──────────────────────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    display_name: str
    age: int = Field(ge=10, le=100)
    gender: Gender
    height_cm: float = Field(ge=100, le=250)
    weight_kg: float = Field(ge=30, le=300)
    fitness_goal: FitnessGoal
    activity_level: ActivityLevel


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str


# ── Profile ───────────────────────────────────────────────────────────────────
class UserProfileSchema(BaseModel):
    uid: str
    email: str
    display_name: str
    age: int
    gender: str
    height_cm: float
    weight_kg: float
    target_weight_kg: float
    activity_level: str
    fitness_goal: str
    bmi: float
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class ProfileUpdateRequest(BaseModel):
    display_name: Optional[str] = None
    age: Optional[int] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    target_weight_kg: Optional[float] = None
    activity_level: Optional[ActivityLevel] = None
    fitness_goal: Optional[FitnessGoal] = None


class DailyMetricsSchema(BaseModel):
    date: str
    calories_burned: int
    calories_consumed: int
    hydration_liters: float
    recovery_percent: float
    hrv: float
    sleep_hours: float
    streak_days: int
    steps_count: int


# ── Workouts ──────────────────────────────────────────────────────────────────
class WorkoutSetSchema(BaseModel):
    set_number: int
    reps: int
    weight_kg: Optional[float] = None
    duration_seconds: Optional[int] = None
    form_score: Optional[float] = None
    completed_at: str


class LoggedExerciseSchema(BaseModel):
    exercise_id: str
    exercise_name: str
    sets: List[WorkoutSetSchema]
    total_reps: int
    total_volume: float
    avg_form_score: Optional[float] = None


class WorkoutSessionLog(BaseModel):
    user_id: str
    name: str
    category: str
    exercises: List[LoggedExerciseSchema]
    duration_seconds: int
    total_calories: int
    started_at: str
    completed_at: Optional[str] = None
    notes: Optional[str] = None


class WorkoutSessionResponse(WorkoutSessionLog):
    id: str


# ── Scan ──────────────────────────────────────────────────────────────────────
class ScanStartRequest(BaseModel):
    user_id: str
    exercise_type: ExerciseType


class ScanStartResponse(BaseModel):
    session_id: str
    started_at: str


class ScanResultRequest(BaseModel):
    id: str
    user_id: str
    exercise_type: str
    started_at: str
    ended_at: Optional[str] = None
    duration_seconds: int
    total_reps: int
    avg_form_score: float
    avg_knee_angle: float
    avg_back_angle: float
    posture_accuracy: float
    calories_burned: int
    peak_form_score: float
    corrections: List[str]
    is_completed: bool = True


class SuggestionItemSchema(BaseModel):
    type: str
    title: str
    description: str
    priority: str


class ScanReportResponse(BaseModel):
    session: ScanResultRequest
    posture_score: float
    suggestions: List[SuggestionItemSchema]
    improvements: List[str]
    next_steps: List[str]


# ── Nutrition ─────────────────────────────────────────────────────────────────
class MacroSchema(BaseModel):
    protein_g: float
    carbs_g: float
    fats_g: float
    fiber_g: float
    sugar_g: float


class MealLogRequest(BaseModel):
    user_id: str
    date: str
    meal_type: MealType
    total_calories: int
    total_macros: MacroSchema
    logged_at: str
    notes: Optional[str] = None


class MealLogResponse(MealLogRequest):
    id: str


class FoodSearchResult(BaseModel):
    id: str
    name: str
    brand: Optional[str] = None
    serving_size_g: float
    calories: int
    macros: MacroSchema
    emoji: str


# ── Analytics ─────────────────────────────────────────────────────────────────
class WeeklyProgressSchema(BaseModel):
    week_start: str
    total_workouts: int
    total_calories_burned: int
    avg_form_score: float
    total_reps: int
    most_trained: str


class HomeDashboardResponse(BaseModel):
    daily_metrics: DailyMetricsSchema
    recent_workouts: List[WorkoutSessionResponse]
    ai_insights: List[str]
    streak_days: int
    calories_today: int
    recovery_score: float
