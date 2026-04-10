from datetime import UTC, datetime

from fastapi import APIRouter, Depends, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from core.config import get_settings
from core.responses import Envelope, success_response
from dependencies.database import get_async_session

router = APIRouter(tags=["health"])
settings = get_settings()


@router.get("/health", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def health_check(session: AsyncSession = Depends(get_async_session)):
    db_ok = True
    try:
        await session.execute(text("SELECT 1"))
    except Exception:
        db_ok = False
    return success_response(
        "Service health",
        {"version": settings.app_version, "timestamp": datetime.now(UTC).isoformat(), "database_connected": db_ok},
    )

