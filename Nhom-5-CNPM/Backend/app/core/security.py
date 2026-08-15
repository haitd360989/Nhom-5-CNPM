from datetime import datetime, timedelta, timezone
from uuid import uuid4

import jwt
import bcrypt  # <-- sử dụng bcrypt thay vì pwdlib

from app.core.config import settings


def hash_password(password: str) -> str:
    """Băm mật khẩu bằng bcrypt (salt tự động)."""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verify_password(password: str, hashed_password: str) -> bool:
    """Xác minh mật khẩu dùng bcrypt (tương thích với hash cũ)."""
    try:
        return bcrypt.checkpw(
            password.encode("utf-8"),
            hashed_password.encode("utf-8")
        )
    except ValueError:
        return False


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
        user_id, role, "access", timedelta(minutes=settings.access_token_expire_minutes)
    )


def create_refresh_token(user_id: int, role: str) -> str:
    return _create_token(
        user_id, role, "refresh", timedelta(days=settings.refresh_token_expire_days)
    )


def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])