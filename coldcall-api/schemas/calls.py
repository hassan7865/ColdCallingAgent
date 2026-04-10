from pydantic import ConfigDict

from schemas.common import ResourceCreate, ResourceResponse, ResourceUpdate


class CallsCreate(ResourceCreate):
    pass


class CallsUpdate(ResourceUpdate):
    pass


class CallsResponse(ResourceResponse):
    model_config = ConfigDict(from_attributes=True)
