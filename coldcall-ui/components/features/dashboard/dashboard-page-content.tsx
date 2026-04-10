"use client";

import { DashboardOverview } from "@/components/features/dashboard/dashboard-overview";
import { ListLoading } from "@/components/features/shared/list-loading";
import { Badge } from "@/components/ui/badge";
import { useAuthContext } from "@/context/AuthContext";
import { useGetReportsSummary } from "@/hooks/use-reports";
export function DashboardPageContent() {
  const { isLoading: authLoading, isAuthenticated } = useAuthContext();
  const summaryQuery = useGetReportsSummary();

  if (authLoading) {
    return (
      <section className="space-y-8 sm:space-y-10">
        <div className="rounded-2xl border-0 bg-surface-container-low/60 p-6 sm:p-8">
          <ListLoading rows={4} />
        </div>
      </section>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (summaryQuery.isLoading) {
    return (
      <section className="space-y-8 sm:space-y-10">
        <div className="rounded-2xl border-0 bg-surface-container-low/60 p-6 sm:p-8">
          <ListLoading rows={4} />
        </div>
      </section>
    );
  }

  return (
    <div className="mx-auto grid h-full min-h-0 min-w-0 w-full max-w-[1600px] grid-rows-[auto_minmax(0,1fr)] gap-6 sm:gap-8">
      <div className="min-w-0">
        <div className="relative overflow-hidden rounded-2xl border-0 bg-surface-container-low/40 p-5 shadow-xl shadow-black/15 sm:p-7">
          <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/15 blur-[100px]" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-secondary/10 blur-[90px]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-px w-[120%] -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-60" />
          <header className="relative space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="rounded-full border-primary/35 bg-primary/10 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-primary"
              >
                Live summary
              </Badge>
              <span className="text-[10px] font-medium uppercase tracking-widest text-on-surface-variant">Dashboard</span>
            </div>
            <h1 className="max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-on-surface sm:text-4xl lg:text-[2.5rem] lg:leading-[1.1]">
              Your pipeline pulse, <span className="text-primary">in one view</span>
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-on-surface-variant sm:text-base">
              Track today&apos;s volume, connection quality, and outcomes at a glance.
            </p>
          </header>
        </div>
      </div>
      <div className="min-h-0 min-w-0">
        <div className="flex h-full min-h-0 min-w-0 flex-col">
          <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border-0 bg-surface-container-low/40 text-on-surface shadow-xl shadow-black/15">
            <div className="box-border min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain p-[10px] [scrollbar-gutter:stable]">
              <DashboardOverview summary={summaryQuery.data ?? null} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
