from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.config import get_settings
from dependencies.database import get_async_session
from services.auth_service import get_user_from_access_token

settings = get_settings()


async def get_current_user(request: Request, session: AsyncSession = Depends(get_async_session)):
    token = request.cookies.get(settings.access_cookie_name)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing access token")
    user = await get_user_from_access_token(session, token)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return user

