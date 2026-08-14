from fastapi import FastAPI
from app.routes import diagnostic

app = FastAPI(title="Diagnostic & Study Plan Microservice")

app.include_router(diagnostic.router)

@app.get("/")
def root():
    return {"message": "Diagnostic API Service đang chạy!"}