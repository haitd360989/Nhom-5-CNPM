from fastapi import FastAPI
from app.db import Base, engine
from app.api import router as auth_router
from app.routes import router as rbac_router

app = FastAPI(
    title="AI Personalized Learning Platform - TASK 3",
    version="1.0.0",
    description="Authentication + JWT + RBAC backend",
)

Base.metadata.create_all(bind=engine)
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(rbac_router)

@app.get("/health")
def health():
    return {"status": "ok"}
