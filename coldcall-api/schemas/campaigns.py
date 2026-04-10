from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from models.entities import CampaignStatus
from schemas.common import ResourceResponse


class CampaignsCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    target_segment: str | None = None
    channels: list[str] | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None


class CampaignsUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=255)
    target_segment: str | None = None
    status: CampaignStatus | None = None
    channels: list[str] | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None


class CampaignsResponse(ResourceResponse):
    model_config = ConfigDict(from_attributes=True)

    name: str
    user_id: UUID
    target_segment: str | None = None
    status: CampaignStatus
    channels: list[str] | None = None
    total_prospects: int = 0
    start_date: datetime | None = None
    end_date: datetime | None = None


def campaign_to_jsonable(campaign: Any) -> dict[str, Any]:
    """ORM Campaign → JSON-serializable dict (UUIDs and datetimes as strings)."""
    return CampaignsResponse.model_validate(campaign).model_dump(mode="json")


def campaigns_page_to_jsonable(data: dict[str, Any]) -> dict[str, Any]:
    """Paginated list payload with ORM items → JSON-serializable dict."""
    return {
        "items": [campaign_to_jsonable(x) for x in data["items"]],
        "total": data["total"],
        "page": data["page"],
        "pages": data["pages"],
    }
