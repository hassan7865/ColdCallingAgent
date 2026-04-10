from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.responses import Envelope, success_response
from dependencies.auth import get_current_user
from dependencies.database import get_async_session
from dependencies.pagination import PaginationParams
from schemas.meetings import MeetingsCreate, MeetingsUpdate
from services import meetings_service

router = APIRouter(tags=["meetings"], dependencies=[Depends(get_current_user)])

@router.get("/meetings", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def list_meetings(params: PaginationParams = Depends(), user_id: UUID | None = None, status_filter: str | None = Query(None, alias="status"), session: AsyncSession = Depends(get_async_session)):
    data = await meetings_service.list_meetings(session, params.skip, params.limit, {"user_id": user_id, "status": status_filter})
    return success_response("Meetings fetched", data)

@router.get("/meetings/{meeting_id}", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def get_meeting(meeting_id: UUID, session: AsyncSession = Depends(get_async_session)):
    data = await meetings_service.get_meeting(session, meeting_id)
    return success_response("Meeting fetched", {"item": data})

@router.post("/meetings/book", response_model=Envelope[dict], status_code=status.HTTP_201_CREATED)
async def book_meeting(payload: MeetingsCreate, session: AsyncSession = Depends(get_async_session)):
    data = await meetings_service.book_meeting(session, payload.model_dump(exclude_none=True))
    return success_response("Meeting booked", {"item": data})

@router.patch("/meetings/{meeting_id}", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def update_meeting(meeting_id: UUID, payload: MeetingsUpdate, session: AsyncSession = Depends(get_async_session)):
    data = await meetings_service.update_meeting(session, meeting_id, payload.model_dump(exclude_none=True))
    return success_response("Meeting updated", {"item": data})

@router.delete("/meetings/{meeting_id}", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def delete_meeting(meeting_id: UUID, session: AsyncSession = Depends(get_async_session)):
    data = await meetings_service.delete_meeting(session, meeting_id)
    return success_response("Meeting deleted", {"deleted": data})

@router.get("/calendar/available-slots", response_model=Envelope[dict], status_code=status.HTTP_200_OK)
async def available_slots(date: str, duration: int, session: AsyncSession = Depends(get_async_session)):
    data = await meetings_service.available_slots(session, {"date": date, "duration": duration})
    return success_response("Available slots fetched", data)

@router.post("/calendar/connect", response_model=Envelope[dict], status_code=status.HTTP_202_ACCEPTED)
async def connect_calendar(payload: dict, session: AsyncSession = Depends(get_async_session)):
    data = await meetings_service.connect_calendar(session, payload)
    return success_response("Calendar connect queued", {"job": data})
