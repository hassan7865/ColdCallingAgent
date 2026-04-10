from pydantic import ConfigDict

from schemas.common import ResourceCreate, ResourceResponse, ResourceUpdate


class CallScriptsCreate(ResourceCreate):
    pass


class CallScriptsUpdate(ResourceUpdate):
    pass


class CallScriptsResponse(ResourceResponse):
    model_config = ConfigDict(from_attributes=True)
