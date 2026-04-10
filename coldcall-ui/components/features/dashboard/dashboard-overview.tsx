"use client";

import type { LucideIcon } from "lucide-react";
import { CalendarCheck, PhoneCall, Percent, Timer, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReportsSummaryResponse } from "@/types/reports";

function formatConnectRate(value: number | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  const n = value <= 1 && value > 0 ? value * 100 : value;
  return `${Math.round(n)}%`;
}

function formatDuration(seconds: number | undefined): string {
  if (seconds == null || Number.isNaN(seconds) || seconds <= 0) return "—";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function StatCard({
  title,
  value,
  hint,
  icon: Icon,
  accent,
  featured,
  className,
}: {
  title: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  accent: "primary" | "secondary" | "tertiary" | "muted";
  featured?: boolean;
  className?: string;
}) {
  const accentRing = {
    primary: "from-primary/25 via-primary/5 to-transparent",
    secondary: "from-secondary/30 via-secondary/10 to-transparent",
    tertiary: "from-tertiary/25 via-tertiary/5 to-transparent",
    muted: "from-on-surface-variant/20 via-on-surface-variant/5 to-transparent",
  }[accent];

  const iconBg = {
    primary: "bg-primary/15 text-primary ring-primary/25",
    secondary: "bg-secondary/15 text-secondary ring-secondary/25",
    tertiary: "bg-tertiary/15 text-tertiary ring-tertiary/25",
    muted: "bg-surface-container-high text-on-surface-variant ring-outline-variant/30",
  }[accent];

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border-0 bg-surface-container py-4 transition-all",
        "hover:shadow-lg hover:shadow-primary/[0.03]",
        className,
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r to-transparent opacity-80",
          accentRing,
        )}
      />
      <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-2xl transition-opacity group-hover:opacity-100" />
      <div className="relative flex flex-1 flex-col px-4 sm:px-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant sm:text-xs">{title}</p>
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-xl ring-1 transition-transform group-hover:scale-105 sm:size-10",
              iconBg,
            )}
          >
            <Icon className="size-4 sm:size-[1.125rem]" aria-hidden />
          </span>
        </div>
        <p
          className={cn(
            "mt-3 font-mono font-extrabold tabular-nums tracking-tight text-on-surface sm:mt-4",
            featured ? "text-3xl sm:text-4xl lg:text-5xl lg:leading-none" : "text-2xl sm:text-3xl lg:text-4xl",
          )}
        >
          {value}
        </p>
        {hint ? <p className="mt-1 text-xs text-on-surface-variant">{hint}</p> : null}
      </div>
    </div>
  );
}

export function DashboardOverview({ summary }: { summary: ReportsSummaryResponse | null }) {
  const s = summary ?? undefined;

  return (
    <div>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-on-surface-variant sm:mb-4">Today at a glance</h2>
      <div className="grid auto-rows-min gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-12 lg:grid-rows-2 lg:gap-5">
        <StatCard
          title="Calls today"
          value={String(s?.calls_today ?? 0)}
          hint="Outbound attempts logged for today"
          icon={PhoneCall}
          accent="primary"
          featured
          className="md:col-span-2 lg:col-span-6 lg:row-span-2 lg:min-h-[220px] lg:py-6"
        />
        <StatCard
          title="Connect rate"
          value={formatConnectRate(s?.connect_rate)}
          hint="Reached a live contact"
          icon={Percent}
          accent="secondary"
          className="md:col-span-2 lg:col-span-6 lg:col-start-7 lg:row-start-1"
        />
        <StatCard
          title="Meetings booked"
          value={String(s?.meetings_booked ?? 0)}
          hint="From completed calls"
          icon={CalendarCheck}
          accent="tertiary"
          className="md:col-span-1 lg:col-span-2 lg:col-start-7 lg:row-start-2"
        />
        <StatCard
          title="Pipeline added"
          value={String(s?.pipeline_added ?? 0)}
          hint="New opportunities"
          icon={TrendingUp}
          accent="primary"
          className="md:col-span-1 lg:col-span-2 lg:col-start-9 lg:row-start-2"
        />
        <StatCard
          title="Avg. duration"
          value={formatDuration(s?.avg_duration)}
          hint="Connected calls only"
          icon={Timer}
          accent="muted"
          className="md:col-span-2 lg:col-span-2 lg:col-start-11 lg:row-start-2"
        />
      </div>
    </div>
  );
}
