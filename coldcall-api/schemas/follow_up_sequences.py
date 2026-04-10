from pydantic import ConfigDict

from schemas.common import ResourceCreate, ResourceResponse, ResourceUpdate


class FollowUpSequencesCreate(ResourceCreate):
    pass


class FollowUpSequencesUpdate(ResourceUpdate):
    pass


class FollowUpSequencesResponse(ResourceResponse):
    model_config = ConfigDict(from_attributes=True)
