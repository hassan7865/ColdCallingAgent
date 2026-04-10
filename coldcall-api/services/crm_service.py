from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from services.base_service import create_resource, delete_resource, list_resources
from services.jobs_service import enqueue_job


async def list_connections(session: AsyncSession, skip: int, limit: int):
    return await list_resources(session, "crm", skip, limit)


async def connect_crm(session: AsyncSession, payload: dict):
    return await create_resource(session, "crm", payload)


async def crm_callback(session: AsyncSession, payload: dict):
    return payload


async def delete_connection(session: AsyncSession, connection_id: UUID):
    return await delete_resource(session, "crm", connection_id)


async def sync_single(session: AsyncSession, prospect_id: UUID):
    return await enqueue_job(session, "crm_sync_single", "prospect", prospect_id, None)


async def sync_bulk(session: AsyncSession, payload: dict):
    return await enqueue_job(session, "crm_sync_bulk", "prospect", None, payload)


async def sync_logs(session: AsyncSession, skip: int, limit: int):
    return await list_resources(session, "jobs", skip, limit, {"job_type": "crm_sync_bulk"})
