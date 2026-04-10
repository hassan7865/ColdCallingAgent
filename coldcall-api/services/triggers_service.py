from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from services.base_service import list_resources, update_resource
from services.jobs_service import enqueue_job


async def list_triggers(session: AsyncSession, skip: int, limit: int):
    return await list_resources(session, "triggers", skip, limit)


async def scan_triggers(session: AsyncSession):
    return await enqueue_job(session, "trigger_scan", "trigger", None, None)


async def action_trigger(session: AsyncSession, trigger_id: UUID, payload: dict):
    payload["was_actioned"] = True
    return await update_resource(session, "triggers", trigger_id, payload)
