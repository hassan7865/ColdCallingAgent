from typing import Any
from uuid import UUID

from pydantic import ConfigDict

from models.entities import TouchpointType
from schemas.common import ResourceCreate, ResourceResponse, ResourceUpdate


class TouchpointLogCreate(ResourceCreate):
    pass


class TouchpointLogUpdate(ResourceUpdate):
    pass


class TouchpointLogResponse(ResourceResponse):
    model_config = ConfigDict(from_attributes=True)

    prospect_id: UUID
    touchpoint_type: TouchpointType
    reference_id: UUID
    outcome_summary: str | None = None


def touchpoint_to_jsonable(row: Any) -> dict[str, Any]:
    return TouchpointLogResponse.model_validate(row).model_dump(mode="json")


def touchpoints_page_to_jsonable(data: dict[str, Any]) -> dict[str, Any]:
    return {
        "items": [touchpoint_to_jsonable(x) for x in data["items"]],
        "total": data["total"],
        "page": data["page"],
        "pages": data["pages"],
    }
