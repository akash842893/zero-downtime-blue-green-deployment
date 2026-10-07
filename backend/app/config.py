import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
    DEPLOYMENT_ENV: str = os.getenv("DEPLOYMENT_ENV", "blue")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./local_test.db")
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
