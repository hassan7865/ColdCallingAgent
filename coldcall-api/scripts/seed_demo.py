#!/usr/bin/env python3
"""
Seed a demo user and realistic sample data (campaigns, prospects, calls, etc.).

Run from this package root so `.env` is picked up:

  cd coldcall-api && uv run python scripts/seed_demo.py

Options:
  --force   Remove existing demo-owned rows (campaigns/prospects/calls/…) then re-seed.

Default credentials printed at the end:
  Email: demo@example.com
  Password: DemoPass123!

(Uses example.com so pydantic EmailStr / email-validator accept the address.)
"""

from __future__ import annotations

import argparse
import asyncio
import os
import random
import sys
from datetime import UTC, datetime, timedelta
from pathlib import Path
from uuid import UUID

# Package root (parent of scripts/) — sys.path + cwd for pydantic-settings `.env`
_API_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_API_ROOT))
os.chdir(_API_ROOT)

from sqlalchemy import delete, func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from dependencies.database import AsyncSessionLocal
from models.entities import (
    Call,
    CallObjection,
    CallOutcome,
    CallScript,
    CallStatus,
    Campaign,
    CampaignStatus,
    Company,
    Contact,
    CreatedBy,
    Email,
    EmailStatus,
    FollowUpSequence,
    LinkedinMessage,
    Meeting,
    MeetingStatus,
    PreferredChannel,
    Prospect,
    ProspectStatus,
    ReEngagementTrigger,
    Seniority,
    Sentiment,
    TouchpointLog,
    User,
    UserRole,
)
from services.auth_service import hash_password

DEMO_EMAIL = "demo@example.com"
DEMO_PASSWORD = "DemoPass123!"
DEMO_NAME = "Demo Agent"

COMPANY_FIXTURES: list[dict] = [
    {
        "name": "Northwind Analytics",
        "website": "https://northwind.example.com",
        "industry": "FinTech",
        "arr_range": "$5M–$15M",
        "employee_count": 85,
        "funding_stage": "Series B",
        "tech_stack": {"cloud": "AWS", "data": "Snowflake"},
    },
    {
        "name": "Helix Bio Labs",
        "website": "https://helixbio.example.com",
        "industry": "HealthTech",
        "arr_range": "$1M–$5M",
        "employee_count": 42,
        "funding_stage": "Series A",
        "tech_stack": {"compliance": "HIPAA", "crm": "HubSpot"},
    },
    {
        "name": "Vertex Robotics",
        "website": "https://vertexrobotics.example.com",
        "industry": "Manufacturing",
        "arr_range": "$15M+",
        "employee_count": 210,
        "funding_stage": "Series C",
        "tech_stack": {"erp": "NetSuite", "iot": "MQTT"},
    },
    {
        "name": "Lumen Education",
        "website": "https://lumen.edu.example",
        "industry": "EdTech",
        "arr_range": "$1M–$5M",
        "employee_count": 55,
        "funding_stage": "Seed",
        "tech_stack": {"lms": "Canvas", "analytics": "Mixpanel"},
    },
    {
        "name": "Cedar Retail Group",
        "website": "https://cedarretail.example.com",
        "industry": "Retail",
        "arr_range": "$5M–$15M",
        "employee_count": 120,
        "funding_stage": "Growth",
        "tech_stack": {"pos": "Shopify Plus", "cdp": "Segment"},
    },
    {
        "name": "Atlas Security",
        "website": "https://atlassec.example.com",
        "industry": "Cybersecurity",
        "arr_range": "$5M–$15M",
        "employee_count": 95,
        "funding_stage": "Series B",
        "tech_stack": {"siem": "Splunk", "sso": "Okta"},
    },
    {
        "name": "Maritime Logistics Co",
        "website": "https://maritime-log.example.com",
        "industry": "Logistics",
        "arr_range": "$15M+",
        "employee_count": 340,
        "funding_stage": "PE-backed",
        "tech_stack": {"tms": "MercuryGate", "edi": True},
    },
    {
        "name": "Pulse Media Network",
        "website": "https://pulsemedia.example.com",
        "industry": "Media",
        "arr_range": "$1M–$5M",
        "employee_count": 38,
        "funding_stage": "Series A",
        "tech_stack": {"ads": "Google Ad Manager", "cms": "Contentful"},
    },
    {"name": "Kite AI Systems", "website": "https://kiteai.example.com", "industry": "AI/ML", "arr_range": "$5M–$15M", "employee_count": 72, "funding_stage": "Series B", "tech_stack": {"gpu": "CoreWeave", "vector": "Pinecone"}},
    {"name": "Silverline HR", "website": "https://silverlinehr.example.com", "industry": "HRTech", "arr_range": "$1M–$5M", "employee_count": 48, "funding_stage": "Series A", "tech_stack": {"ats": "Greenhouse", "hris": "Rippling"}},
    {"name": "Copperfield Energy", "website": "https://copperfield.example.com", "industry": "Energy", "arr_range": "$15M+", "employee_count": 260, "funding_stage": "Growth", "tech_stack": {"scada": "Ignition", "gis": "ArcGIS"}},
    {"name": "Brightway Insurance Tech", "website": "https://brightway.example.com", "industry": "Insurance", "arr_range": "$5M–$15M", "employee_count": 110, "funding_stage": "Series B", "tech_stack": {"core": "Guidewire", "chat": "Intercom"}},
    {"name": "Oxide Games Studio", "website": "https://oxidegames.example.com", "industry": "Gaming", "arr_range": "$1M–$5M", "employee_count": 65, "funding_stage": "Series A", "tech_stack": {"engine": "Unreal", "analytics": "Amplitude"}},
    {"name": "Harbor Legal Cloud", "website": "https://harborlegal.example.com", "industry": "LegalTech", "arr_range": "$5M–$15M", "employee_count": 88, "funding_stage": "Series B", "tech_stack": {"clm": "Ironclad", "esign": "DocuSign"}},
    {"name": "Summit Travel OS", "website": "https://summittravel.example.com", "industry": "Travel", "arr_range": "$1M–$5M", "employee_count": 52, "funding_stage": "Seed", "tech_stack": {"booking": "Amadeus", "pay": "Stripe"}},
    {"name": "Grain Foods Co-op", "website": "https://grainfoods.example.com", "industry": "Food & Bev", "arr_range": "$15M+", "employee_count": 400, "funding_stage": "Established", "tech_stack": {"erp": "SAP", "wms": "Manhattan"}},
    {"name": "Nimbus Cloud Cost", "website": "https://nimbusfinops.example.com", "industry": "FinOps", "arr_range": "$1M–$5M", "employee_count": 35, "funding_stage": "Seed", "tech_stack": {"billing": "Metronome", "obs": "Datadog"}},
    {"name": "Redwood Construction", "website": "https://redwoodbuild.example.com", "industry": "Construction", "arr_range": "$5M–$15M", "employee_count": 155, "funding_stage": "PE-backed", "tech_stack": {"bim": "Autodesk", "procore": True}},
    {"name": "SignalZero Threat Intel", "website": "https://signalzero.example.com", "industry": "Cybersecurity", "arr_range": "$5M–$15M", "employee_count": 78, "funding_stage": "Series A", "tech_stack": {"intel": "Recorded Future", "soar": "Tines"}},
    {"name": "Bluefin Payments", "website": "https://bluefinpay.example.com", "industry": "FinTech", "arr_range": "$1M–$5M", "employee_count": 62, "funding_stage": "Series A", "tech_stack": {"pci": True}},
    {"name": "TerraCarbon Solutions", "website": "https://terracarbon.example.com", "industry": "Climate", "arr_range": "$5M–$15M", "employee_count": 44, "funding_stage": "Series B", "tech_stack": {"esg": True}},
    {"name": "Nova Dental AI", "website": "https://novadental.example.com", "industry": "HealthTech", "arr_range": "$1M–$5M", "employee_count": 29, "funding_stage": "Seed", "tech_stack": {"ehr": "Epic"}},
    {"name": "IronGate Defense", "website": "https://irongate.example.com", "industry": "GovTech", "arr_range": "$15M+", "employee_count": 180, "funding_stage": "Series C", "tech_stack": {"fedramp": True}},
    {"name": "Velvet Commerce", "website": "https://velvetcom.example.com", "industry": "E-commerce", "arr_range": "$5M–$15M", "employee_count": 91, "funding_stage": "Series B", "tech_stack": {"shop": "Shopify"}},
    {"name": "Quartz Data Co", "website": "https://quartzdata.example.com", "industry": "Data", "arr_range": "$1M–$5M", "employee_count": 33, "funding_stage": "Seed", "tech_stack": {"warehouse": "BigQuery"}},
    {"name": "Mosaic Creative", "website": "https://mosaiccreative.example.com", "industry": "Agency", "arr_range": "$1M–$5M", "employee_count": 47, "funding_stage": "Bootstrapped", "tech_stack": {"design": "Figma"}},
    {"name": "Beacon IoT", "website": "https://beaconiot.example.com", "industry": "IoT", "arr_range": "$5M–$15M", "employee_count": 67, "funding_stage": "Series A", "tech_stack": {"mqtt": True}},
    {"name": "Catalyst Pharma", "website": "https://catalystpharma.example.com", "industry": "Pharma", "arr_range": "$15M+", "employee_count": 220, "funding_stage": "IPO prep", "tech_stack": {"gmp": True}},
    {"name": "Fjord Nordic SaaS", "website": "https://fjordsaas.example.com", "industry": "SaaS", "arr_range": "$5M–$15M", "employee_count": 54, "funding_stage": "Series B", "tech_stack": {"region": "EU"}},
    {"name": "Pioneer AgTech", "website": "https://pioneerag.example.com", "industry": "AgTech", "arr_range": "$1M–$5M", "employee_count": 41, "funding_stage": "Series A", "tech_stack": {"sensors": True}},
    {"name": "Urban Mobility Labs", "website": "https://urbanmob.example.com", "industry": "Mobility", "arr_range": "$5M–$15M", "employee_count": 76, "funding_stage": "Series B", "tech_stack": {"maps": "Mapbox"}},
    {"name": "Sterling Wealth OS", "website": "https://sterlingwealth.example.com", "industry": "WealthTech", "arr_range": "$15M+", "employee_count": 130, "funding_stage": "Growth", "tech_stack": {"custody": True}},
    {"name": "Echo Customer Voice", "website": "https://echovoice.example.com", "industry": "CX", "arr_range": "$1M–$5M", "employee_count": 36, "funding_stage": "Seed", "tech_stack": {"voc": "Qualtrics"}},
]

CONTACT_NAMES = [
    ("Jordan", "Lee", "VP Sales", Seniority.vp),
    ("Sam", "Rivera", "Director of RevOps", Seniority.director),
    ("Alex", "Chen", "Head of Growth", Seniority.director),
    ("Taylor", "Morgan", "CEO", Seniority.c_suite),
    ("Riley", "Patel", "Sales Manager", Seniority.manager),
    ("Casey", "Nguyen", "SDR Lead", Seniority.manager),
    ("Morgan", "Diaz", "Chief Revenue Officer", Seniority.c_suite),
    ("Jamie", "Okonkwo", "Account Executive", Seniority.ic),
]


async def _get_demo_user(session: AsyncSession) -> User | None:
    r = await session.execute(select(User).where(func.lower(User.email) == DEMO_EMAIL.lower()))
    return r.scalar_one_or_none()


async def _ensure_demo_email(session: AsyncSession, user: User) -> User:
    if user.email.lower() != DEMO_EMAIL.lower():
        await session.execute(update(User).where(User.id == user.id).values(email=DEMO_EMAIL))
        await session.commit()
        await session.refresh(user)
        print("Updated demo user email to:", DEMO_EMAIL)
    return user


async def _wipe_demo_user_data(session: AsyncSession, user_id: UUID) -> None:
    r = await session.execute(select(Campaign.id).where(Campaign.user_id == user_id))
    camp_ids = [row[0] for row in r.all()]

    prospect_ids: list[UUID] = []
    contact_ids: list[UUID] = []
    company_ids: list[UUID] = []
    if camp_ids:
        pr = await session.execute(
            select(Prospect.id, Prospect.contact_id, Prospect.company_id).where(Prospect.campaign_id.in_(camp_ids))
        )
        for pid, cid, coy in pr.all():
            prospect_ids.append(pid)
            contact_ids.append(cid)
            company_ids.append(coy)

    call_ids_r = await session.execute(select(Call.id).where(Call.agent_user_id == user_id))
    call_ids = [row[0] for row in call_ids_r.all()]

    if call_ids:
        await session.execute(delete(CallObjection).where(CallObjection.call_id.in_(call_ids)))
        await session.execute(delete(Meeting).where(Meeting.call_id.in_(call_ids)))
        await session.execute(delete(Call).where(Call.id.in_(call_ids)))

    if prospect_ids:
        await session.execute(delete(Email).where(Email.prospect_id.in_(prospect_ids)))
        await session.execute(delete(LinkedinMessage).where(LinkedinMessage.prospect_id.in_(prospect_ids)))
        await session.execute(delete(FollowUpSequence).where(FollowUpSequence.prospect_id.in_(prospect_ids)))
        await session.execute(delete(TouchpointLog).where(TouchpointLog.prospect_id.in_(prospect_ids)))
        await session.execute(delete(ReEngagementTrigger).where(ReEngagementTrigger.prospect_id.in_(prospect_ids)))
        await session.execute(delete(Meeting).where(Meeting.prospect_id.in_(prospect_ids)))
        await session.execute(delete(Prospect).where(Prospect.id.in_(prospect_ids)))

    if camp_ids:
        await session.execute(delete(CallScript).where(CallScript.campaign_id.in_(camp_ids)))
        await session.execute(delete(Campaign).where(Campaign.id.in_(camp_ids)))

    contact_ids = list(dict.fromkeys(contact_ids))
    company_ids = list(dict.fromkeys(company_ids))
    if contact_ids:
        await session.execute(delete(Contact).where(Contact.id.in_(contact_ids)))
    if company_ids:
        await session.execute(delete(Company).where(Company.id.in_(company_ids)))

    await session.commit()


async def _already_seeded(session: AsyncSession, user_id: UUID) -> bool:
    q = select(func.count()).select_from(Campaign).where(Campaign.user_id == user_id)
    n = int((await session.execute(q)).scalar_one() or 0)
    return n > 0


async def seed(session: AsyncSession, *, force: bool) -> User:
    user = await _get_demo_user(session)
    if user is None:
        user = User(
            email=DEMO_EMAIL,
            password_hash=hash_password(DEMO_PASSWORD),
            name=DEMO_NAME,
            role=UserRole.agent,
            calendar_connected=False,
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)
        print("Created demo user:", DEMO_EMAIL)
    else:
        print("Demo user already exists:", user.email)
        user = await _ensure_demo_email(session, user)

    if force:
        await _wipe_demo_user_data(session, user.id)
        print("Removed previous demo-owned campaigns, prospects, and calls.")
    elif await _already_seeded(session, user.id):
        print("Demo data already present. Use --force to re-seed.")
        return user

    now = datetime.now(UTC)
    companies: list[Company] = []
    for spec in COMPANY_FIXTURES:
        c = Company(**spec)
        session.add(c)
        companies.append(c)
    await session.flush()

    contacts: list[Contact] = []
    for pass_idx in range(2):
        for i, co in enumerate(companies):
            ni = (i + pass_idx * 5) % len(CONTACT_NAMES)
            fn, ln, title, sen = CONTACT_NAMES[ni]
            domain = co.website.replace("https://", "").split("/")[0]
            suffix = "" if pass_idx == 0 else "+alt"
            ct = Contact(
                company_id=co.id,
                first_name=fn,
                last_name=ln,
                email=f"{fn.lower()}.{ln.lower()}{suffix}@{domain}",
                phone=f"+1-415-555-{2000 + i + pass_idx * 100:04d}",
                job_title=title,
                seniority=sen,
                is_verified=True,
            )
            session.add(ct)
            contacts.append(ct)
    await session.flush()

    campaigns_data: list[tuple[str, CampaignStatus, list[str], str]] = [
        (
            "Q2 outbound — enterprise",
            CampaignStatus.active,
            ["call", "email", "linkedin"],
            "VP+ in Series B+ SaaS, US timezone",
        ),
        (
            "Product launch nurture",
            CampaignStatus.paused,
            ["email", "linkedin"],
            "Warm leads from webinar, follow-up sequence",
        ),
        (
            "SMB velocity test",
            CampaignStatus.draft,
            ["call"],
            "Managers and directors, <200 employees",
        ),
    ]

    campaigns: list[Campaign] = []
    for name, st, channels, segment in campaigns_data:
        camp = Campaign(
            name=name,
            user_id=user.id,
            target_segment=segment,
            status=st,
            channels=channels,
            total_prospects=0,
            start_date=now - timedelta(days=21),
            end_date=now + timedelta(days=60) if st != CampaignStatus.draft else None,
        )
        session.add(camp)
        campaigns.append(camp)
    await session.flush()

    scripts_by_campaign: dict[UUID, CallScript] = {}
    for camp in campaigns:
        scr = CallScript(
            campaign_id=camp.id,
            prospect_id=None,
            is_template=True,
            opening="Hi {{first_name}}, this is {{agent}} from ColdCallAgent — quick question about your outbound motion.",
            value_prop="We help teams book more qualified meetings without adding headcount.",
            objection_handling={"timing": "Totally fair — most teams pilot in two weeks."},
            close="Worth a 12-minute walkthrough this week?",
            version=1,
            created_by=CreatedBy.human,
        )
        session.add(scr)
        scripts_by_campaign[camp.id] = scr
    await session.flush()

    statuses_cycle = [
        ProspectStatus.new,
        ProspectStatus.researched,
        ProspectStatus.contacted,
        ProspectStatus.meeting_booked,
        ProspectStatus.nurture,
    ]
    channels_cycle = [PreferredChannel.call, PreferredChannel.email, PreferredChannel.linkedin]

    prospects: list[Prospect] = []
    for i, ct in enumerate(contacts):
        co = next(c for c in companies if c.id == ct.company_id)
        camp = campaigns[i % len(campaigns)]
        icp = 55 + (i * 7) % 45
        pros = Prospect(
            company_id=co.id,
            contact_id=ct.id,
            icp_score=icp,
            status=statuses_cycle[i % len(statuses_cycle)],
            assigned_to=user.id,
            campaign_id=camp.id,
            pain_points={"items": ["Manual CRM hygiene", "Low connect rates on cold lists"]},
            buying_signals={"signals": ["Hiring SDRs", "New VP Sales"]},
            preferred_channel=channels_cycle[i % len(channels_cycle)],
        )
        session.add(pros)
        prospects.append(pros)
    await session.flush()

    for camp in campaigns:
        n = sum(1 for p in prospects if p.campaign_id == camp.id)
        camp.total_prospects = n

    rng = random.Random(42)
    outcomes_weighted: list[CallOutcome | None] = (
        [CallOutcome.meeting_booked] * 3
        + [CallOutcome.follow_up] * 5
        + [CallOutcome.callback] * 2
        + [CallOutcome.not_interested] * 3
        + [None] * 2
    )
    status_weighted: list[CallStatus] = (
        [CallStatus.completed] * 5
        + [CallStatus.connected] * 3
        + [CallStatus.voicemail] * 2
        + [CallStatus.no_answer] * 2
        + [CallStatus.failed] * 1
    )

    calls_to_add: list[Call] = []
    for day_offset in range(28, -1, -1):
        day_start = (now - timedelta(days=day_offset)).replace(hour=0, minute=0, second=0, microsecond=0)
        per_day = 5 if day_offset <= 1 else rng.randint(2, 5)
        for h in range(per_day):
            p = rng.choice(prospects)
            script = scripts_by_campaign[p.campaign_id]
            hour = 9 + (h * 3 + rng.randint(0, 2)) % 8
            created = day_start + timedelta(hours=hour, minutes=rng.randint(0, 55))
            st = rng.choice(status_weighted)
            oc = rng.choice(outcomes_weighted) if st in (CallStatus.completed, CallStatus.connected) else None
            if st in (CallStatus.voicemail, CallStatus.no_answer, CallStatus.failed):
                oc = None
            duration = rng.randint(45, 480) if st in (CallStatus.completed, CallStatus.connected) else None
            sentiment = (
                rng.choice([Sentiment.positive, Sentiment.neutral, Sentiment.negative])
                if oc == CallOutcome.meeting_booked
                else (Sentiment.neutral if rng.random() > 0.3 else Sentiment.positive)
            )
            call = Call(
                prospect_id=p.id,
                campaign_id=p.campaign_id,
                agent_user_id=user.id,
                script_id=script.id,
                status=st,
                outcome=oc,
                duration_seconds=duration,
                transcript="[demo] Short call transcript placeholder.",
                ai_summary="[demo] Summary: discussed timing and next steps." if oc else None,
                sentiment=sentiment if st in (CallStatus.completed, CallStatus.connected) else None,
                started_at=created,
                ended_at=created + timedelta(seconds=duration or 60),
                created_at=created,
                updated_at=created,
            )
            calls_to_add.append(call)

    for c in calls_to_add:
        session.add(c)
    await session.flush()

    for call in calls_to_add:
        if call.outcome == CallOutcome.not_interested and rng.random() > 0.5:
            session.add(
                CallObjection(
                    call_id=call.id,
                    objection_type="budget",
                    response_used="Offered a lighter pilot tier.",
                    was_successful=False,
                )
            )

    booked = [p for p in prospects if p.status == ProspectStatus.meeting_booked]
    for i, p in enumerate(booked[:3]):
        related = next((c for c in calls_to_add if c.prospect_id == p.id and c.outcome == CallOutcome.meeting_booked), None)
        session.add(
            Email(
                prospect_id=p.id,
                campaign_id=p.campaign_id,
                sequence_step=1,
                subject="Demo follow-up: next steps",
                body="Thanks for the conversation — here’s the calendar link.",
                status=EmailStatus.sent,
                sent_at=now - timedelta(days=2 - i),
            )
        )
        session.add(
            Meeting(
                prospect_id=p.id,
                call_id=related.id if related else None,
                user_id=user.id,
                title="Discovery call",
                scheduled_at=now + timedelta(days=3 + i),
                duration_minutes=30,
                meet_link="https://meet.example.com/demo-room",
                status=MeetingStatus.scheduled,
            )
        )

    await session.commit()
    print(f"Seeded {len(companies)} companies, {len(prospects)} prospects, {len(calls_to_add)} calls.")
    return user


async def main_async(force: bool) -> None:
    async with AsyncSessionLocal() as session:
        await seed(session, force=force)


def main() -> None:
    parser = argparse.ArgumentParser(description="Seed demo user and ColdCallAgent sample data.")
    parser.add_argument("--force", action="store_true", help="Delete demo-owned data then re-seed.")
    args = parser.parse_args()
    asyncio.run(main_async(args.force))
    print()
    print("Sign in with:")
    print(f"  Email:    {DEMO_EMAIL}")
    print(f"  Password: {DEMO_PASSWORD}")
    print()


if __name__ == "__main__":
    main()
