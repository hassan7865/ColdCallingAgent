from sqlalchemy.ext.asyncio import AsyncSession

from services.base_service import list_resources
from services.jobs_service import enqueue_job


async def send_connect_request(session: AsyncSession, payload: dict):
    return await enqueue_job(session, "linkedin_connect_request", "linkedin", None, payload)


async def send_linkedin_message(session: AsyncSession, payload: dict):
    return await enqueue_job(session, "linkedin_message", "linkedin", None, payload)


async def list_linkedin_messages(session: AsyncSession, skip: int, limit: int, filters: dict):
    return await list_resources(session, "linkedin", skip, limit, filters)
