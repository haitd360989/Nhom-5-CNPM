import os
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "AI Personalized Learning Platform"
    # database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/learning_platform"
    database_url: str = "postgresql+psycopg://postgres.cglyxxlkuzbdcxiofklb:7JS78%23eX-%23XS%23Wx@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres?sslmode=require"
    jwt_secret_key: str = "CHANGE_ME"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
