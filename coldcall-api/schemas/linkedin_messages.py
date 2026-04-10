from pydantic import ConfigDict

from schemas.common import ResourceCreate, ResourceResponse, ResourceUpdate


class LinkedinMessagesCreate(ResourceCreate):
    pass


class LinkedinMessagesUpdate(ResourceUpdate):
    pass


class LinkedinMessagesResponse(ResourceResponse):
    model_config = ConfigDict(from_attributes=True)
