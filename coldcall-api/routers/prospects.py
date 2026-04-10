from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.responses import Envelope, success_response
from dependencies.auth import get_current_user
from dependencies.database import get_async_session
from dependencies.pagination import PaginationParams
from schemas.async_jobs import async_job_to_jsonable
from schemas.prospects import (
    ProspectsCreate,
    ProspectsUpdate,
    prospect_to_jsonable,
    prospects_page_to_jsonable,
)
from schemas.touchpoint_log import touchpoints_page_to_jsonable
from services import prospects_service

router = APIRouter(prefix="/prospects", tags=["prospects"], dependencies=[Depends(get_current_user)])

@router.get("", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def list_prospects(params: PaginationParams = Depends(), status_filter: str | None = Query(None, alias="status"), score: int | None = None, campaign_id: UUID | None = None, signal: str | None = None, session: AsyncSession = Depends(get_async_session)):
    data = await prospects_service.list_prospects(session, params.skip, params.limit, {"status": status_filter, "icp_score": score, "campaign_id": campaign_id, "buying_signals": signal})
    return success_response("Prospects fetched", prospects_page_to_jsonable(data))

@router.get("/{prospect_id}", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def get_prospect(prospect_id: UUID, session: AsyncSession = Depends(get_async_session)):
    data = await prospects_service.get_prospect(session, prospect_id)
    return success_response("Prospect fetched", {"item": prospect_to_jsonable(data) if data else None})

@router.post("", response_model=Envelope[dict], status_code=status.HTTP_201_CREATED)
async def create_prospect(payload: ProspectsCreate, session: AsyncSession = Depends(get_async_session)):
    data = await prospects_service.create_prospect(session, payload.model_dump(exclude_none=True))
    return success_response("Prospect created", {"item": prospect_to_jsonable(data)})

@router.patch("/{prospect_id}", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def update_prospect(prospect_id: UUID, payload: ProspectsUpdate, session: AsyncSession = Depends(get_async_session)):
    data = await prospects_service.update_prospect(session, prospect_id, payload.model_dump(exclude_none=True))
    return success_response("Prospect updated", {"item": prospect_to_jsonable(data) if data else None})

@router.delete("/{prospect_id}", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def delete_prospect(prospect_id: UUID, session: AsyncSession = Depends(get_async_session)):
    data = await prospects_service.delete_prospect(session, prospect_id)
    return success_response("Prospect deleted", {"deleted": data})

@router.post("/{prospect_id}/research", response_model=Envelope[dict], status_code=status.HTTP_202_ACCEPTED)
async def research_prospect(prospect_id: UUID, session: AsyncSession = Depends(get_async_session)):
    data = await prospects_service.research_prospect(session, prospect_id)
    return success_response("Prospect research queued", {"job": async_job_to_jsonable(data)})

@router.post("/{prospect_id}/generate-script", response_model=Envelope[dict], status_code=status.HTTP_202_ACCEPTED)
async def generate_script(prospect_id: UUID, session: AsyncSession = Depends(get_async_session)):
    data = await prospects_service.generate_script_for_prospect(session, prospect_id)
    return success_response("Script generation queued", {"job": async_job_to_jsonable(data)})

@router.get("/{prospect_id}/touchpoints", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def touchpoints(prospect_id: UUID, session: AsyncSession = Depends(get_async_session)):
    data = await prospects_service.get_prospect_touchpoints(session, prospect_id)
    return success_response("Prospect touchpoints fetched", touchpoints_page_to_jsonable(data))

@router.post("/import", response_model=Envelope[dict], status_code=status.HTTP_202_ACCEPTED)
async def import_prospects(payload: dict, session: AsyncSession = Depends(get_async_session)):
    data = await prospects_service.import_prospects(session, payload)
    return success_response("Prospect import queued", {"job": async_job_to_jsonable(data)})
