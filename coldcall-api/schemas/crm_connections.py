from pydantic import ConfigDict

from schemas.common import ResourceCreate, ResourceResponse, ResourceUpdate


class CrmConnectionsCreate(ResourceCreate):
    pass


class CrmConnectionsUpdate(ResourceUpdate):
    pass


class CrmConnectionsResponse(ResourceResponse):
    model_config = ConfigDict(from_attributes=True)
