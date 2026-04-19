"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import { Calendar, CalendarDays, CalendarRange, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getApiErrorMessage } from "@/lib/api-error";
import api from "@/lib/api";
import { ListLoading } from "@/components/features/shared/list-loading";
import { cn } from "@/lib/utils";
import { ApiEnvelope } from "@/types/common";
import type {
  CallPerformancePoint,
  CallPerformanceResponse,
  InsightResponse,
  OutcomesResponse,
  ReportsSummaryResponse,
  SegmentsResponse,
} from "@/types/reports";

type ChartRow = CallPerformancePoint & {
  endDate: string;
  labelShort: string;
  isBucket: boolean;
};

type Range = "daily" | "weekly" | "monthly";

const RANGE_ORDER: Range[] = ["daily", "weekly", "monthly"];

const RANGE_CONFIG: Record<
  Range,
  { title: string; subtitle: string; chartDays: number; breakdownDays: number; Icon: LucideIcon }
> = {
  daily: {
    title: "Daily",
    subtitle: "Last 7 days",
    chartDays: 7,
    breakdownDays: 14,
    Icon: CalendarDays,
  },
  weekly: {
    title: "Weekly",
    subtitle: "Last 28 days",
    chartDays: 28,
    breakdownDays: 30,
    Icon: Calendar,
  },
  monthly: {
    title: "Monthly",
    subtitle: "Last 90 days",
    chartDays: 90,
    breakdownDays: 90,
    Icon: CalendarRange,
  },
};

function formatRate(value: number | undefined): string {
  if (value == null || Number.isNaN(value)) return "0%";
  const n = value > 0 && value <= 1 ? value * 100 : value;
  return `${Math.round(n)}%`;
}

function formatDuration(seconds: number | undefined): string {
  if (seconds == null || Number.isNaN(seconds) || seconds <= 0) return "0s";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function trendCount(current: number, prior: number): { text: string; icon: string; trendClass: string } {
  if (prior === 0 && current === 0) {
    return { text: "No change vs prior day", icon: "remove", trendClass: "text-on-surface-variant" };
  }
  if (prior === 0) {
    return { text: `Started from zero (${current} today)`, icon: "trending_up", trendClass: "text-primary" };
  }
  const pct = Math.round(((current - prior) / prior) * 100);
  const up = pct >= 0;
  return {
    text: `${up ? "+" : ""}${pct}% vs prior day`,
    icon: up ? "trending_up" : "trending_down",
    trendClass: up ? "text-primary" : "text-secondary",
  };
}

function trendRate(current: number, prior: number): { text: string; icon: string; trendClass: string } {
  const diff = Math.round((current ?? 0) - (prior ?? 0));
  if (diff === 0 && current === 0 && prior === 0) {
    return { text: "No connect data yet", icon: "remove", trendClass: "text-on-surface-variant" };
  }
  const up = diff >= 0;
  return {
    text: `${up ? "+" : ""}${diff} pts vs prior day`,
    icon: up ? "trending_up" : "trending_down",
    trendClass: up ? "text-primary" : "text-secondary",
  };
}

function trendDuration(current: number, prior: number): { text: string; icon: string; trendClass: string } {
  if (prior === 0 && current === 0) {
    return { text: "Log call durations to see trends", icon: "schedule", trendClass: "text-on-surface-variant" };
  }
  if (prior === 0) {
    return { text: `${Math.round(current)}s avg today`, icon: "timer", trendClass: "text-on-surface-variant" };
  }
  const diff = Math.round(current - prior);
  return {
    text: `${diff >= 0 ? "+" : ""}${diff}s vs prior day`,
    icon: diff >= 0 ? "trending_up" : "trending_down",
    trendClass: "text-on-surface-variant",
  };
}

function shortDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso.slice(5);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function chunkSeries<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

/** Short label for a UTC date range (same series order as API: oldest → newest). */
function formatBucketLabel(startIso: string, endIso: string): string {
  const a = new Date(`${startIso}T12:00:00Z`);
  const b = new Date(`${endIso}T12:00:00Z`);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return shortDate(startIso);
  const sameMonth = a.getUTCMonth() === b.getUTCMonth() && a.getUTCFullYear() === b.getUTCFullYear();
  if (sameMonth) {
    const m = a.toLocaleDateString(undefined, { month: "short" });
    return `${m} ${a.getUTCDate()}–${b.getUTCDate()}`;
  }
  return `${shortDate(startIso)} – ${shortDate(endIso)}`;
}

function aggregateWeekBucket(chunk: CallPerformancePoint[]): ChartRow {
  const start = chunk[0].date;
  const end = chunk[chunk.length - 1].date;
  const totalCalls = chunk.reduce((s, p) => s + p.calls, 0);
  let connected = 0;
  for (const p of chunk) {
    connected += (p.calls * (p.connect_rate ?? 0)) / 100;
  }
  const connect_rate = totalCalls > 0 ? Math.round(((100 * connected) / totalCalls) * 10) / 10 : 0;
  return {
    date: start,
    endDate: end,
    calls: totalCalls,
    connect_rate,
    labelShort: formatBucketLabel(start, end),
    isBucket: true,
  };
}

/** Daily: one bar per day. Weekly/monthly: one bar per 7-day bucket (weighted connect rate). */
function buildChartRows(series: CallPerformancePoint[], range: Range): ChartRow[] {
  if (!series.length) return [];
  if (range === "daily") {
    return series.map((p) => ({
      ...p,
      endDate: p.date,
      labelShort: shortDate(p.date),
      isBucket: false,
    }));
  }
  return chunkSeries(series, 7).map(aggregateWeekBucket);
}

function humanizeOutcome(outcome: string): string {
  return outcome
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

async function fetchReportsBundle(chartDays: number, breakdownDays: number) {
  const [s, p, seg, out, ins] = await Promise.all([
    api.get<ApiEnvelope<ReportsSummaryResponse>>("/reports/summary"),
    api.get<ApiEnvelope<CallPerformanceResponse>>(`/reports/call-performance?days=${chartDays}`),
    api.get<ApiEnvelope<SegmentsResponse>>(`/reports/segments?days=${breakdownDays}`),
    api.get<ApiEnvelope<OutcomesResponse>>(`/reports/outcomes?days=${breakdownDays}`),
    api.get<ApiEnvelope<InsightResponse>>("/reports/insight"),
  ]);
  return {
    summary: s.data.data,
    performance: p.data.data,
    segments: seg.data.data,
    outcomes: out.data.data,
    insight: ins.data.data,
  };
}

export function ReportsDashboard() {
  const [range, setRange] = useState<Range>("daily");
  const { chartDays, breakdownDays } = RANGE_CONFIG[range];

  const query = useQuery({
    queryKey: ["reports", "bundle", chartDays, breakdownDays],
    queryFn: () => fetchReportsBundle(chartDays, breakdownDays),
  });

  const summary = query.data?.summary;
  const performance = query.data?.performance;
  const segments = query.data?.segments?.segments ?? [];
  const breakdown = query.data?.outcomes?.breakdown ?? [];
  const insight = query.data?.insight;

  const callsToday = String(summary?.calls_today ?? 0);
  const connectRate = formatRate(summary?.connect_rate);
  const meetingsBooked = String(summary?.meetings_booked ?? 0);
  const pipelineAdded = String(summary?.pipeline_added ?? 0);
  const avgDuration = formatDuration(summary?.avg_duration);

  const trends = useMemo(() => {
    if (!summary) {
      return {
        calls: { text: "…", icon: "remove", trendClass: "text-on-surface-variant" },
        connect: { text: "…", icon: "remove", trendClass: "text-on-surface-variant" },
        meetings: { text: "…", icon: "remove", trendClass: "text-on-surface-variant" },
        pipeline: { text: "…", icon: "remove", trendClass: "text-on-surface-variant" },
        duration: { text: "…", icon: "remove", trendClass: "text-on-surface-variant" },
      };
    }
    return {
      calls: trendCount(summary.calls_today, summary.calls_prior),
      connect: trendRate(summary.connect_rate, summary.connect_rate_prior),
      meetings: trendCount(summary.meetings_booked, summary.meetings_booked_prior),
      pipeline: trendCount(summary.pipeline_added, summary.pipeline_added_prior),
      duration: trendDuration(summary.avg_duration, summary.avg_duration_prior),
    };
  }, [summary]);

  const chartRows = useMemo(
    () => buildChartRows(performance?.series ?? [], range),
    [performance?.series, range],
  );

  const maxCalls = useMemo(() => Math.max(1, ...chartRows.map((x) => x.calls)), [chartRows]);

  /** Many narrow columns need horizontal scroll on small viewports. */
  const chartScrollX = chartRows.length > 8;

  const maxOutcome = useMemo(() => Math.max(1, ...breakdown.map((o) => o.count)), [breakdown]);

  if (query.isLoading) {
    return <ListLoading rows={6} />;
  }

  if (query.isError) {
    return (
      <Card className="rounded-2xl border-0 bg-surface-container p-8">
        <p className="text-sm text-on-surface-variant">
          {getApiErrorMessage(query.error, "Could not load reports. Check that you are signed in and the API is running.")}
        </p>
      </Card>
    );
  }

  return (
    <div className="mx-auto grid h-full min-h-0 min-w-0 w-full max-w-[1600px] grid-rows-[auto_minmax(0,1fr)] gap-6 sm:gap-8">
      <div className="min-w-0">
        <div className="relative overflow-hidden rounded-2xl border-0 bg-surface-container-low/40 p-5 shadow-xl shadow-black/15 sm:p-7">
          <div className="pointer-events-none absolute -left-16 top-0 h-56 w-56 rounded-full bg-primary/10 blur-[90px]" />
          <div className="pointer-events-none absolute -right-16 bottom-0 h-52 w-52 rounded-full bg-secondary/10 blur-[90px]" />
          <header className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="border-primary/35 bg-primary/10 text-[10px] uppercase tracking-widest text-primary">
                  Reporting Console
                </Badge>
                <span className="text-[10px] font-medium uppercase tracking-widest text-on-surface-variant">Performance</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl">Revenue analytics in one cockpit</h1>
              <p className="max-w-2xl text-sm leading-relaxed text-on-surface-variant sm:text-base">
                All metrics below are computed from your call records (scoped to your account). Summary compares today to yesterday UTC. The
                call volume chart uses the time range you pick in the chart card.
              </p>
            </div>
            <div className="flex w-full shrink-0 justify-end sm:w-auto">
              <Button
                type="button"
                variant="secondary"
                disabled
                title="Export is not available yet"
                className="w-full gap-2 rounded-xl border border-outline-variant/25 bg-surface-container-high sm:w-auto"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span className="text-xs font-bold uppercase tracking-widest">Export PDF</span>
              </Button>
            </div>
          </header>
        </div>
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col border-t border-outline-variant/15 pt-5 text-on-surface sm:pt-6">
        <div
          className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain pb-1 [scrollbar-gutter:stable]"
          role="region"
          aria-label="Reports metrics and charts"
        >
      <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-2 lg:gap-4">
        <MetricCard
          title="Calls today"
          value={callsToday}
          icon="call"
          trend={trends.calls.text}
          trendClass={trends.calls.trendClass}
          trendIcon={trends.calls.icon}
          className="lg:col-span-4 lg:row-span-2"
          featured
        />
        <MetricCard
          title="Connect rate"
          value={connectRate}
          icon="contact_phone"
          trend={trends.connect.text}
          trendClass={trends.connect.trendClass}
          trendIcon={trends.connect.icon}
          className="lg:col-span-4 lg:row-start-1"
        />
        <MetricCard
          title="Meetings booked"
          value={meetingsBooked}
          icon="event_available"
          trend={trends.meetings.text}
          trendClass={trends.meetings.trendClass}
          trendIcon={trends.meetings.icon}
          className="lg:col-span-4 lg:row-start-1"
        />
        <MetricCard
          title="Pipeline touches"
          value={pipelineAdded}
          icon="payments"
          trend={trends.pipeline.text}
          trendClass={trends.pipeline.trendClass}
          trendIcon={trends.pipeline.icon}
          className="lg:col-span-2 lg:row-start-2"
        />
        <MetricCard
          title="Avg call duration"
          value={avgDuration}
          icon="timer"
          trend={trends.duration.text}
          trendClass={trends.duration.trendClass}
          trendIcon={trends.duration.icon}
          className="lg:col-span-2 lg:row-start-2"
        />
      </section>

      <Card className="rounded-2xl border-0 bg-surface-container py-5 sm:py-6">
        <CardContent className="space-y-6 px-5 pt-0 sm:px-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">Call volume</h2>
                {query.isFetching ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                    <Loader2 className="size-3 animate-spin" aria-hidden />
                    Updating
                  </span>
                ) : null}
              </div>
              <p className="text-sm text-on-surface-variant">
                {range === "daily" ? (
                  <>
                    One bar per <span className="font-medium text-on-surface">UTC day</span>. Bar height = calls; the strip = connect rate.
                  </>
                ) : (
                  <>
                    One bar per <span className="font-medium text-on-surface">7-day bucket</span> (summed calls, volume-weighted connect rate) so
                    longer ranges stay readable.
                  </>
                )}{" "}
                Hover a bar for exact numbers.
              </p>
              <p className="text-xs text-on-surface-variant/80">
                Underlying window: <span className="font-semibold text-on-surface">{performance?.days ?? chartDays} UTC days</span> ·{" "}
                {RANGE_CONFIG[range].subtitle}
                {chartRows.length > 0 ? (
                  <>
                    {" "}
                    · <span className="font-semibold text-on-surface">{chartRows.length}</span> bar{chartRows.length === 1 ? "" : "s"}
                  </>
                ) : null}
              </p>
            </div>

            <div
              className="w-full shrink-0 lg:max-w-md"
              role="tablist"
              aria-label="Chart time range"
            >
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">Chart range</p>
              <div className="grid grid-cols-3 gap-1.5 rounded-2xl border-0 bg-surface-container-low/90 p-1.5 shadow-inner">
                {RANGE_ORDER.map((key) => {
                  const cfg = RANGE_CONFIG[key];
                  const Icon = cfg.Icon;
                  const active = range === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-controls="call-volume-chart"
                      id={`range-tab-${key}`}
                      onClick={() => setRange(key)}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/50 sm:py-3",
                        active
                          ? "bg-surface-container-highest text-on-surface shadow-md"
                          : "text-on-surface-variant hover:bg-surface-container-high/70 hover:text-on-surface",
                      )}
                    >
                      <Icon className={cn("size-4 sm:size-[1.125rem]", active ? "text-primary" : "opacity-70")} strokeWidth={active ? 2.25 : 1.75} aria-hidden />
                      <span className="text-[11px] font-bold leading-none sm:text-xs">{cfg.title}</span>
                      <span className={cn("text-[9px] leading-tight sm:text-[10px]", active ? "text-on-surface-variant" : "text-on-surface-variant/70")}>
                        {cfg.chartDays}d
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-outline-variant/10 pb-4 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant sm:text-xs">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-gradient-to-t from-primary/50 to-primary shadow-sm shadow-primary/20" />
              Calls (bar height)
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-8 overflow-hidden rounded-full bg-surface-container-low ring-0">
                <span className="block h-full w-2/3 rounded-full bg-secondary" />
              </span>
              Connect rate (strip fill)
            </div>
            {range !== "daily" ? (
              <div className="flex items-center gap-2 text-primary/90">
                <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[9px] font-black text-primary">7d</span>
                Each bar = one week of data
              </div>
            ) : null}
          </div>

          {performance?.series?.length ? (
            <TooltipProvider delayDuration={200}>
              <div id="call-volume-chart" className={cn("relative space-y-5", query.isFetching && "opacity-[0.72] transition-opacity")}>
                <div
                  className={cn(
                    chartScrollX && "overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:thin]",
                  )}
                >
                  <div
                    className={cn(
                      "grid min-h-[200px] items-end gap-2 pt-4 sm:min-h-[220px] sm:gap-3",
                      chartScrollX && "min-w-[520px] sm:min-w-0",
                    )}
                    style={{ gridTemplateColumns: `repeat(${chartRows.length}, minmax(0, 1fr))` }}
                  >
                  {chartRows.map((point) => {
                    const barH = Math.max(6, (point.calls / maxCalls) * 100);
                    const rateW = Math.min(100, Math.max(0, point.connect_rate));
                    const rowKey = point.isBucket ? `${point.date}_${point.endDate}` : point.date;
                    return (
                      <Tooltip key={rowKey}>
                        <TooltipTrigger asChild>
                          <div className="flex min-w-0 cursor-pointer flex-col items-center gap-1.5">
                            <div className="flex h-[168px] w-full flex-col justify-end sm:h-[192px]">
                              <div
                                className="w-full rounded-t-md bg-gradient-to-t from-primary/35 via-primary/80 to-primary shadow-sm shadow-primary/10 transition-[height] duration-300 ease-out"
                                style={{ height: `${barH}%` }}
                              />
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-low ring-0">
                              <div
                                className="h-full rounded-full bg-secondary transition-[width] duration-300"
                                style={{ width: `${rateW}%` }}
                              />
                            </div>
                            <span
                              className="line-clamp-2 min-h-[2.25rem] w-full px-0.5 text-center text-[9px] font-medium leading-tight text-on-surface-variant sm:min-h-0 sm:text-[10px]"
                              title={point.isBucket ? `${point.date} → ${point.endDate}` : point.date}
                            >
                              {point.labelShort}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-[260px] border-0 bg-surface-container-highest text-xs">
                          {point.isBucket ? (
                            <>
                              <p className="font-semibold text-on-surface">
                                {point.date} → {point.endDate} (UTC)
                              </p>
                              <p className="mt-1 text-on-surface-variant">7-day bucket · summed totals</p>
                            </>
                          ) : (
                            <p className="font-semibold text-on-surface">{point.date} (UTC)</p>
                          )}
                          <p className="mt-1 text-on-surface-variant">
                            <span className="font-mono text-on-surface">{point.calls}</span> calls ·{" "}
                            <span className="font-mono text-on-surface">{point.connect_rate}%</span> connect rate
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                  </div>
                </div>
                <div className="overflow-x-auto rounded-xl border-0">
                  <table className="w-full min-w-[480px] text-left text-xs">
                    <TableHeader className="border-b-0 bg-surface-container-low/80 text-on-surface-variant">
                      <TableRow className="border-b-0">
                        <TableHead className="h-auto px-3 py-2 font-semibold">{range === "daily" ? "Date (UTC)" : "Period (UTC)"}</TableHead>
                        <TableHead className="h-auto px-3 py-2 font-semibold">Calls</TableHead>
                        <TableHead className="h-auto px-3 py-2 font-semibold">Connect rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {chartRows.map((point) => {
                        const rowKey = point.isBucket ? `${point.date}_${point.endDate}` : point.date;
                        return (
                          <TableRow key={rowKey} className="border-b border-outline-variant/10 last:border-0 hover:bg-transparent">
                            <TableCell className="px-3 py-2 text-on-surface">
                              {point.isBucket ? (
                                <span className="text-[11px] leading-snug">
                                  {point.date}
                                  <span className="text-on-surface-variant"> → </span>
                                  {point.endDate}
                                </span>
                              ) : (
                                point.date
                              )}
                            </TableCell>
                            <TableCell className="px-3 py-2 font-mono text-on-surface">{point.calls}</TableCell>
                            <TableCell className="px-3 py-2 font-mono text-on-surface">{point.connect_rate}%</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </table>
                </div>
              </div>
            </TooltipProvider>
          ) : (
            <div className="flex h-[200px] items-center justify-center rounded-xl border-0 bg-surface-container-low/70">
              <p className="px-4 text-center text-sm text-on-surface-variant">No calls in this range yet.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border-0 bg-surface-container py-5 lg:col-span-2">
          <CardContent className="space-y-5 px-5 pt-0 sm:px-6">
            <h3 className="text-lg font-bold tracking-tight">Segments by company industry</h3>
            {segments.length ? (
              <div className="overflow-x-auto rounded-xl border-0">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <TableHeader className="border-b-0 bg-surface-container-low/80 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    <TableRow className="border-b-0">
                      <TableHead className="h-auto px-3 py-2">Industry</TableHead>
                      <TableHead className="h-auto px-3 py-2">Calls</TableHead>
                      <TableHead className="h-auto px-3 py-2">Meetings</TableHead>
                      <TableHead className="h-auto px-3 py-2">Meeting rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {segments.map((row) => (
                      <TableRow key={row.label} className="border-b border-outline-variant/10 last:border-0 hover:bg-transparent">
                        <TableCell className="px-3 py-2.5 font-medium text-on-surface">{row.label}</TableCell>
                        <TableCell className="px-3 py-2.5 font-mono text-on-surface">{row.calls}</TableCell>
                        <TableCell className="px-3 py-2.5 font-mono text-on-surface">{row.meetings}</TableCell>
                        <TableCell className="px-3 py-2.5 font-mono text-on-surface">{row.rate}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </table>
              </div>
            ) : (
              <div className="rounded-xl border-0 bg-surface-container-low p-5">
                <p className="text-sm text-on-surface-variant">No calls with linked company industry in this period.</p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 bg-surface-container py-5">
          <CardContent className="space-y-5 px-5 pt-0 sm:px-6">
            <h3 className="text-lg font-bold tracking-tight">Call outcome mix</h3>
            {breakdown.length ? (
              <ul className="space-y-3">
                {breakdown.map((row) => (
                  <li key={row.outcome}>
                    <div className="mb-1 flex justify-between gap-2 text-xs">
                      <span className="font-medium text-on-surface">{humanizeOutcome(row.outcome)}</span>
                      <span className="font-mono text-on-surface-variant">{row.count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-surface-container-low">
                      <div
                        className="h-full rounded-full bg-secondary"
                        style={{ width: `${(row.count / maxOutcome) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-xl border-0 bg-surface-container-low p-5">
                <p className="text-sm text-on-surface-variant">No outcomes recorded in this period.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-0 bg-surface-container py-0">
        <CardContent className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-start gap-3">
            <div className="kinetic-gradient mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-on-primary">
              <span className="material-symbols-outlined text-base">lightbulb</span>
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface">{insight?.title ?? "Insight"}</p>
              <p className="text-xs text-on-surface-variant">{insight?.detail ?? ""}</p>
            </div>
          </div>
          <Button
            type="button"
            disabled
            title="Automations coming later"
            className="w-full rounded-lg bg-primary px-5 text-xs font-black uppercase tracking-widest text-on-primary sm:w-auto"
          >
            Apply optimization
          </Button>
        </CardContent>
      </Card>
      </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
  trend,
  trendClass,
  trendIcon,
  className,
  featured,
}: {
  title: string;
  value: string;
  icon: string;
  trend: string;
  trendClass: string;
  trendIcon: string;
  className?: string;
  featured?: boolean;
}) {
  return (
    <Card
      className={`group relative overflow-hidden rounded-2xl border-0 bg-surface-container p-4 transition-all hover:shadow-lg hover:shadow-primary/5 sm:p-5 ${className ?? ""}`}
    >
      <div className="absolute -right-6 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
      <div className="absolute right-3 top-3 opacity-15 transition-opacity group-hover:opacity-30">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <p className="mb-2 text-[0.68rem] font-bold uppercase tracking-[0.08em] text-on-surface-variant">{title}</p>
      <p className={`font-mono font-extrabold tracking-tight text-on-surface ${featured ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl"}`}>{value}</p>
      <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${trendClass}`}>
        <span className="material-symbols-outlined text-sm">{trendIcon}</span>
        <span>{trend}</span>
      </div>
    </Card>
  );
}
