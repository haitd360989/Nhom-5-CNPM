# TASK 3 - Integrated Backend

## Includes
- Subtask 1: Authentication + JWT
- Subtask 2: RBAC
- Subtask 3: SDD under `docs/`

## Run
```bash
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

Swagger: http://127.0.0.1:8000/docs

## Test
```bash
pytest -q
```

Configure PostgreSQL and a strong `JWT_SECRET_KEY` in `.env` before production use.
