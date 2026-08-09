# TASK 3 – Backend Authentication + JWT + RBAC

This repository is the merge-ready version of the three independent TASK 3 deliverables.

## Deliverables
1. Subtask 1 – User Authentication + JWT lifecycle.
2. Subtask 2 – RBAC for ADMIN, TEACHER, STUDENT, PARENT.
3. Subtask 3 – SDD Security & Authentication Architecture.

## TASK 2 compatibility
The code maps exactly to the executable `users` schema from `subtask_2.2.sql`:

`id, email, password, full_name, role, status, created_at, updated_at`

It does not use `password_hash` or `is_active`.

Because the current TASK 2 role CHECK contains only three roles, run:

```text
task2_compatibility_patch.sql
```

after `subtask_2.2.sql` so the database accepts `PARENT`, which is required by the SRS/TASK 3.

TASK 2 mock users use bcrypt-style password hashes. TASK 3 creates Argon2 hashes for new registrations and includes bcrypt verification for the legacy mock hashes.

## Run the merged backend
```bash
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Configure `.env` with the PostgreSQL connection used by TASK 2 and a strong JWT secret.

## Test
```bash
pytest -q
```

Verification in the development environment: **18 passed** across authentication/JWT, schema compatibility, RBAC and SDD checks. The live database integration should use the PostgreSQL instance initialized by TASK 2.

## API
### Authentication
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

### RBAC
- `GET /api/v1/rbac/admin`
- `GET /api/v1/rbac/teacher`
- `GET /api/v1/rbac/student`
- `GET /api/v1/rbac/parent`

## Merge rule
Subtask 1 provides the shared `app` foundation. Subtask 2 adds `app/rbac.py`, `app/routes.py` and RBAC tests. Subtask 3 adds the SDD document. Extract all three into the same backend root; do not replace Subtask 1's shared files with duplicate copies.
