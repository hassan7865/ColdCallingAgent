from pydantic import ConfigDict

from schemas.common import ResourceCreate, ResourceResponse, ResourceUpdate


class UsersCreate(ResourceCreate):
    pass


class UsersUpdate(ResourceUpdate):
    pass


class UsersResponse(ResourceResponse):
    model_config = ConfigDict(from_attributes=True)
