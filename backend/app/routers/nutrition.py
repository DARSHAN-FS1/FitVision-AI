from fastapi import APIRouter, Depends, Query
from typing import Optional
from datetime import datetime

from app.schemas.schemas import MealLogRequest, MealLogResponse, FoodSearchResult, MacroSchema
from app.services.firebase_admin import get_current_user, require_user_match

router = APIRouter()

FOOD_DB = [
    FoodSearchResult(id="f001", name="Oats",           serving_size_g=100, calories=389, emoji="🥣",  macros=MacroSchema(protein_g=17, carbs_g=66, fats_g=7, fiber_g=11, sugar_g=1)),
    FoodSearchResult(id="f002", name="Chicken Breast",  serving_size_g=100, calories=165, emoji="🍗",  macros=MacroSchema(protein_g=31, carbs_g=0, fats_g=3.6, fiber_g=0, sugar_g=0)),
    FoodSearchResult(id="f003", name="Brown Rice",      serving_size_g=100, calories=216, emoji="🍚",  macros=MacroSchema(protein_g=4.5, carbs_g=45, fats_g=1.8, fiber_g=3.5, sugar_g=0.7)),
    FoodSearchResult(id="f004", name="Salmon",          serving_size_g=100, calories=208, emoji="🐟",  macros=MacroSchema(protein_g=20, carbs_g=0, fats_g=13, fiber_g=0, sugar_g=0)),
    FoodSearchResult(id="f005", name="Banana",          serving_size_g=118, calories=105, emoji="🍌",  macros=MacroSchema(protein_g=1.3, carbs_g=27, fats_g=0.4, fiber_g=3.1, sugar_g=14)),
    FoodSearchResult(id="f006", name="Whey Protein",    serving_size_g=30,  calories=120, emoji="🥤",  macros=MacroSchema(protein_g=25, carbs_g=3, fats_g=1.5, fiber_g=0, sugar_g=2)),
    FoodSearchResult(id="f007", name="Eggs",            serving_size_g=50,  calories=78,  emoji="🥚",  macros=MacroSchema(protein_g=6, carbs_g=0.6, fats_g=5, fiber_g=0, sugar_g=0.6)),
    FoodSearchResult(id="f008", name="Greek Yogurt",    serving_size_g=170, calories=100, emoji="🥛",  macros=MacroSchema(protein_g=17, carbs_g=6, fats_g=0.7, fiber_g=0, sugar_g=6)),
    FoodSearchResult(id="f009", name="Almonds",         serving_size_g=28,  calories=164, emoji="🌰",  macros=MacroSchema(protein_g=6, carbs_g=6, fats_g=14, fiber_g=3.5, sugar_g=1)),
    FoodSearchResult(id="f010", name="Sweet Potato",    serving_size_g=130, calories=112, emoji="🍠",  macros=MacroSchema(protein_g=2, carbs_g=26, fats_g=0.1, fiber_g=3.8, sugar_g=5.4)),
]


@router.get("/foods/search")
async def search_foods(
    q: str = Query(..., min_length=1),
    current_user: dict = Depends(get_current_user),
):
    results = [f for f in FOOD_DB if q.lower() in f.name.lower()]
    return results


@router.post("/log-meal", response_model=MealLogResponse)
async def log_meal(
    meal: MealLogRequest,
    current_user: dict = Depends(get_current_user),
):
    require_user_match(meal.user_id, current_user)
    meal_id = f"meal_{int(datetime.utcnow().timestamp() * 1000)}"
    # db.collection('nutrition_logs').document(meal_id).set({...meal.dict(), 'id': meal_id})
    return MealLogResponse(id=meal_id, **meal.model_dump())


@router.get("/daily/{user_id}")
async def get_daily_nutrition(
    user_id: str,
    date: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user),
):
    require_user_match(user_id, current_user)
    target_date = date or datetime.utcnow().strftime("%Y-%m-%d")
    # Query Firestore for meals on target_date
    return {
        "date": target_date,
        "user_id": user_id,
        "meals": [],
        "total_calories": 0,
        "calorie_goal": 2200,
        "protein_goal_g": 150,
        "carbs_goal_g": 250,
        "fats_goal_g": 70,
        "water_ml": 0,
        "water_goal_ml": 3000,
    }


@router.get("/ai-suggestions/{user_id}")
async def get_ai_suggestions(
    user_id: str,
    current_user: dict = Depends(get_current_user),
):
    require_user_match(user_id, current_user)
    # In production: fetch user profile, run AI suggestion model
    return [
        {
            "id": "sug_001",
            "name": "High Protein Breakfast",
            "description": "Oats with banana and whey protein for sustained energy",
            "total_calories": 614,
            "total_macros": {"protein_g": 43, "carbs_g": 96, "fats_g": 9, "fiber_g": 14, "sugar_g": 17},
            "preparation_minutes": 10,
            "tags": ["breakfast", "high-protein", "quick"],
            "emoji": "🥣",
            "reason": "Matches your muscle gain goal with balanced macros",
        },
        {
            "id": "sug_002",
            "name": "Lean Muscle Lunch",
            "description": "Chicken breast with brown rice — classic post-workout recovery",
            "total_calories": 381,
            "total_macros": {"protein_g": 35, "carbs_g": 45, "fats_g": 5, "fiber_g": 3.5, "sugar_g": 0.7},
            "preparation_minutes": 25,
            "tags": ["lunch", "post-workout", "lean"],
            "emoji": "🍗",
            "reason": "Ideal post-workout macro ratio for recovery",
        },
    ]


@router.post("/water/{user_id}")
async def log_water(
    user_id: str,
    ml: int,
    current_user: dict = Depends(get_current_user),
):
    require_user_match(user_id, current_user)
    # Update today's water intake in Firestore
    return {"success": True, "logged_ml": ml}
