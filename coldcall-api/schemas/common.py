from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ResourceCreate(BaseModel):
    payload: dict[str, Any] = {}


class ResourceUpdate(BaseModel):
    payload: dict[str, Any] | None = None


class ResourceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: Any
    updated_at: Any


class PaginatedData(BaseModel):
    items: list[Any]
    total: int
    page: int
    pages: int

