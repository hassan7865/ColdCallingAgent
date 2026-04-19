"""initial schema

Revision ID: 0001_initial
Revises: 
Create Date: 2026-04-10
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table("users", sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True), sa.Column("email", sa.String(255), nullable=False), sa.Column("password_hash", sa.String(255), nullable=False), sa.Column("name", sa.String(255), nullable=False), sa.Column("role", sa.Enum("admin","agent","manager", name="user_role"), nullable=False), sa.Column("calendar_connected", sa.Boolean(), nullable=False, server_default=sa.text("false")), sa.Column("calendar_token", sa.Text()), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()), sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()))
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table("companies", sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True), sa.Column("name", sa.String(255), nullable=False), sa.Column("website", sa.String(255)), sa.Column("industry", sa.String(255)), sa.Column("arr_range", sa.String(100)), sa.Column("employee_count", sa.Integer()), sa.Column("funding_stage", sa.String(100)), sa.Column("tam_estimate", sa.String(100)), sa.Column("tech_stack", sa.JSON()), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()), sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()))

    op.create_table("contacts", sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True), sa.Column("company_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("companies.id"), nullable=False), sa.Column("first_name", sa.String(100), nullable=False), sa.Column("last_name", sa.String(100), nullable=False), sa.Column("email", sa.String(255)), sa.Column("phone", sa.String(50)), sa.Column("linkedin_url", sa.String(255)), sa.Column("job_title", sa.String(255)), sa.Column("seniority", sa.Enum("c_suite","vp","director","manager","ic", name="seniority")), sa.Column("is_verified", sa.Boolean(), nullable=False, server_default=sa.text("false")), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()), sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()))

    op.create_table("campaigns", sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True), sa.Column("name", sa.String(255), nullable=False), sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False), sa.Column("target_segment", sa.Text()), sa.Column("status", sa.Enum("draft","active","paused","completed", name="campaign_status"), nullable=False), sa.Column("channels", sa.JSON()), sa.Column("total_prospects", sa.Integer(), nullable=False, server_default="0"), sa.Column("start_date", sa.DateTime(timezone=True)), sa.Column("end_date", sa.DateTime(timezone=True)), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()), sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()))

    op.create_table("prospects", sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True), sa.Column("company_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("companies.id"), nullable=False), sa.Column("contact_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("contacts.id"), nullable=False), sa.Column("icp_score", sa.Integer()), sa.Column("status", sa.Enum("new","researched","contacted","meeting_booked","nurture","disqualified", name="prospect_status"), nullable=False), sa.Column("assigned_to", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id")), sa.Column("campaign_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("campaigns.id")), sa.Column("pain_points", sa.JSON()), sa.Column("buying_signals", sa.JSON()), sa.Column("preferred_channel", sa.Enum("call","email","linkedin", name="preferred_channel")), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()), sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()))

    op.create_table("call_scripts", sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True), sa.Column("campaign_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("campaigns.id")), sa.Column("prospect_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("prospects.id")), sa.Column("is_template", sa.Boolean(), nullable=False, server_default=sa.text("false")), sa.Column("opening", sa.Text()), sa.Column("value_prop", sa.Text()), sa.Column("objection_handling", sa.JSON()), sa.Column("close", sa.Text()), sa.Column("version", sa.Integer(), nullable=False, server_default="1"), sa.Column("created_by", sa.Enum("ai","human", name="created_by"), nullable=False), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()), sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()))

    op.create_table("calls", sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True), sa.Column("prospect_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("prospects.id"), nullable=False), sa.Column("campaign_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("campaigns.id")), sa.Column("agent_user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False), sa.Column("script_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("call_scripts.id"), nullable=False), sa.Column("status", sa.Enum("initiated","connected","voicemail","no_answer","completed","failed", name="call_status"), nullable=False), sa.Column("outcome", sa.Enum("meeting_booked","follow_up","not_interested","wrong_contact","callback", name="call_outcome")), sa.Column("duration_seconds", sa.Integer()), sa.Column("recording_url", sa.String(500)), sa.Column("transcript", sa.Text()), sa.Column("ai_summary", sa.Text()), sa.Column("sentiment", sa.Enum("positive","neutral","negative", name="sentiment")), sa.Column("started_at", sa.DateTime(timezone=True)), sa.Column("ended_at", sa.DateTime(timezone=True)), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()), sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()))


    op.create_table("touchpoint_log", sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True), sa.Column("prospect_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("prospects.id"), nullable=False), sa.Column("touchpoint_type", sa.Enum("call","email","linkedin","meeting", name="touchpoint_type"), nullable=False), sa.Column("reference_id", postgresql.UUID(as_uuid=True), nullable=False), sa.Column("outcome_summary", sa.Text()), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()), sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()))

    op.create_table("async_jobs", sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True), sa.Column("job_type", sa.String(120), nullable=False), sa.Column("resource_type", sa.String(120)), sa.Column("resource_id", postgresql.UUID(as_uuid=True)), sa.Column("status", sa.Enum("queued","running","completed","failed", name="job_status"), nullable=False), sa.Column("payload", sa.JSON()), sa.Column("result", sa.JSON()), sa.Column("error_message", sa.Text()), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()), sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()))


def downgrade() -> None:
    for table in ["async_jobs","touchpoint_log","calls","call_scripts","prospects","campaigns","contacts","companies","users"]:
        op.drop_table(table)
