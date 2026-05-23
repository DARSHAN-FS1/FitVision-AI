import os
from functools import lru_cache
from typing import Optional

import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

IS_MOCK_AUTH = False

# ── Firebase Admin Init ───────────────────────────────────────────────────────
def init_firebase():
    global IS_MOCK_AUTH
    if not firebase_admin._apps:
        cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "serviceAccountKey.json")
        try:
            if os.path.exists(cred_path):
                cred = credentials.Certificate(cred_path)
                firebase_admin.initialize_app(cred)
            elif os.getenv("FIREBASE_PRIVATE_KEY") and os.getenv("FIREBASE_PROJECT_ID"):
                cred = credentials.Certificate({
                    "type": "service_account",
                    "project_id": os.getenv("FIREBASE_PROJECT_ID", ""),
                    "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID", ""),
                    "private_key": os.getenv("FIREBASE_PRIVATE_KEY", "").replace("\\n", "\n"),
                    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL", ""),
                    "client_id": os.getenv("FIREBASE_CLIENT_ID", ""),
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                })
                firebase_admin.initialize_app(cred)
            else:
                print("[Firebase Admin] Credentials not found. Running in Mock/Offline mode.")
                IS_MOCK_AUTH = True
        except Exception as e:
            print(f"[Firebase Admin] Initialization failed: {e}. Running in Mock/Offline mode.")
            IS_MOCK_AUTH = True


init_firebase()


# ── Auth Dependency ───────────────────────────────────────────────────────────
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """
    Validates Firebase ID token from Authorization header.
    Returns decoded token dict with uid, email, etc.
    """
    token = credentials.credentials
    if IS_MOCK_AUTH:
        try:
            from jose import jwt
            # Strip outer quotes if token has them
            clean_token = token.strip('"\'')
            decoded = jwt.get_unverified_claims(clean_token)
            if not decoded or "uid" not in decoded:
                raise ValueError("Missing uid in token payload")
            return decoded
        except Exception:
            return {
                "uid": "mock-user-123",
                "email": "developer@fitvision.ai",
                "name": "FitVision Developer",
            }

    try:
        decoded = firebase_auth.verify_id_token(token)
        return decoded
    except firebase_auth.ExpiredIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired. Please log in again.",
        )
    except firebase_auth.InvalidIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token.",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}",
        )


def require_user_match(user_id: str, current_user: dict) -> None:
    """Ensures the authenticated user can only access their own resources."""
    if current_user.get("uid") != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied.",
        )
