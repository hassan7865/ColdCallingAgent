from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from models.entities import PreferredChannel, ProspectStatus
from schemas.common import ResourceCreate, ResourceResponse, ResourceUpdate


class ProspectsCreate(BaseModel):
    company_id: UUID
    contact_id: UUID
    icp_score: int | None = None
    status: ProspectStatus | None = None
    assigned_to: UUID | None = None
    campaign_id: UUID | None = None
    pain_points: dict[str, Any] | None = None
    buying_signals: dict[str, Any] | None = None
    preferred_channel: PreferredChannel | None = None


class ProspectsUpdate(BaseModel):
    icp_score: int | None = None
    status: ProspectStatus | None = None
    assigned_to: UUID | None = None
    campaign_id: UUID | None = None
    pain_points: dict[str, Any] | None = None
    buying_signals: dict[str, Any] | None = None
    preferred_channel: PreferredChannel | None = None


class ProspectsResponse(ResourceResponse):
    model_config = ConfigDict(from_attributes=True)

    company_id: UUID
    contact_id: UUID
    icp_score: int | None = None
    status: ProspectStatus
    assigned_to: UUID | None = None
    campaign_id: UUID | None = None
    pain_points: dict[str, Any] | None = None
    buying_signals: dict[str, Any] | None = None
    preferred_channel: PreferredChannel | None = None


def prospect_to_jsonable(prospect: Any) -> dict[str, Any]:
    return ProspectsResponse.model_validate(prospect).model_dump(mode="json")


def prospects_page_to_jsonable(data: dict[str, Any]) -> dict[str, Any]:
    return {
        "items": [prospect_to_jsonable(x) for x in data["items"]],
        "total": data["total"],
        "page": data["page"],
        "pages": data["pages"],
    }
