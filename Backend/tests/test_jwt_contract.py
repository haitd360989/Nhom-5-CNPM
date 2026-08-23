from datetime import datetime, timezone

import jwt

from app.core.config import settings
from app.core.security import create_access_token, create_refresh_token, decode_token


def test_access_token_contract():
    token = create_access_token(123, "STUDENT")
    payload = decode_token(token)
    assert payload["sub"] == "123"
    assert payload["role"] == "STUDENT"
    assert payload["type"] == "access"
    assert payload["exp"] > payload["iat"]
    assert payload["jti"]


def test_refresh_token_contract():
    token = create_refresh_token(123, "PARENT")
    payload = decode_token(token)
    assert payload["sub"] == "123"
    assert payload["role"] == "PARENT"
    assert payload["type"] == "refresh"
    assert payload["jti"]


def test_expired_token_is_rejected():
    payload = {
        "sub": "123", "role": "STUDENT", "type": "access",
        "iat": datetime(1970, 1, 1, tzinfo=timezone.utc),
        "exp": datetime(1970, 1, 1, tzinfo=timezone.utc),
    }
    token = jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
    try:
        decode_token(token)
        assert False, "Expired token was accepted"
    except jwt.ExpiredSignatureError:
        pass


def test_legacy_bcrypt_verification_path(monkeypatch):
    import sys
    import types
    import app.core.security as security

    fake_bcrypt = types.SimpleNamespace(
        checkpw=lambda password, hashed: (
            (password == b"Password123" or password == "Password123")
            and (hashed.startswith(b"$2a$") or hashed.startswith("$2a$"))
        )
    )
    monkeypatch.setattr(security, "bcrypt", fake_bcrypt)
    assert security.verify_password("Password123", "$2a$12$legacy-hash") is True
    assert security.verify_password("WrongPassword", "$2a$12$legacy-hash") is False
