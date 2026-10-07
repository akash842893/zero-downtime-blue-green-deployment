from fastapi import APIRouter
from app.config import settings

router = APIRouter(tags=["Health & Version"])

@router.get("/health")
def get_health():
    return {"status": "healthy"}

@router.get("/version")
def get_version():
    return {
        "version": settings.APP_VERSION,
        "environment": settings.DEPLOYMENT_ENV
    }
