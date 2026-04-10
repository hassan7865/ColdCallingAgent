from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from services.base_service import create_resource, delete_resource, get_resource, list_resources, update_resource
from services.jobs_service import enqueue_job


async def list_prospects(session: AsyncSession, skip: int, limit: int, filters: dict):
    return await list_resources(session, "prospects", skip, limit, filters)


async def get_prospect(session: AsyncSession, resource_id: UUID):
    return await get_resource(session, "prospects", resource_id)


async def create_prospect(session: AsyncSession, payload: dict):
    return await create_resource(session, "prospects", payload)


async def update_prospect(session: AsyncSession, resource_id: UUID, payload: dict):
    return await update_resource(session, "prospects", resource_id, payload)


async def delete_prospect(session: AsyncSession, resource_id: UUID):
    return await delete_resource(session, "prospects", resource_id)


async def research_prospect(session: AsyncSession, prospect_id: UUID):
    return await enqueue_job(session, "prospect_research", "prospect", prospect_id, None)


async def generate_script_for_prospect(session: AsyncSession, prospect_id: UUID):
    return await enqueue_job(session, "generate_script", "prospect", prospect_id, None)


async def get_prospect_touchpoints(session: AsyncSession, prospect_id: UUID):
    return await list_resources(session, "touchpoints", 0, 100, {"prospect_id": prospect_id})


async def import_prospects(session: AsyncSession, payload: dict):
    return await enqueue_job(session, "prospects_import", "prospect", None, payload)
