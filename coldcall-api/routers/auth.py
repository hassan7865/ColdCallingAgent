from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession

from core.config import get_settings
from core.responses import Envelope, success_response
from dependencies.auth import get_current_user
from dependencies.database import get_async_session
from schemas.auth import LoginRequest, RegisterRequest
from services import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])
settings = get_settings()


def _set_auth_cookies(response: Response, access_token: str, refresh_token: str) -> None:
    max_age_access = settings.access_token_expire_minutes * 60
    max_age_refresh = settings.refresh_token_expire_days * 24 * 60 * 60
    for name, token, max_age in (
        (settings.access_cookie_name, access_token, max_age_access),
        (settings.refresh_cookie_name, refresh_token, max_age_refresh),
    ):
        response.set_cookie(
            key=name,
            value=token,
            httponly=True,
            secure=settings.cookie_secure,
            samesite=settings.cookie_samesite,
            max_age=max_age,
            domain=settings.cookie_domain or None,
        )


@router.post("/register", response_model=Envelope[dict], status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest, response: Response, session: AsyncSession = Depends(get_async_session)):
    user = await auth_service.register_user(session, payload.email, payload.password, payload.name)
    access = auth_service.create_access_token(str(user.id))
    refresh = auth_service.create_refresh_token(str(user.id))
    _set_auth_cookies(response, access, refresh)
    return success_response("Registered", {"user_id": str(user.id)})


@router.post("/login", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def login(payload: LoginRequest, response: Response, session: AsyncSession = Depends(get_async_session)):
    user = await auth_service.authenticate_user(session, payload.email, payload.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    access = auth_service.create_access_token(str(user.id))
    refresh = auth_service.create_refresh_token(str(user.id))
    _set_auth_cookies(response, access, refresh)
    return success_response("Logged in", {"user_id": str(user.id)})


@router.post("/refresh", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def refresh(request: Request, response: Response, session: AsyncSession = Depends(get_async_session)):
    refresh_token = request.cookies.get(settings.refresh_cookie_name)
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing refresh token")
    try:
        payload = auth_service.decode_token(refresh_token)
    except JWTError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token") from exc
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    user = await auth_service.get_user_by_id(session, payload["sub"])
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    access = auth_service.create_access_token(str(user.id))
    refresh = auth_service.create_refresh_token(str(user.id))
    _set_auth_cookies(response, access, refresh)
    return success_response("Token refreshed", {"user_id": str(user.id)})


@router.post("/logout", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def logout(response: Response):
    response.delete_cookie(settings.access_cookie_name)
    response.delete_cookie(settings.refresh_cookie_name)
    return success_response("Logged out", None)


@router.get("/me", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def me(current_user=Depends(get_current_user)):
    return success_response(
        "Current user",
        {"id": str(current_user.id), "email": current_user.email, "name": current_user.name, "role": current_user.role.value},
    )

