from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.responses import Envelope, success_response
from dependencies.auth import get_current_user
from dependencies.database import get_async_session
from dependencies.pagination import PaginationParams
from services import triggers_service

router = APIRouter(prefix="/triggers", tags=["triggers"], dependencies=[Depends(get_current_user)])

@router.get("", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def list_triggers(params: PaginationParams = Depends(), session: AsyncSession = Depends(get_async_session)):
    data = await triggers_service.list_triggers(session, params.skip, params.limit)
    return success_response("Triggers fetched", data)

@router.post("/scan", response_model=Envelope[dict], status_code=status.HTTP_202_ACCEPTED)
async def scan(session: AsyncSession = Depends(get_async_session)):
    data = await triggers_service.scan_triggers(session)
    return success_response("Trigger scan queued", {"job": data})

@router.post("/{trigger_id}/action", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def action(trigger_id: UUID, payload: dict, session: AsyncSession = Depends(get_async_session)):
    data = await triggers_service.action_trigger(session, trigger_id, payload)
    return success_response("Trigger action recorded", {"item": data})
