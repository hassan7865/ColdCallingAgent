from pydantic import ConfigDict

from schemas.common import ResourceCreate, ResourceResponse, ResourceUpdate


class CompaniesCreate(ResourceCreate):
    pass


class CompaniesUpdate(ResourceUpdate):
    pass


class CompaniesResponse(ResourceResponse):
    model_config = ConfigDict(from_attributes=True)
