from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.responses import Envelope, success_response
from dependencies.auth import get_current_user
from dependencies.database import get_async_session
from dependencies.pagination import PaginationParams
from services import crm_service

router = APIRouter(prefix="/crm", tags=["crm"], dependencies=[Depends(get_current_user)])

@router.get("/connections", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def connections(params: PaginationParams = Depends(), session: AsyncSession = Depends(get_async_session)):
    data = await crm_service.list_connections(session, params.skip, params.limit)
    return success_response("CRM connections fetched", data)

@router.post("/connect", response_model=Envelope[dict], status_code=status.HTTP_201_CREATED)
async def connect(payload: dict, session: AsyncSession = Depends(get_async_session)):
    data = await crm_service.connect_crm(session, payload)
    return success_response("CRM connected", {"item": data})

@router.get("/callback", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def callback(code: str | None = None, session: AsyncSession = Depends(get_async_session)):
    data = await crm_service.crm_callback(session, {"code": code})
    return success_response("CRM callback handled", data)

@router.delete("/connections/{connection_id}", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def delete_connection(connection_id: UUID, session: AsyncSession = Depends(get_async_session)):
    data = await crm_service.delete_connection(session, connection_id)
    return success_response("CRM connection deleted", {"deleted": data})

@router.post("/sync/{prospect_id}", response_model=Envelope[dict], status_code=status.HTTP_202_ACCEPTED)
async def sync_single(prospect_id: UUID, session: AsyncSession = Depends(get_async_session)):
    data = await crm_service.sync_single(session, prospect_id)
    return success_response("CRM sync queued", {"job": data})

@router.post("/sync/bulk", response_model=Envelope[dict], status_code=status.HTTP_202_ACCEPTED)
async def sync_bulk(payload: dict, session: AsyncSession = Depends(get_async_session)):
    data = await crm_service.sync_bulk(session, payload)
    return success_response("CRM bulk sync queued", {"job": data})

@router.get("/sync-logs", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def sync_logs(params: PaginationParams = Depends(), session: AsyncSession = Depends(get_async_session)):
    data = await crm_service.sync_logs(session, params.skip, params.limit)
    return success_response("CRM sync logs fetched", data)
