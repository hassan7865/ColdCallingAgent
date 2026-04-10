from math import ceil
from typing import Any
from uuid import UUID

from sqlalchemy import delete, func, insert, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from models.entities import (
    AsyncJob,
    Call,
    CallObjection,
    CallScript,
    Campaign,
    Company,
    Contact,
    CrmConnection,
    Email,
    FollowUpSequence,
    LinkedinMessage,
    Meeting,
    Prospect,
    ReEngagementTrigger,
    TouchpointLog,
    User,
)

MODEL_MAP = {
    "users": User,
    "companies": Company,
    "contacts": Contact,
    "prospects": Prospect,
    "campaigns": Campaign,
    "scripts": CallScript,
    "calls": Call,
    "call_objections": CallObjection,
    "emails": Email,
    "linkedin": LinkedinMessage,
    "followups": FollowUpSequence,
    "meetings": Meeting,
    "crm": CrmConnection,
    "touchpoints": TouchpointLog,
    "triggers": ReEngagementTrigger,
    "jobs": AsyncJob,
}


async def list_resources(
    session: AsyncSession, resource_name: str, skip: int, limit: int, filters: dict[str, Any] | None = None
) -> dict[str, Any]:
    model = MODEL_MAP[resource_name]
    stmt = select(model)
    count_stmt = select(func.count()).select_from(model)
    if filters:
        for key, value in filters.items():
            if value is not None and hasattr(model, key):
                stmt = stmt.where(getattr(model, key) == value)
                count_stmt = count_stmt.where(getattr(model, key) == value)
    stmt = stmt.offset(skip).limit(limit)
    items = (await session.execute(stmt)).scalars().all()
    total = (await session.execute(count_stmt)).scalar_one()
    page = (skip // limit) + 1
    pages = ceil(total / limit) if total else 0
    return {"items": items, "total": total, "page": page, "pages": pages}


async def get_resource(session: AsyncSession, resource_name: str, resource_id: UUID) -> Any | None:
    model = MODEL_MAP[resource_name]
    result = await session.execute(select(model).where(model.id == resource_id))
    return result.scalar_one_or_none()


async def create_resource(session: AsyncSession, resource_name: str, payload: dict[str, Any]) -> Any:
    model = MODEL_MAP[resource_name]
    stmt = insert(model).values(**payload).returning(model)
    created = (await session.execute(stmt)).scalar_one()
    await session.commit()
    return created


async def update_resource(session: AsyncSession, resource_name: str, resource_id: UUID, payload: dict[str, Any]) -> Any | None:
    model = MODEL_MAP[resource_name]
    stmt = update(model).where(model.id == resource_id).values(**payload).returning(model)
    updated = (await session.execute(stmt)).scalar_one_or_none()
    await session.commit()
    return updated


async def delete_resource(session: AsyncSession, resource_name: str, resource_id: UUID) -> bool:
    model = MODEL_MAP[resource_name]
    stmt = delete(model).where(model.id == resource_id)
    result = await session.execute(stmt)
    await session.commit()
    return result.rowcount > 0

