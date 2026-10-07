from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.health import router as health_router
from app.routes.tasks import router as tasks_router
from app.logger import StructuredLoggingMiddleware
from app.config import settings

app = FastAPI(
    title="Zero-Downtime Deployment Platform API",
    description="Backend API supporting Blue-Green zero-downtime deployment platform",
    version=settings.APP_VERSION,
)

# CORS configuration for frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom structured logging middleware
app.add_middleware(StructuredLoggingMiddleware)

# Include API routes
app.include_router(health_router)
app.include_router(tasks_router)
