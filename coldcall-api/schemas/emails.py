from pydantic import ConfigDict

from schemas.common import ResourceCreate, ResourceResponse, ResourceUpdate


class EmailsCreate(ResourceCreate):
    pass


class EmailsUpdate(ResourceUpdate):
    pass


class EmailsResponse(ResourceResponse):
    model_config = ConfigDict(from_attributes=True)
