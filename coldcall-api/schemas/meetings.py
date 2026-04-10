from pydantic import ConfigDict

from schemas.common import ResourceCreate, ResourceResponse, ResourceUpdate


class MeetingsCreate(ResourceCreate):
    pass


class MeetingsUpdate(ResourceUpdate):
    pass


class MeetingsResponse(ResourceResponse):
    model_config = ConfigDict(from_attributes=True)
