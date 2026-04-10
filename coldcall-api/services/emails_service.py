from sqlalchemy.ext.asyncio import AsyncSession

from services.base_service import list_resources
from services.jobs_service import enqueue_job


async def list_emails(session: AsyncSession, skip: int, limit: int, filters: dict):
    return await list_resources(session, "emails", skip, limit, filters)


async def send_email(session: AsyncSession, payload: dict):
    return await enqueue_job(session, "send_email", "email", None, payload)


async def enroll_email_sequence(session: AsyncSession, payload: dict):
    return await enqueue_job(session, "email_sequence_enroll", "email", None, payload)


async def pause_email_sequence(session: AsyncSession, payload: dict):
    return await enqueue_job(session, "email_sequence_pause", "email", None, payload)


async def email_stats(session: AsyncSession, email_id):
    return {"email_id": str(email_id), "opens": 0, "clicks": 0, "replies": 0}


async def generate_email(session: AsyncSession, payload: dict):
    return await enqueue_job(session, "email_generate", "email", None, payload)
