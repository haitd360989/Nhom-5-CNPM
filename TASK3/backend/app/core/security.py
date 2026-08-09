from datetime import datetime, timedelta, timezone
from uuid import uuid4
import jwt
from pwdlib import PasswordHash
from app.core.config import settings

password_hash = PasswordHash.recommended()

def hash_password(password: str) -> str:
    return password_hash.hash(password)

def verify_password(password: str, hashed_password: str) -> bool:
    return password_hash.verify(password, hashed_password)

def _create_token(user_id: int, role: str, token_type: str, expires: timedelta) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user_id),
        "role": role,
        "type": token_type,
        "jti": str(uuid4()),
        "iat": now,
        "exp": now + expires,
    }
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)

def create_access_token(user_id: int, role: str) -> str:
    return _create_token(
        user_id, role, "access",
        timedelta(minutes=settings.access_token_expire_minutes)
    )

def create_refresh_token(user_id: int, role: str) -> str:
    return _create_token(
        user_id, role, "refresh",
        timedelta(days=settings.refresh_token_expire_days)
    )

def decode_token(token: str) -> dict:
    return jwt.decode(
        token,
        settings.jwt_secret_key,
        algorithms=[settings.jwt_algorithm],
    )
