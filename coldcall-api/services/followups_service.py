from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from services.base_service import list_resources, update_resource
from services.jobs_service import enqueue_job


async def list_followups(session: AsyncSession, skip: int, limit: int):
    return await list_resources(session, "followups", skip, limit, {"is_active": True})


async def enroll_followup(session: AsyncSession, payload: dict):
    return await enqueue_job(session, "followup_enroll", "followup", None, payload)


async def pause_followup(session: AsyncSession, followup_id: UUID):
    return await update_resource(session, "followups", followup_id, {"is_active": False})


async def resume_followup(session: AsyncSession, followup_id: UUID):
    return await update_resource(session, "followups", followup_id, {"is_active": True})


async def due_today(session: AsyncSession):
    return await enqueue_job(session, "followup_due_today", "followup", None, None)
