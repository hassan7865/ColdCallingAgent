from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from services.base_service import create_resource, get_resource, list_resources, update_resource
from services.jobs_service import enqueue_job


async def list_calls(session: AsyncSession, skip: int, limit: int, filters: dict):
    return await list_resources(session, "calls", skip, limit, filters)


async def get_call(session: AsyncSession, call_id: UUID):
    return await get_resource(session, "calls", call_id)


async def initiate_call(session: AsyncSession, payload: dict):
    return await enqueue_job(session, "call_initiate", "call", None, payload)


async def end_call(session: AsyncSession, call_id: UUID):
    return await update_resource(session, "calls", call_id, {"status": "completed"})


async def update_call(session: AsyncSession, call_id: UUID, payload: dict):
    return await update_resource(session, "calls", call_id, payload)


async def get_call_transcript(session: AsyncSession, call_id: UUID):
    call = await get_resource(session, "calls", call_id)
    return {"transcript": getattr(call, "transcript", None)}


async def get_call_recording(session: AsyncSession, call_id: UUID):
    call = await get_resource(session, "calls", call_id)
    return {"recording_url": getattr(call, "recording_url", None)}


async def log_call_objection(session: AsyncSession, call_id: UUID, payload: dict):
    payload["call_id"] = call_id
    return await create_resource(session, "call_objections", payload)
