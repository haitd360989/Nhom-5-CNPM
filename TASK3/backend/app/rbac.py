from typing import Callable
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jwt import InvalidTokenError
from sqlalchemy.orm import Session

from app.core.security import decode_token
from app.db import get_db
from app.models import User, UserRole

bearer=HTTPBearer(auto_error=False)

def get_current_user(
    credentials:HTTPAuthorizationCredentials=Depends(bearer),
    db:Session=Depends(get_db),
)->User:
    if not credentials:
        raise HTTPException(status_code=401,detail="Authentication required")
    try:
        payload=decode_token(credentials.credentials)
        if payload.get("type")!="access":
            raise HTTPException(status_code=401,detail="Access token required")
        user=db.get(User,int(payload["sub"]))
    except (InvalidTokenError,KeyError,ValueError):
        raise HTTPException(status_code=401,detail="Invalid or expired access token")
    if not user or not user.is_active:
        raise HTTPException(status_code=401,detail="User is unavailable")
    return user

def require_roles(*roles:UserRole)->Callable:
    def dependency(user:User=Depends(get_current_user))->User:
        if user.role not in roles:
            raise HTTPException(status_code=403,detail="Insufficient permissions")
        return user
    return dependency
