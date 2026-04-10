from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from services.base_service import create_resource, get_resource, list_resources, update_resource
from services.jobs_service import enqueue_job


async def list_scripts(session: AsyncSession, skip: int, limit: int):
    return await list_resources(session, "scripts", skip, limit)


async def get_script(session: AsyncSession, script_id: UUID):
    return await get_resource(session, "scripts", script_id)


async def create_script(session: AsyncSession, payload: dict):
    return await create_resource(session, "scripts", payload)


async def update_script(session: AsyncSession, script_id: UUID, payload: dict):
    return await update_resource(session, "scripts", script_id, payload)


async def generate_script(session: AsyncSession, payload: dict):
    return await enqueue_job(session, "script_generate", "script", None, payload)


async def clone_script(session: AsyncSession, script_id: UUID, payload: dict):
    data = dict(payload)
    data["source_script_id"] = str(script_id)
    return await create_resource(session, "scripts", data)
