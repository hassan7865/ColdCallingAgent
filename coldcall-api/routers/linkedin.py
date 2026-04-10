from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.responses import Envelope, success_response
from dependencies.auth import get_current_user
from dependencies.database import get_async_session
from dependencies.pagination import PaginationParams
from services import linkedin_service

router = APIRouter(prefix="/linkedin", tags=["linkedin"], dependencies=[Depends(get_current_user)])

@router.post("/connect-request", response_model=Envelope[dict], status_code=status.HTTP_202_ACCEPTED)
async def connect_request(payload: dict, session: AsyncSession = Depends(get_async_session)):
    data = await linkedin_service.send_connect_request(session, payload)
    return success_response("LinkedIn connection request queued", {"job": data})

@router.post("/message", response_model=Envelope[dict], status_code=status.HTTP_202_ACCEPTED)
async def message(payload: dict, session: AsyncSession = Depends(get_async_session)):
    data = await linkedin_service.send_linkedin_message(session, payload)
    return success_response("LinkedIn message queued", {"job": data})

@router.get("/messages", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def messages(params: PaginationParams = Depends(), prospect_id: str | None = None, status_filter: str | None = Query(None, alias="status"), session: AsyncSession = Depends(get_async_session)):
    data = await linkedin_service.list_linkedin_messages(session, params.skip, params.limit, {"prospect_id": prospect_id, "status": status_filter})
    return success_response("LinkedIn messages fetched", data)
