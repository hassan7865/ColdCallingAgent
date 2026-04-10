from pydantic import ConfigDict

from schemas.common import ResourceCreate, ResourceResponse, ResourceUpdate


class CallObjectionsCreate(ResourceCreate):
    pass


class CallObjectionsUpdate(ResourceUpdate):
    pass


class CallObjectionsResponse(ResourceResponse):
    model_config = ConfigDict(from_attributes=True)
