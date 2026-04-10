from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.responses import Envelope, success_response
from dependencies.auth import get_current_user
from dependencies.database import get_async_session
from dependencies.pagination import PaginationParams
from schemas.calls import CallsUpdate
from services import calls_service

router = APIRouter(prefix="/calls", tags=["calls"], dependencies=[Depends(get_current_user)])

@router.get("", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def list_calls(params: PaginationParams = Depends(), campaign_id: UUID | None = None, agent_user_id: UUID | None = None, outcome: str | None = Query(None), session: AsyncSession = Depends(get_async_session)):
    data = await calls_service.list_calls(session, params.skip, params.limit, {"campaign_id": campaign_id, "agent_user_id": agent_user_id, "outcome": outcome})
    return success_response("Calls fetched", data)

@router.get("/{call_id}", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def get_call(call_id: UUID, session: AsyncSession = Depends(get_async_session)):
    data = await calls_service.get_call(session, call_id)
    return success_response("Call fetched", {"item": data})

@router.post("/initiate", response_model=Envelope[dict], status_code=status.HTTP_202_ACCEPTED)
async def initiate_call(payload: dict, session: AsyncSession = Depends(get_async_session)):
    data = await calls_service.initiate_call(session, payload)
    return success_response("Call initiation queued", {"job": data})

@router.post("/{call_id}/end", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def end_call(call_id: UUID, session: AsyncSession = Depends(get_async_session)):
    data = await calls_service.end_call(session, call_id)
    return success_response("Call ended", {"item": data})

@router.patch("/{call_id}", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def update_call(call_id: UUID, payload: CallsUpdate, session: AsyncSession = Depends(get_async_session)):
    data = await calls_service.update_call(session, call_id, payload.model_dump(exclude_none=True))
    return success_response("Call updated", {"item": data})

@router.get("/{call_id}/transcript", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def transcript(call_id: UUID, session: AsyncSession = Depends(get_async_session)):
    data = await calls_service.get_call_transcript(session, call_id)
    return success_response("Call transcript fetched", data)

@router.get("/{call_id}/recording", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def recording(call_id: UUID, session: AsyncSession = Depends(get_async_session)):
    data = await calls_service.get_call_recording(session, call_id)
    return success_response("Call recording fetched", data)

@router.post("/{call_id}/log-objection", response_model=Envelope[dict], status_code=status.HTTP_201_CREATED)
async def log_objection(call_id: UUID, payload: dict, session: AsyncSession = Depends(get_async_session)):
    data = await calls_service.log_call_objection(session, call_id, payload)
    return success_response("Call objection logged", {"item": data})
