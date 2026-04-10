from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.responses import Envelope, success_response
from dependencies.auth import get_current_user
from dependencies.database import get_async_session
from models.entities import User
from services import reports_service

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/summary", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def summary(
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    data = await reports_service.reports_summary(session, current_user.id)
    return success_response("Summary report fetched", data)


@router.get("/call-performance", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def call_performance(
    days: int = Query(7, ge=1, le=365),
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    data = await reports_service.reports_call_performance(session, current_user.id, days)
    return success_response("Call performance fetched", data)


@router.get("/segments", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def segments(
    days: int = Query(30, ge=1, le=365),
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    data = await reports_service.reports_segments(session, current_user.id, days)
    return success_response("Segments report fetched", data)


@router.get("/outcomes", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def outcomes(
    days: int = Query(30, ge=1, le=365),
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    data = await reports_service.reports_outcomes(session, current_user.id, days)
    return success_response("Outcomes report fetched", data)


@router.get("/insight", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def insight(
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    data = await reports_service.reports_insight(session, current_user.id)
    return success_response("Insight fetched", data)


@router.get("/agent-performance", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def agent_performance(
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    data = await reports_service.reports_agent_performance(session, current_user.id)
    return success_response("Agent performance report fetched", data)


@router.get("/campaign/{campaign_id}", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def campaign(
    campaign_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    data = await reports_service.reports_campaign(session, campaign_id)
    return success_response("Campaign report fetched", data)
