import enum
import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import JSON, Boolean, DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base, BaseModelMixin


class UserRole(str, enum.Enum):
    admin = "admin"
    agent = "agent"
    manager = "manager"


class ProspectStatus(str, enum.Enum):
    new = "new"
    researched = "researched"
    contacted = "contacted"
    meeting_booked = "meeting_booked"
    nurture = "nurture"
    disqualified = "disqualified"


class PreferredChannel(str, enum.Enum):
    call = "call"
    email = "email"
    linkedin = "linkedin"


class Seniority(str, enum.Enum):
    c_suite = "c_suite"
    vp = "vp"
    director = "director"
    manager = "manager"
    ic = "ic"


class CampaignStatus(str, enum.Enum):
    draft = "draft"
    active = "active"
    paused = "paused"
    completed = "completed"


class CreatedBy(str, enum.Enum):
    ai = "ai"
    human = "human"


class CallStatus(str, enum.Enum):
    initiated = "initiated"
    connected = "connected"
    voicemail = "voicemail"
    no_answer = "no_answer"
    completed = "completed"
    failed = "failed"


class CallOutcome(str, enum.Enum):
    meeting_booked = "meeting_booked"
    follow_up = "follow_up"
    not_interested = "not_interested"
    wrong_contact = "wrong_contact"
    callback = "callback"


class Sentiment(str, enum.Enum):
    positive = "positive"
    neutral = "neutral"
    negative = "negative"


class EmailStatus(str, enum.Enum):
    draft = "draft"
    sent = "sent"
    opened = "opened"
    clicked = "clicked"
    replied = "replied"
    bounced = "bounced"


class MessageType(str, enum.Enum):
    connection_request = "connection_request"
    warm_message = "warm_message"
    follow_up = "follow_up"


class LinkedinStatus(str, enum.Enum):
    sent = "sent"
    accepted = "accepted"
    replied = "replied"


class SequenceType(str, enum.Enum):
    short_term = "short_term"
    nurture = "nurture"
    re_engagement = "re_engagement"


class MeetingStatus(str, enum.Enum):
    scheduled = "scheduled"
    confirmed = "confirmed"
    completed = "completed"
    cancelled = "cancelled"
    no_show = "no_show"


class CrmType(str, enum.Enum):
    hubspot = "hubspot"
    salesforce = "salesforce"
    pipedrive = "pipedrive"


class TouchpointType(str, enum.Enum):
    call = "call"
    email = "email"
    linkedin = "linkedin"
    meeting = "meeting"


class TriggerType(str, enum.Enum):
    website_visit = "website_visit"
    linkedin_activity = "linkedin_activity"
    funding_round = "funding_round"
    job_post = "job_post"


class JobStatus(str, enum.Enum):
    queued = "queued"
    running = "running"
    completed = "completed"
    failed = "failed"


class User(Base, BaseModelMixin):
    __tablename__ = "users"
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole, name="user_role"), nullable=False, default=UserRole.agent)
    calendar_connected: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    calendar_token: Mapped[str | None] = mapped_column(Text)


class Company(Base, BaseModelMixin):
    __tablename__ = "companies"
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    website: Mapped[str | None] = mapped_column(String(255))
    industry: Mapped[str | None] = mapped_column(String(255))
    arr_range: Mapped[str | None] = mapped_column(String(100))
    employee_count: Mapped[int | None] = mapped_column(Integer)
    funding_stage: Mapped[str | None] = mapped_column(String(100))
    tam_estimate: Mapped[str | None] = mapped_column(String(100))
    tech_stack: Mapped[dict[str, Any] | None] = mapped_column(JSON)

    contacts: Mapped[list["Contact"]] = relationship(back_populates="company", lazy="selectin")
    prospects: Mapped[list["Prospect"]] = relationship(back_populates="company", lazy="selectin")


class Contact(Base, BaseModelMixin):
    __tablename__ = "contacts"
    company_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("companies.id"), nullable=False)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str | None] = mapped_column(String(255))
    phone: Mapped[str | None] = mapped_column(String(50))
    linkedin_url: Mapped[str | None] = mapped_column(String(255))
    job_title: Mapped[str | None] = mapped_column(String(255))
    seniority: Mapped[Seniority | None] = mapped_column(Enum(Seniority, name="seniority"))
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    company: Mapped["Company"] = relationship(back_populates="contacts", lazy="selectin")
    prospects: Mapped[list["Prospect"]] = relationship(back_populates="contact", lazy="selectin")


class Campaign(Base, BaseModelMixin):
    __tablename__ = "campaigns"
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    target_segment: Mapped[str | None] = mapped_column(Text)
    status: Mapped[CampaignStatus] = mapped_column(Enum(CampaignStatus, name="campaign_status"), default=CampaignStatus.draft)
    channels: Mapped[list[str] | None] = mapped_column(JSON)
    total_prospects: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    start_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    end_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    prospects: Mapped[list["Prospect"]] = relationship(back_populates="campaign", lazy="selectin")


class Prospect(Base, BaseModelMixin):
    __tablename__ = "prospects"
    company_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("companies.id"), nullable=False)
    contact_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("contacts.id"), nullable=False)
    icp_score: Mapped[int | None] = mapped_column(Integer)
    status: Mapped[ProspectStatus] = mapped_column(Enum(ProspectStatus, name="prospect_status"), default=ProspectStatus.new)
    assigned_to: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id"))
    campaign_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("campaigns.id"))
    pain_points: Mapped[dict[str, Any] | None] = mapped_column(JSON)
    buying_signals: Mapped[dict[str, Any] | None] = mapped_column(JSON)
    preferred_channel: Mapped[PreferredChannel | None] = mapped_column(Enum(PreferredChannel, name="preferred_channel"))

    company: Mapped["Company"] = relationship(back_populates="prospects", lazy="selectin")
    contact: Mapped["Contact"] = relationship(back_populates="prospects", lazy="selectin")
    campaign: Mapped["Campaign | None"] = relationship(back_populates="prospects", lazy="selectin")


class CallScript(Base, BaseModelMixin):
    __tablename__ = "call_scripts"
    campaign_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("campaigns.id"))
    prospect_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("prospects.id"))
    is_template: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    opening: Mapped[str | None] = mapped_column(Text)
    value_prop: Mapped[str | None] = mapped_column(Text)
    objection_handling: Mapped[dict[str, Any] | None] = mapped_column(JSON)
    close: Mapped[str | None] = mapped_column(Text)
    version: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    created_by: Mapped[CreatedBy] = mapped_column(Enum(CreatedBy, name="created_by"), default=CreatedBy.human)


class Call(Base, BaseModelMixin):
    __tablename__ = "calls"
    prospect_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("prospects.id"), nullable=False)
    campaign_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("campaigns.id"))
    agent_user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    script_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("call_scripts.id"), nullable=False)
    status: Mapped[CallStatus] = mapped_column(Enum(CallStatus, name="call_status"), default=CallStatus.initiated)
    outcome: Mapped[CallOutcome | None] = mapped_column(Enum(CallOutcome, name="call_outcome"))
    duration_seconds: Mapped[int | None] = mapped_column(Integer)
    recording_url: Mapped[str | None] = mapped_column(String(500))
    transcript: Mapped[str | None] = mapped_column(Text)
    ai_summary: Mapped[str | None] = mapped_column(Text)
    sentiment: Mapped[Sentiment | None] = mapped_column(Enum(Sentiment, name="sentiment"))
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    ended_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class CallObjection(Base, BaseModelMixin):
    __tablename__ = "call_objections"
    call_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("calls.id"), nullable=False)
    objection_type: Mapped[str] = mapped_column(String(255), nullable=False)
    response_used: Mapped[str | None] = mapped_column(Text)
    was_successful: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)


class Email(Base, BaseModelMixin):
    __tablename__ = "emails"
    prospect_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("prospects.id"), nullable=False)
    campaign_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("campaigns.id"))
    sequence_step: Mapped[int | None] = mapped_column(Integer)
    subject: Mapped[str | None] = mapped_column(String(255))
    body: Mapped[str | None] = mapped_column(Text)
    status: Mapped[EmailStatus] = mapped_column(Enum(EmailStatus, name="email_status"), default=EmailStatus.draft)
    opened_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    clicked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    replied_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class LinkedinMessage(Base, BaseModelMixin):
    __tablename__ = "linkedin_messages"
    prospect_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("prospects.id"), nullable=False)
    campaign_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("campaigns.id"))
    message_type: Mapped[MessageType] = mapped_column(Enum(MessageType, name="message_type"), nullable=False)
    content: Mapped[str | None] = mapped_column(Text)
    status: Mapped[LinkedinStatus] = mapped_column(Enum(LinkedinStatus, name="linkedin_status"), default=LinkedinStatus.sent)
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    replied_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class FollowUpSequence(Base, BaseModelMixin):
    __tablename__ = "follow_up_sequences"
    prospect_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("prospects.id"), nullable=False)
    campaign_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("campaigns.id"))
    sequence_type: Mapped[SequenceType] = mapped_column(Enum(SequenceType, name="sequence_type"), nullable=False)
    current_step: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    total_steps: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    next_touchpoint_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class Meeting(Base, BaseModelMixin):
    __tablename__ = "meetings"
    prospect_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("prospects.id"), nullable=False)
    call_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("calls.id"))
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    title: Mapped[str | None] = mapped_column(String(255))
    scheduled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    duration_minutes: Mapped[int | None] = mapped_column(Integer)
    calendar_event_id: Mapped[str | None] = mapped_column(String(255))
    meet_link: Mapped[str | None] = mapped_column(String(500))
    status: Mapped[MeetingStatus] = mapped_column(Enum(MeetingStatus, name="meeting_status"), default=MeetingStatus.scheduled)


class CrmConnection(Base, BaseModelMixin):
    __tablename__ = "crm_connections"
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    crm_type: Mapped[CrmType] = mapped_column(Enum(CrmType, name="crm_type"), nullable=False)
    access_token: Mapped[str | None] = mapped_column(Text)
    refresh_token: Mapped[str | None] = mapped_column(Text)
    last_synced_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class TouchpointLog(Base, BaseModelMixin):
    __tablename__ = "touchpoint_log"
    prospect_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("prospects.id"), nullable=False)
    touchpoint_type: Mapped[TouchpointType] = mapped_column(Enum(TouchpointType, name="touchpoint_type"), nullable=False)
    reference_id: Mapped[uuid.UUID] = mapped_column()
    outcome_summary: Mapped[str | None] = mapped_column(Text)


class ReEngagementTrigger(Base, BaseModelMixin):
    __tablename__ = "re_engagement_triggers"
    prospect_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("prospects.id"), nullable=False)
    trigger_type: Mapped[TriggerType] = mapped_column(Enum(TriggerType, name="trigger_type"), nullable=False)
    detected_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    action_taken: Mapped[str | None] = mapped_column(Text)
    was_actioned: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)


class AsyncJob(Base, BaseModelMixin):
    __tablename__ = "async_jobs"
    job_type: Mapped[str] = mapped_column(String(120), nullable=False)
    resource_type: Mapped[str | None] = mapped_column(String(120))
    resource_id: Mapped[uuid.UUID | None] = mapped_column()
    status: Mapped[JobStatus] = mapped_column(Enum(JobStatus, name="job_status"), default=JobStatus.queued, nullable=False)
    payload: Mapped[dict[str, Any] | None] = mapped_column(JSON)
    result: Mapped[dict[str, Any] | None] = mapped_column(JSON)
    error_message: Mapped[str | None] = mapped_column(Text)

