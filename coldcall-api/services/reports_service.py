from __future__ import annotations

from datetime import date, datetime, timedelta, timezone
from typing import Any
from uuid import UUID

from sqlalchemy import case, extract, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.entities import Call, CallOutcome, CallStatus, Company, Prospect

UTC = timezone.utc

CONNECTED_STATUSES = (CallStatus.connected, CallStatus.completed)

PIPELINE_OUTCOMES = (
    CallOutcome.meeting_booked,
    CallOutcome.follow_up,
    CallOutcome.callback,
)


def _utc_day_bounds(day: date) -> tuple[datetime, datetime]:
    start = datetime.combine(day, datetime.min.time(), tzinfo=UTC)
    return start, start + timedelta(days=1)


def _connect_rate(connected: int, total: int) -> float:
    if total <= 0:
        return 0.0
    return round(100.0 * connected / total, 2)


async def _count_calls(session: AsyncSession, user_id: UUID, start: datetime, end: datetime) -> int:
    q = select(func.count()).select_from(Call).where(
        Call.agent_user_id == user_id,
        Call.created_at >= start,
        Call.created_at < end,
    )
    return int((await session.execute(q)).scalar_one() or 0)


async def _count_connected(session: AsyncSession, user_id: UUID, start: datetime, end: datetime) -> int:
    q = select(func.count()).select_from(Call).where(
        Call.agent_user_id == user_id,
        Call.created_at >= start,
        Call.created_at < end,
        Call.status.in_(CONNECTED_STATUSES),
    )
    return int((await session.execute(q)).scalar_one() or 0)


async def _count_meetings(session: AsyncSession, user_id: UUID, start: datetime, end: datetime) -> int:
    q = select(func.count()).select_from(Call).where(
        Call.agent_user_id == user_id,
        Call.created_at >= start,
        Call.created_at < end,
        Call.outcome == CallOutcome.meeting_booked,
    )
    return int((await session.execute(q)).scalar_one() or 0)


async def _count_pipeline_prospects(session: AsyncSession, user_id: UUID, start: datetime, end: datetime) -> int:
    q = (
        select(func.count(func.distinct(Call.prospect_id)))
        .select_from(Call)
        .where(
            Call.agent_user_id == user_id,
            Call.created_at >= start,
            Call.created_at < end,
            Call.outcome.in_(PIPELINE_OUTCOMES),
        )
    )
    return int((await session.execute(q)).scalar_one() or 0)


async def _avg_duration(session: AsyncSession, user_id: UUID, start: datetime, end: datetime) -> float:
    q = select(func.avg(Call.duration_seconds)).where(
        Call.agent_user_id == user_id,
        Call.created_at >= start,
        Call.created_at < end,
        Call.duration_seconds.isnot(None),
    )
    val = (await session.execute(q)).scalar_one_or_none()
    return round(float(val), 2) if val is not None else 0.0


async def reports_summary(session: AsyncSession, user_id: UUID) -> dict[str, Any]:
    today = datetime.now(UTC).date()
    t0, t1 = _utc_day_bounds(today)
    y0, y1 = _utc_day_bounds(today - timedelta(days=1))

    calls_today = await _count_calls(session, user_id, t0, t1)
    calls_prior = await _count_calls(session, user_id, y0, y1)
    conn_today = await _count_connected(session, user_id, t0, t1)
    conn_prior = await _count_connected(session, user_id, y0, y1)

    return {
        "calls_today": calls_today,
        "calls_prior": calls_prior,
        "connect_rate": _connect_rate(conn_today, calls_today),
        "connect_rate_prior": _connect_rate(conn_prior, calls_prior),
        "meetings_booked": await _count_meetings(session, user_id, t0, t1),
        "meetings_booked_prior": await _count_meetings(session, user_id, y0, y1),
        "pipeline_added": await _count_pipeline_prospects(session, user_id, t0, t1),
        "pipeline_added_prior": await _count_pipeline_prospects(session, user_id, y0, y1),
        "avg_duration": await _avg_duration(session, user_id, t0, t1),
        "avg_duration_prior": await _avg_duration(session, user_id, y0, y1),
    }


async def reports_call_performance(session: AsyncSession, user_id: UUID, days: int) -> dict[str, Any]:
    today = datetime.now(UTC).date()
    series: list[dict[str, Any]] = []
    for i in range(days - 1, -1, -1):
        d = today - timedelta(days=i)
        start, end = _utc_day_bounds(d)
        total = await _count_calls(session, user_id, start, end)
        conn = await _count_connected(session, user_id, start, end)
        series.append(
            {
                "date": d.isoformat(),
                "calls": total,
                "connect_rate": _connect_rate(conn, total),
            }
        )
    return {"days": days, "series": series}


async def reports_segments(session: AsyncSession, user_id: UUID, days: int) -> dict[str, Any]:
    start = datetime.now(UTC) - timedelta(days=days)
    label_col = func.coalesce(Company.industry, "Unknown").label("label")
    meetings_case = case((Call.outcome == CallOutcome.meeting_booked, 1), else_=0)
    stmt = (
        select(
            label_col,
            func.count(Call.id).label("calls"),
            func.sum(meetings_case).label("meetings"),
        )
        .select_from(Call)
        .join(Prospect, Prospect.id == Call.prospect_id)
        .join(Company, Company.id == Prospect.company_id)
        .where(Call.agent_user_id == user_id, Call.created_at >= start)
        .group_by(label_col)
        .order_by(func.count(Call.id).desc())
        .limit(10)
    )
    rows = (await session.execute(stmt)).all()
    segments: list[dict[str, Any]] = []
    for label, calls, meetings in rows:
        c = int(calls or 0)
        m = int(meetings or 0)
        segments.append(
            {
                "label": str(label),
                "calls": c,
                "meetings": m,
                "rate": round(100.0 * m / c, 2) if c else 0.0,
            }
        )
    return {"segments": segments}


async def reports_outcomes(session: AsyncSession, user_id: UUID, days: int) -> dict[str, Any]:
    start = datetime.now(UTC) - timedelta(days=days)
    stmt = (
        select(Call.outcome, func.count(Call.id))
        .where(
            Call.agent_user_id == user_id,
            Call.created_at >= start,
            Call.outcome.isnot(None),
        )
        .group_by(Call.outcome)
        .order_by(func.count(Call.id).desc())
    )
    rows = (await session.execute(stmt)).all()
    breakdown = [{"outcome": row[0].value if row[0] is not None else "unknown", "count": int(row[1])} for row in rows]
    return {"breakdown": breakdown}


async def reports_insight(session: AsyncSession, user_id: UUID) -> dict[str, Any]:
    start = datetime.now(UTC) - timedelta(days=30)
    total_calls_q = select(func.count()).select_from(Call).where(Call.agent_user_id == user_id, Call.created_at >= start)
    total_calls = int((await session.execute(total_calls_q)).scalar_one() or 0)
    if total_calls == 0:
        return {
            "title": "No call history in the last 30 days",
            "detail": "Once calls are logged to your account, we will surface timing and segment insights from your data.",
        }

    hour_expr = extract("hour", Call.created_at).label("hr")
    connected_case = case((Call.status.in_(CONNECTED_STATUSES), 1), else_=0)
    hour_stmt = (
        select(
            hour_expr,
            func.count(Call.id).label("total"),
            func.sum(connected_case).label("conn"),
        )
        .where(Call.agent_user_id == user_id, Call.created_at >= start)
        .group_by(hour_expr)
    )
    hour_rows = (await session.execute(hour_stmt)).all()

    best_hour: tuple[int, float, int] | None = None
    for hr, tot, conn in hour_rows:
        t = int(tot or 0)
        c = int(conn or 0) if conn is not None else 0
        if t < 3:
            continue
        rate = _connect_rate(c, t)
        if best_hour is None or rate > best_hour[1] or (rate == best_hour[1] and t > best_hour[2]):
            best_hour = (int(hr), rate, t)

    label_col = func.coalesce(Company.industry, "Unknown").label("label")
    meetings_case = case((Call.outcome == CallOutcome.meeting_booked, 1), else_=0)
    seg_stmt = (
        select(
            label_col,
            func.count(Call.id).label("calls"),
            func.sum(meetings_case).label("meetings"),
        )
        .select_from(Call)
        .join(Prospect, Prospect.id == Call.prospect_id)
        .join(Company, Company.id == Prospect.company_id)
        .where(Call.agent_user_id == user_id, Call.created_at >= start)
        .group_by(label_col)
        .having(func.count(Call.id) >= 3)
    )
    seg_rows = (await session.execute(seg_stmt)).all()
    best_seg: tuple[str, float, int] | None = None
    for label, calls, meetings in seg_rows:
        c = int(calls or 0)
        m = int(meetings or 0)
        rate = round(100.0 * m / c, 2) if c else 0.0
        if best_seg is None or rate > best_seg[1] or (rate == best_seg[1] and c > best_seg[2]):
            best_seg = (str(label), rate, c)

    if best_hour:
        h = best_hour[0]
        title = f"Your best connect window is around {h}:00 UTC"
        detail = f"{best_hour[1]}% connect rate in that hour over the last 30 days ({best_hour[2]} calls)."
        if best_seg and best_seg[1] > 0:
            detail += f" Strongest industry by meeting rate: {best_seg[0]} ({best_seg[1]}% meetings per call, {best_seg[2]} calls)."
        return {"title": title, "detail": detail}

    if best_seg:
        return {
            "title": f"{best_seg[0]} leads your meeting rate",
            "detail": f"{best_seg[1]}% of calls resulted in a booked meeting over the last 30 days ({best_seg[2]} calls).",
        }

    return {
        "title": "Keep logging outcomes",
        "detail": f"You have {total_calls} calls in the last 30 days. Add outcomes and duration to unlock sharper benchmarks.",
    }


