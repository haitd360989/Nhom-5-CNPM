from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jwt import InvalidTokenError
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import User, UserRole
from app.schemas import RegisterRequest, LoginRequest, TokenResponse, UserResponse
from app.core.security import (
    hash_password, verify_password, create_access_token,
    create_refresh_token, decode_token
)

router=APIRouter()
bearer=HTTPBearer(auto_error=False)

def issue_tokens(user: User) -> TokenResponse:
    return TokenResponse(
        access_token=create_access_token(user.id, user.role.value),
        refresh_token=create_refresh_token(user.id, user.role.value),
    )

@router.post("/register", response_model=UserResponse, status_code=201)
def register(payload:RegisterRequest, db:Session=Depends(get_db)):
    if db.query(User).filter(User.email==payload.email).first():
        raise HTTPException(status_code=409, detail="Email already registered")
    # Public registration is Student only. Privileged roles are provisioned by Admin.
    user=User(
        email=payload.email,
        full_name=payload.full_name,
        password_hash=hash_password(payload.password),
        role=UserRole.STUDENT,
    )
    db.add(user); db.commit(); db.refresh(user)
    return user

@router.post("/login", response_model=TokenResponse)
def login(payload:LoginRequest, db:Session=Depends(get_db)):
    user=db.query(User).filter(User.email==payload.email).first()
    if not user or not verify_password(payload.password,user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is inactive")
    return issue_tokens(user)

@router.post("/refresh", response_model=TokenResponse)
def refresh(credentials:HTTPAuthorizationCredentials=Depends(bearer), db:Session=Depends(get_db)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Refresh token required")
    try:
        payload=decode_token(credentials.credentials)
        if payload.get("type")!="refresh":
            raise HTTPException(status_code=401, detail="Refresh token required")
        user=db.get(User,int(payload["sub"]))
    except (InvalidTokenError, KeyError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User is unavailable")
    return issue_tokens(user)

@router.get("/me", response_model=UserResponse)
def me(credentials:HTTPAuthorizationCredentials=Depends(bearer), db:Session=Depends(get_db)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Access token required")
    try:
        payload=decode_token(credentials.credentials)
        if payload.get("type")!="access":
            raise HTTPException(status_code=401, detail="Access token required")
        user=db.get(User,int(payload["sub"]))
    except (InvalidTokenError, KeyError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid or expired access token")
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User is unavailable")
    return user

@router.post("/logout")
def logout():
    # Baseline: client discards tokens. Production should add refresh-token revocation.
    return {"message":"Logout acknowledged"}
