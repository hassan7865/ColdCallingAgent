import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from core.config import get_settings
from core.logging import RequestIdLoggingMiddleware, configure_logging
from core.responses import error_response
from routers import (
    auth,
    campaigns,
    health,
    prospects,
    reports,
)

settings = get_settings()
configure_logging()
logger = logging.getLogger(__name__)

app = FastAPI(title=settings.app_name, version=settings.app_version)
app.add_middleware(RequestIdLoggingMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(auth.router, prefix=settings.api_prefix)
app.include_router(prospects.router, prefix=settings.api_prefix)
app.include_router(campaigns.router, prefix=settings.api_prefix)
app.include_router(reports.router, prefix=settings.api_prefix)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error: %s", exc)
    payload = error_response("Internal server error", {"path": request.url.path})
    return JSONResponse(status_code=500, content=payload.model_dump())

