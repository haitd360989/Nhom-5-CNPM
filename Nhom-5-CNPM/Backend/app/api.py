from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import InvalidTokenError
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,   # <-- vẫn giữ tên, nhưng đã chuyển sang bcrypt
    verify_password,
)
from app.db import get_db
from app.models import User, UserRole, UserStatus
from app.schemas import LoginRequest, RefreshRequest, RegisterRequest, TokenResponse, UserResponse

router = APIRouter()
bearer = HTTPBearer(auto_error=False)


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def issue_tokens(user: User) -> TokenResponse:
    return TokenResponse(
        access_token=create_access_token(user.id, user.role),
        refresh_token=create_refresh_token(user.id, user.role),
    )


def _get_user_from_token(token: str, expected_type: str, db: Session) -> User:
    try:
        payload = decode_token(token)
        if payload.get("type") != expected_type:
            raise HTTPException(status_code=401, detail=f"{expected_type.title()} token required")
        subject = payload.get("sub")
        if subject is None:
            raise ValueError("Missing subject")
        user = db.get(User, int(subject))
    except HTTPException:
        raise
    except (InvalidTokenError, KeyError, TypeError, ValueError):
        raise HTTPException(status_code=401, detail=f"Invalid or expired {expected_type} token")

    if not user or user.status != UserStatus.ACTIVE.value:
        raise HTTPException(status_code=401, detail="User is unavailable")
    return user


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    email = str(payload.email).lower()
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=409, detail="Email already registered")

    now = _utcnow()
    user = User(
        email=email,
        full_name=payload.full_name,
        password=hash_password(payload.password),  # <-- sử dụng hash_password mới (bcrypt)
        role=UserRole.STUDENT.value,
        status=UserStatus.ACTIVE.value,
        created_at=now,
        updated_at=now,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# Các endpoint login, refresh, me, logout giữ nguyên không thay đổi
@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    email = str(payload.email).lower()
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(payload.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if user.status != UserStatus.ACTIVE.value:
        raise HTTPException(status_code=403, detail="Account is not active")
    return issue_tokens(user)


@router.post("/refresh", response_model=TokenResponse)
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)):
    user = _get_user_from_token(payload.refresh_token, "refresh", db)
    return issue_tokens(user)


@router.get("/me", response_model=UserResponse)
def me(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db),
):
    if not credentials:
        raise HTTPException(status_code=401, detail="Access token required")
    return _get_user_from_token(credentials.credentials, "access", db)


@router.post("/logout")
def logout(credentials: HTTPAuthorizationCredentials = Depends(bearer)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Access token required")
    try:
        payload = decode_token(credentials.credentials)
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Access token required")
    except HTTPException:
        raise
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid or expired access token")
    return {"message": "Logout acknowledged"}