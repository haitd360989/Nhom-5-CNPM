# TASK 3 - Subtask 1: User Authentication

## Deliverable
FastAPI module for Register/Login/JWT lifecycle.

## API
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET  /api/v1/auth/me

## Security rules
- Passwords are hashed with Argon2.
- Public registration always creates Student.
- JWT contains sub, role, type, jti, iat, exp.
- Access token is used for protected API calls.
- Refresh token is used only at /refresh.
- Use HTTPS and a secret manager in production.

## Integration contract for Subtask 2
Subtask 2 must reuse `decode_token`, `User`, `UserRole` and the JWT claim names.


## Verification
- `tests/test_jwt_contract.py` checks access/refresh claim contracts and expiry rejection.
- Full API integration tests require PostgreSQL (Task 2) or a test database.

## Standalone test
Install `requirements.txt`, then run `pytest -q`. The JWT tests verify the token contract without requiring PostgreSQL.
