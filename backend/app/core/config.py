import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Sumaiya Akter — AI Engineering & Research Portfolio API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    PORT: int = int(os.getenv("PORT", "8063"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./data/portfolio.db")
    
    # Security
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super_secure_jwt_secret_sumaiya_portfolio_2026_xyz987")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "sumaiya205.akter@gmail.com")
    ADMIN_INITIAL_PASSWORD: str = os.getenv("ADMIN_INITIAL_PASSWORD", "Sumaiya@AI2026!")
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3063",
        "http://127.0.0.1:3063",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://sumaiya-portfolio.com",
    ]
    
    # Media Uploads
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
