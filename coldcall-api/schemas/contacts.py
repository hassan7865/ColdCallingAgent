from pydantic import ConfigDict

from schemas.common import ResourceCreate, ResourceResponse, ResourceUpdate


class ContactsCreate(ResourceCreate):
    pass


class ContactsUpdate(ResourceUpdate):
    pass


class ContactsResponse(ResourceResponse):
    model_config = ConfigDict(from_attributes=True)
