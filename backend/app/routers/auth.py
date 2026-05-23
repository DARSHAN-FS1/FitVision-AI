from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.schemas import LoginRequest, SignupRequest, TokenResponse
from app.services.firebase_admin import get_current_user

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    """
    Login is handled client-side via Firebase SDK.
    This endpoint validates the Firebase token and returns user info.
    Frontend sends the Firebase ID token in Authorization header for all subsequent calls.
    """
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Use Firebase SDK on the client for authentication. Then pass the ID token as Bearer.",
    )


@router.post("/verify")
async def verify_token(current_user: dict = Depends(get_current_user)):
    """Verify that a Firebase token is valid and return user info."""
    return {
        "valid": True,
        "uid": current_user.get("uid"),
        "email": current_user.get("email"),
        "display_name": current_user.get("name"),
    }


@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """
    Client-side logout is handled by Firebase SDK.
    This endpoint can be used to invalidate server-side sessions if needed.
    """
    return {"message": "Logged out successfully"}
