from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from services.base_service import create_resource, delete_resource, get_resource, list_resources, update_resource
from services.jobs_service import enqueue_job


async def list_meetings(session: AsyncSession, skip: int, limit: int, filters: dict):
    return await list_resources(session, "meetings", skip, limit, filters)


async def get_meeting(session: AsyncSession, meeting_id: UUID):
    return await get_resource(session, "meetings", meeting_id)


async def book_meeting(session: AsyncSession, payload: dict):
    return await create_resource(session, "meetings", payload)


async def update_meeting(session: AsyncSession, meeting_id: UUID, payload: dict):
    return await update_resource(session, "meetings", meeting_id, payload)


async def delete_meeting(session: AsyncSession, meeting_id: UUID):
    return await delete_resource(session, "meetings", meeting_id)


async def available_slots(session: AsyncSession, payload: dict):
    return {"date": payload.get("date"), "duration": payload.get("duration"), "slots": []}


async def connect_calendar(session: AsyncSession, payload: dict):
    return await enqueue_job(session, "calendar_connect", "meeting", None, payload)
