from typing import Any
from uuid import UUID

from pydantic import ConfigDict

from models.entities import JobStatus
from schemas.common import ResourceCreate, ResourceResponse, ResourceUpdate


class AsyncJobsCreate(ResourceCreate):
    pass


class AsyncJobsUpdate(ResourceUpdate):
    pass


class AsyncJobsResponse(ResourceResponse):
    model_config = ConfigDict(from_attributes=True)

    job_type: str
    resource_type: str | None = None
    resource_id: UUID | None = None
    status: JobStatus
    payload: dict[str, Any] | None = None
    result: dict[str, Any] | None = None
    error_message: str | None = None


def async_job_to_jsonable(job: Any) -> dict[str, Any]:
    return AsyncJobsResponse.model_validate(job).model_dump(mode="json")
