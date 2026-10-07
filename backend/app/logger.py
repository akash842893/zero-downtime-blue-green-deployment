import logging
import json
import time
from datetime import datetime
from starlette.middleware.base import BaseHTTPMiddleware
from app.config import settings

# Setup standard logger
logging.basicConfig(level=settings.LOG_LEVEL)
logger = logging.getLogger("zero_downtime_backend")

class StructuredLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time_ms = round((time.time() - start_time) * 1000, 2)

        log_data = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "method": request.method,
            "path": request.url.path,
            "status_code": response.status_code,
            "response_time_ms": process_time_ms,
            "app_version": settings.APP_VERSION,
            "environment": settings.DEPLOYMENT_ENV,
        }

        # Print structured log
        print(f"{log_data['timestamp']} {log_data['method']} {log_data['path']} {log_data['status_code']} {log_data['response_time_ms']}ms version={log_data['app_version']} environment={log_data['environment']}")
        return response
