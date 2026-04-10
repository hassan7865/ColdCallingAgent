from pydantic import ConfigDict

from schemas.common import ResourceCreate, ResourceResponse, ResourceUpdate


class ReEngagementTriggersCreate(ResourceCreate):
    pass


class ReEngagementTriggersUpdate(ResourceUpdate):
    pass


class ReEngagementTriggersResponse(ResourceResponse):
    model_config = ConfigDict(from_attributes=True)
