from datetime import datetime, timezone
import sys, types

# The production dependency is declared in requirements.txt. This tiny shim
# only lets the JWT contract tests run in minimal environments where pwdlib is
# not installed; password hashing itself is not under test here.
if "pwdlib" not in sys.modules:
    class _PasswordHash:
        @classmethod
        def recommended(cls):
            return cls()
        def hash(self, password):
            return password
        def verify(self, password, hashed):
            return password == hashed
    shim = types.ModuleType("pwdlib")
    shim.PasswordHash = _PasswordHash
    sys.modules["pwdlib"] = shim

import jwt
from app.core.security import create_access_token, create_refresh_token, decode_token
from app.core.config import settings

def test_access_token_contract():
    token = create_access_token(123, "Student")
    payload = decode_token(token)
    assert payload["sub"] == "123"
    assert payload["role"] == "Student"
    assert payload["type"] == "access"
    assert payload["exp"] > payload["iat"]
    assert payload["jti"]

def test_refresh_token_contract():
    token = create_refresh_token(123, "Student")
    payload = decode_token(token)
    assert payload["sub"] == "123"
    assert payload["role"] == "Student"
    assert payload["type"] == "refresh"
    assert payload["jti"]

def test_expired_token_is_rejected():
    payload = {
        "sub": "123", "role": "Student", "type": "access",
        "iat": datetime.now(timezone.utc),
        "exp": datetime.fromtimestamp(1, tz=timezone.utc),
    }
    token = jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
    try:
        decode_token(token)
        assert False, "Expired token was accepted"
    except jwt.ExpiredSignatureError:
        pass
