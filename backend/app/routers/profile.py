from fastapi import APIRouter, HTTPException, Depends, status
from datetime import datetime
from typing import Optional

from app.schemas.schemas import UserProfileSchema, ProfileUpdateRequest, DailyMetricsSchema
from app.services.firebase_admin import get_current_user, require_user_match

router = APIRouter()

# In production replace with Firestore queries via firebase_admin.firestore
# For now returns structured mock data while Firestore is the source of truth

def calc_bmi(weight_kg: float, height_cm: float) -> float:
    h = height_cm / 100
    return round(weight_kg / (h * h), 1)


@router.post("/create")
async def create_profile(
    profile: UserProfileSchema,
    current_user: dict = Depends(get_current_user),
):
    require_user_match(profile.uid, current_user)
    # Profile is already saved to Firestore from the mobile client.
    # This endpoint syncs to any additional backend storage (e.g., PostgreSQL for analytics).
    return {"success": True, "uid": profile.uid}


@router.get("/{user_id}", response_model=UserProfileSchema)
async def get_profile(
    user_id: str,
    current_user: dict = Depends(get_current_user),
):
    require_user_match(user_id, current_user)
    # Firestore is source of truth; fetch via firebase_admin.firestore
    # from firebase_admin import firestore
    # db = firestore.client()
    # doc = db.collection('users').document(user_id).get()
    # if not doc.exists: raise HTTPException(404, "Profile not found")
    # return doc.to_dict()

    # Stub response for demo:
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Fetch from Firestore on client")


@router.patch("/{user_id}")
async def update_profile(
    user_id: str,
    updates: ProfileUpdateRequest,
    current_user: dict = Depends(get_current_user),
):
    require_user_match(user_id, current_user)
    update_data = updates.model_dump(exclude_none=True)
    update_data["updated_at"] = datetime.utcnow().isoformat()

    if "weight_kg" in update_data and "height_cm" in update_data:
        update_data["bmi"] = calc_bmi(update_data["weight_kg"], update_data["height_cm"])

    # Update Firestore:
    # db.collection('users').document(user_id).update(update_data)
    return {"success": True, "updated_fields": list(update_data.keys())}
