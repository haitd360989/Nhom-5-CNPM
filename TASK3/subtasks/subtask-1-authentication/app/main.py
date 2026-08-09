from fastapi import FastAPI
from app.db import Base, engine
from app.api import router as auth_router

app = FastAPI(
    title="AI Personalized Learning Platform - Backend",
    version="1.0.0",
    description="TASK 3 Authentication + JWT + RBAC",
)

Base.metadata.create_all(bind=engine)
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])

# Subtask 1 runs by itself. When Subtask 2 is extracted into the same root,
# its RBAC router is added automatically without duplicating main.py.
try:
    from app.routes import router as rbac_router
except ModuleNotFoundError:
    rbac_router = None

if rbac_router is not None:
    app.include_router(rbac_router)

@app.get("/health")
def health():
    return {"status": "ok"}
