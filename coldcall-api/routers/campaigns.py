from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.responses import Envelope, success_response
from dependencies.auth import get_current_user
from dependencies.database import get_async_session
from dependencies.pagination import PaginationParams
from models.entities import CampaignStatus, User
from schemas.campaigns import CampaignsCreate, CampaignsUpdate, campaign_to_jsonable, campaigns_page_to_jsonable
from services import campaigns_service

router = APIRouter(prefix="/campaigns", tags=["campaigns"])


def _not_found():
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")


@router.get("", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def list_campaigns(
    params: PaginationParams = Depends(),
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    data = await campaigns_service.list_campaigns(session, params.skip, params.limit, current_user.id)
    return success_response("Campaigns fetched", campaigns_page_to_jsonable(data))


@router.get("/{campaign_id}", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def get_campaign(
    campaign_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    data = await campaigns_service.get_campaign(session, campaign_id, current_user.id)
    if data is None:
        _not_found()
    return success_response("Campaign fetched", {"item": campaign_to_jsonable(data)})


@router.post("", response_model=Envelope[dict], status_code=status.HTTP_201_CREATED)
async def create_campaign(
    payload: CampaignsCreate,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    body = payload.model_dump(exclude_none=True)
    body["user_id"] = current_user.id
    body.setdefault("status", CampaignStatus.draft)
    body.setdefault("total_prospects", 0)
    data = await campaigns_service.create_campaign(session, body)
    return success_response("Campaign created", {"item": campaign_to_jsonable(data)})


@router.patch("/{campaign_id}", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def update_campaign(
    campaign_id: UUID,
    payload: CampaignsUpdate,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    body = payload.model_dump(exclude_none=True)
    data = await campaigns_service.update_campaign(session, campaign_id, current_user.id, body)
    if data is None:
        _not_found()
    return success_response("Campaign updated", {"item": campaign_to_jsonable(data)})


@router.delete("/{campaign_id}", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def delete_campaign(
    campaign_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    deleted = await campaigns_service.delete_campaign(session, campaign_id, current_user.id)
    if not deleted:
        _not_found()
    return success_response("Campaign deleted", {"deleted": True})


@router.post("/{campaign_id}/activate", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def activate_campaign(
    campaign_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    data = await campaigns_service.activate_campaign(session, campaign_id, current_user.id)
    if data is None:
        _not_found()
    return success_response("Campaign activated", {"item": campaign_to_jsonable(data)})


@router.post("/{campaign_id}/pause", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def pause_campaign(
    campaign_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    data = await campaigns_service.pause_campaign(session, campaign_id, current_user.id)
    if data is None:
        _not_found()
    return success_response("Campaign paused", {"item": campaign_to_jsonable(data)})


@router.get("/{campaign_id}/prospects", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def campaign_prospects(
    campaign_id: UUID,
    params: PaginationParams = Depends(),
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    data = await campaigns_service.list_campaign_prospects(session, campaign_id, current_user.id, params.skip, params.limit)
    if data is None:
        _not_found()
    return success_response("Campaign prospects fetched", data)


@router.post("/{campaign_id}/add-prospects", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def add_prospects(
    campaign_id: UUID,
    payload: dict,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    data = await campaigns_service.add_campaign_prospects(session, campaign_id, current_user.id, payload)
    if data is None:
        _not_found()
    return success_response("Prospects added to campaign", data)
