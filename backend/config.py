import os
from pydantic import BaseModel

class Settings(BaseModel):
    # App
    PROJECT_NAME: str = "ParseAnything Backend API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Server
    HOST: str = os.getenv("API_HOST", "0.0.0.0")
    PORT: int = int(os.getenv("API_PORT", "8001"))
    
    # Redis & Celery
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    CELERY_BROKER_URL: str = os.getenv("CELERY_BROKER_URL", os.getenv("REDIS_URL", "redis://localhost:6379/0"))
    CELERY_RESULT_BACKEND: str = os.getenv("CELERY_RESULT_BACKEND", os.getenv("REDIS_URL", "redis://localhost:6379/0"))
    
    # Storage
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", os.path.abspath("uploads"))
    RESULTS_DIR: str = os.getenv("RESULTS_DIR", os.path.abspath("results"))
    SAMPLES_DIR: str = os.getenv("SAMPLES_DIR", os.path.abspath("backend/samples"))
    
    # File Limits
    MAX_FILE_SIZE_BYTES: int = int(os.getenv("MAX_FILE_SIZE_BYTES", str(25 * 1024 * 1024)))  # 25 MB
    ALLOWED_EXTENSIONS: set = {"pdf", "jpg", "jpeg", "png", "docx"}
    
    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "*"
    ]

settings = Settings()
