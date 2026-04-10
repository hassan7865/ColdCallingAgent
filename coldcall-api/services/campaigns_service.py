from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from models.entities import CampaignStatus
from services.base_service import create_resource, delete_resource, get_resource, list_resources, update_resource


async def list_campaigns(session: AsyncSession, skip: int, limit: int, user_id: UUID):
    return await list_resources(session, "campaigns", skip, limit, {"user_id": user_id})


async def get_campaign(session: AsyncSession, campaign_id: UUID, user_id: UUID):
    row = await get_resource(session, "campaigns", campaign_id)
    if row is None or row.user_id != user_id:
        return None
    return row


async def create_campaign(session: AsyncSession, payload: dict):
    return await create_resource(session, "campaigns", payload)


async def update_campaign(session: AsyncSession, campaign_id: UUID, user_id: UUID, payload: dict):
    row = await get_campaign(session, campaign_id, user_id)
    if row is None:
        return None
    return await update_resource(session, "campaigns", campaign_id, payload)


async def delete_campaign(session: AsyncSession, campaign_id: UUID, user_id: UUID):
    row = await get_campaign(session, campaign_id, user_id)
    if row is None:
        return False
    return await delete_resource(session, "campaigns", campaign_id)


async def activate_campaign(session: AsyncSession, campaign_id: UUID, user_id: UUID):
    row = await get_campaign(session, campaign_id, user_id)
    if row is None:
        return None
    return await update_resource(session, "campaigns", campaign_id, {"status": CampaignStatus.active})


async def pause_campaign(session: AsyncSession, campaign_id: UUID, user_id: UUID):
    row = await get_campaign(session, campaign_id, user_id)
    if row is None:
        return None
    return await update_resource(session, "campaigns", campaign_id, {"status": CampaignStatus.paused})


async def list_campaign_prospects(session: AsyncSession, campaign_id: UUID, user_id: UUID, skip: int, limit: int):
    row = await get_campaign(session, campaign_id, user_id)
    if row is None:
        return None
    return await list_resources(session, "prospects", skip, limit, {"campaign_id": campaign_id})


async def add_campaign_prospects(session: AsyncSession, campaign_id: UUID, user_id: UUID, payload: dict):
    row = await get_campaign(session, campaign_id, user_id)
    if row is None:
        return None
    return {"campaign_id": str(campaign_id), "prospect_ids": payload.get("prospect_ids", [])}
