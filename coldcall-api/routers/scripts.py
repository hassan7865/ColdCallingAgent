from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.responses import Envelope, success_response
from dependencies.auth import get_current_user
from dependencies.database import get_async_session
from dependencies.pagination import PaginationParams
from schemas.call_scripts import CallScriptsCreate, CallScriptsUpdate
from services import scripts_service

router = APIRouter(prefix="/scripts", tags=["scripts"], dependencies=[Depends(get_current_user)])

@router.get("", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def list_scripts(params: PaginationParams = Depends(), session: AsyncSession = Depends(get_async_session)):
    data = await scripts_service.list_scripts(session, params.skip, params.limit)
    return success_response("Scripts fetched", data)

@router.get("/{script_id}", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def get_script(script_id: UUID, session: AsyncSession = Depends(get_async_session)):
    data = await scripts_service.get_script(session, script_id)
    return success_response("Script fetched", {"item": data})

@router.post("", response_model=Envelope[dict], status_code=status.HTTP_201_CREATED)
async def create_script(payload: CallScriptsCreate, session: AsyncSession = Depends(get_async_session)):
    data = await scripts_service.create_script(session, payload.model_dump(exclude_none=True))
    return success_response("Script created", {"item": data})

@router.patch("/{script_id}", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def update_script(script_id: UUID, payload: CallScriptsUpdate, session: AsyncSession = Depends(get_async_session)):
    data = await scripts_service.update_script(session, script_id, payload.model_dump(exclude_none=True))
    return success_response("Script updated", {"item": data})

@router.post("/generate", response_model=Envelope[dict], status_code=status.HTTP_202_ACCEPTED)
async def generate_script(payload: dict, session: AsyncSession = Depends(get_async_session)):
    data = await scripts_service.generate_script(session, payload)
    return success_response("Script generation queued", {"job": data})

@router.post("/{script_id}/clone", response_model=Envelope[dict], status_code=status.HTTP_201_CREATED)
async def clone_script(script_id: UUID, payload: dict, session: AsyncSession = Depends(get_async_session)):
    data = await scripts_service.clone_script(session, script_id, payload)
    return success_response("Script cloned", {"item": data})
