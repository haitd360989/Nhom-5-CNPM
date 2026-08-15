from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import router as auth_router
from app.db import Base, engine
from app.rag.router import router as rag_router
from app.routes.diagnostic import router as diagnostic_router

app = FastAPI(
    title="AI Personalized Learning Platform - Backend",
    version="1.2.0",
    description="TASK 3 Subtask 1 - Authentication + JWT & TASK 5 Subtask 5.3 - RAG Pipeline",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Standalone development/test initialization. In the integrated project,
# Task 2's migration remains the database schema source of truth.
Base.metadata.create_all(bind=engine)

app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(rag_router)
app.include_router(diagnostic_router)

# When Subtask 2 is extracted into the same root, its router is picked up
# automatically. Subtask 1 itself remains runnable without Subtask 2.
try:
    from app.routes import router as rbac_router
except ModuleNotFoundError:
    rbac_router = None

if rbac_router is not None:
    app.include_router(rbac_router)


@app.get("/health")
def health():
    return {"status": "ok"}