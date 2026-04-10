import asyncio
from typing import Any
from uuid import UUID

from sqlalchemy import insert, update
from sqlalchemy.ext.asyncio import AsyncSession

from dependencies.database import AsyncSessionLocal
from models.entities import AsyncJob, JobStatus


async def _process_job_in_process(job_id: UUID) -> None:
    async with AsyncSessionLocal() as session:
        await session.execute(update(AsyncJob).where(AsyncJob.id == job_id).values(status=JobStatus.running))
        await session.commit()
        # Simulate lightweight non-blocking task execution path.
        await session.execute(
            update(AsyncJob)
            .where(AsyncJob.id == job_id)
            .values(status=JobStatus.completed, result={"status": "completed_in_process"})
        )
        await session.commit()


async def enqueue_job(
    session: AsyncSession, job_type: str, resource_type: str | None, resource_id: UUID | None, payload: dict[str, Any] | None
) -> AsyncJob:
    stmt = (
        insert(AsyncJob)
        .values(
            job_type=job_type,
            resource_type=resource_type,
            resource_id=resource_id,
            payload=payload,
            status=JobStatus.queued,
        )
        .returning(AsyncJob)
    )
    job = (await session.execute(stmt)).scalar_one()
    await session.commit()
    asyncio.create_task(_process_job_in_process(job.id))
    return job

