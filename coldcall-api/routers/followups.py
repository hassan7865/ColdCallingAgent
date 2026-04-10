from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.responses import Envelope, success_response
from dependencies.auth import get_current_user
from dependencies.database import get_async_session
from dependencies.pagination import PaginationParams
from services import followups_service

router = APIRouter(prefix="/followups", tags=["followups"], dependencies=[Depends(get_current_user)])

@router.get("", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def list_followups(params: PaginationParams = Depends(), session: AsyncSession = Depends(get_async_session)):
    data = await followups_service.list_followups(session, params.skip, params.limit)
    return success_response("Follow-up sequences fetched", data)

@router.post("/enroll", response_model=Envelope[dict], status_code=status.HTTP_202_ACCEPTED)
async def enroll(payload: dict, session: AsyncSession = Depends(get_async_session)):
    data = await followups_service.enroll_followup(session, payload)
    return success_response("Follow-up enroll queued", {"job": data})

@router.post("/{followup_id}/pause", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def pause(followup_id: UUID, session: AsyncSession = Depends(get_async_session)):
    data = await followups_service.pause_followup(session, followup_id)
    return success_response("Follow-up paused", {"item": data})

@router.post("/{followup_id}/resume", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def resume(followup_id: UUID, session: AsyncSession = Depends(get_async_session)):
    data = await followups_service.resume_followup(session, followup_id)
    return success_response("Follow-up resumed", {"item": data})

@router.get("/due-today", response_model=Envelope[dict], status_code=status.HTTP_202_ACCEPTED)
async def due_today(session: AsyncSession = Depends(get_async_session)):
    data = await followups_service.due_today(session)
    return success_response("Due-today scan queued", {"job": data})
