from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.responses import Envelope, success_response
from dependencies.auth import get_current_user
from dependencies.database import get_async_session
from dependencies.pagination import PaginationParams
from services import emails_service

router = APIRouter(prefix="/emails", tags=["emails"], dependencies=[Depends(get_current_user)])

@router.get("", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def list_emails(params: PaginationParams = Depends(), prospect_id: UUID | None = None, campaign_id: UUID | None = None, status_filter: str | None = Query(None, alias="status"), session: AsyncSession = Depends(get_async_session)):
    data = await emails_service.list_emails(session, params.skip, params.limit, {"prospect_id": prospect_id, "campaign_id": campaign_id, "status": status_filter})
    return success_response("Emails fetched", data)

@router.post("/send", response_model=Envelope[dict], status_code=status.HTTP_202_ACCEPTED)
async def send_email(payload: dict, session: AsyncSession = Depends(get_async_session)):
    data = await emails_service.send_email(session, payload)
    return success_response("Email send queued", {"job": data})

@router.post("/sequence/enroll", response_model=Envelope[dict], status_code=status.HTTP_202_ACCEPTED)
async def enroll(payload: dict, session: AsyncSession = Depends(get_async_session)):
    data = await emails_service.enroll_email_sequence(session, payload)
    return success_response("Email sequence enroll queued", {"job": data})

@router.post("/sequence/pause", response_model=Envelope[dict], status_code=status.HTTP_202_ACCEPTED)
async def pause(prospect_id: UUID, session: AsyncSession = Depends(get_async_session)):
    data = await emails_service.pause_email_sequence(session, {"prospect_id": str(prospect_id)})
    return success_response("Email sequence pause queued", {"job": data})

@router.get("/{email_id}/stats", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def stats(email_id: UUID, session: AsyncSession = Depends(get_async_session)):
    data = await emails_service.email_stats(session, email_id)
    return success_response("Email stats fetched", data)

@router.post("/generate", response_model=Envelope[dict], status_code=status.HTTP_202_ACCEPTED)
async def generate(payload: dict, session: AsyncSession = Depends(get_async_session)):
    data = await emails_service.generate_email(session, payload)
    return success_response("Email generation queued", {"job": data})
