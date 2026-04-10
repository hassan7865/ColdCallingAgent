"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles, Users } from "lucide-react";
import { ListLoading } from "@/components/features/shared/list-loading";
import { useAuthContext } from "@/context/AuthContext";
import { useGetProspects } from "@/hooks/use-prospects";
import { ProspectResponse } from "@/types/prospects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

function shortId(id: string) {
  return id.length > 14 ? `${id.slice(0, 8)}…` : id;
}

function statusBadgeClass(status: string | undefined) {
  const s = (status ?? "").toLowerCase();
  if (s.includes("meeting")) return "border-primary/35 bg-primary/10 text-primary";
  if (s.includes("contact")) return "border-secondary/35 bg-secondary/10 text-secondary";
  if (s.includes("new")) return "border-outline-variant/40 bg-surface-container-high text-on-surface-variant";
  if (s.includes("nurture")) return "border-tertiary/35 bg-tertiary/10 text-tertiary";
  return "border-outline-variant/30 bg-surface-container-low text-on-surface-variant";
}

export function ProspectsTable({ initialItems = [] }: { initialItems?: ProspectResponse[] }) {
  const { isLoading: authLoading, isAuthenticated } = useAuthContext();
  const query = useGetProspects({ skip: 0, limit: 100 });
  const list = query.data?.data?.items ?? initialItems;
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(() => {
    if (!list.length) return undefined;
    if (selectedId) {
      const found = list.find((p) => p.id === selectedId);
      if (found) return found;
    }
    return list[0];
  }, [list, selectedId]);

  useEffect(() => {
    if (selectedId && !list.some((p) => p.id === selectedId) && list[0]?.id) {
      setSelectedId(list[0].id);
    }
  }, [list, selectedId]);

  const stats = useMemo(() => {
    const total = list.length;
    const highIcp = list.filter((p) => Number(p.icp_score ?? 0) >= 80).length;
    const newish = list.filter((p) => (p.status ?? "").toLowerCase() === "new").length;
    return { total, highIcp, newish };
  }, [list]);

  if (authLoading) return <ListLoading rows={8} />;

  if (!isAuthenticated) return null;

  if (query.isLoading) return <ListLoading rows={8} />;

  return (
    <div className="mx-auto grid h-full min-h-0 min-w-0 w-full max-w-[1600px] grid-rows-[auto_minmax(0,1fr)] gap-6 sm:gap-8">
      <div className="min-w-0">
        <div className="relative overflow-hidden rounded-2xl border-0 bg-surface-container-low/40 p-5 shadow-xl shadow-black/15 sm:p-7">
          <div className="pointer-events-none absolute -left-16 top-0 h-52 w-52 rounded-full bg-primary/10 blur-[90px]" />
          <div className="pointer-events-none absolute -right-12 bottom-0 h-44 w-44 rounded-full bg-secondary/10 blur-[80px]" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="border-primary/35 bg-primary/10 text-[10px] uppercase tracking-widest text-primary">
                  Pipeline
                </Badge>
                <span className="text-[10px] font-medium uppercase tracking-widest text-on-surface-variant">Prospects</span>
              </div>
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-on-surface sm:text-4xl">
                Every lead, <span className="text-primary">one workspace</span>
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-on-surface-variant sm:text-base">
                Search and scan your list, open a row for full context, then jump into call or email from the action bar.
              </p>
            </div>
            <div className="grid w-full max-w-md grid-cols-3 gap-2 sm:gap-3 lg:max-w-lg lg:shrink-0">
              {[
                { label: "In view", value: stats.total, icon: Users },
                { label: "ICP 80+", value: stats.highIcp, icon: Sparkles },
                { label: "New", value: stats.newish, icon: Users },
              ].map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-xl border-0 bg-surface-container/80 px-3 py-3 text-center ring-0 sm:px-4 sm:py-3.5"
                >
                  <Icon className="mx-auto mb-1 size-4 text-primary opacity-80" aria-hidden />
                  <div className="text-xl font-extrabold tabular-nums text-on-surface sm:text-2xl">{value}</div>
                  <div className="text-[9px] font-semibold uppercase tracking-wider text-on-surface-variant sm:text-[10px]">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="min-h-0 min-w-0">
        <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
          <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border-0 bg-surface-container-low/40 text-on-surface shadow-xl shadow-black/15 md:flex-row">
        <aside className="flex max-h-[42vh] min-h-0 w-full shrink-0 flex-col bg-surface-container-low/90 backdrop-blur-sm md:max-h-full md:h-full md:w-[min(100%,400px)] md:max-w-[400px] md:shrink-0">
          <div className="shrink-0 space-y-3 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Directory</h2>
              <span className="text-[10px] font-medium text-on-surface-variant/80">{list.length} loaded</span>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-on-surface-variant">
                search
              </span>
              <Input
                className="rounded-xl border border-outline-variant/20 bg-surface-container-highest py-2.5 pl-10 text-sm text-on-surface placeholder:text-on-surface-variant/50"
                placeholder="Search prospects…"
                readOnly
                title="Search coming soon"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                disabled
                className="flex-1 gap-2 rounded-xl border border-outline-variant/20 bg-surface-container-high py-2 text-xs font-semibold"
              >
                <span className="material-symbols-outlined text-sm">filter_list</span>
                Filters
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled
                className="flex-1 gap-2 rounded-xl border border-outline-variant/20 bg-surface-container-high py-2 text-xs font-semibold"
              >
                <span className="material-symbols-outlined text-sm">sort</span>
                Score
              </Button>
            </div>
          </div>

          <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
            {list.length === 0 ? (
              <div className="p-6 text-center text-sm text-on-surface-variant">No prospects from the API yet.</div>
            ) : null}
            {list.map((item, idx) => {
              const active = item.id === selected?.id;
              return (
                <div key={item.id ?? String(idx)}>
                  <button
                    type="button"
                    onClick={() => item.id && setSelectedId(item.id)}
                    className={cn(
                      "group relative w-full cursor-pointer text-left transition-colors",
                      active
                        ? "border-l-[3px] border-primary bg-surface-container-high/90"
                        : "border-l-[3px] border-transparent hover:bg-surface-container-high/50",
                    )}
                  >
                    <div className="flex gap-3 p-4">
                      <div
                        className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 transition-colors",
                          active ? "bg-primary/15 ring-primary/25" : "bg-surface-container-highest ring-outline-variant/15 group-hover:ring-primary/20",
                        )}
                      >
                        <span className="material-symbols-outlined text-lg text-primary/90">person</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="truncate font-semibold text-on-surface">{shortId(item.id)}</h3>
                          <Badge
                            variant="outline"
                            className={cn(
                              "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums",
                              Number(item.icp_score ?? 0) >= 80 ? "border-primary/30 bg-primary/10 text-primary" : "",
                            )}
                          >
                            {item.icp_score ?? "—"} ICP
                          </Badge>
                        </div>
                        <p className="mt-0.5 truncate text-sm capitalize text-on-surface-variant">{item.status ?? "Unknown status"}</p>
                        <p className="mt-0.5 truncate text-xs text-on-surface-variant/70">{item.preferred_channel ?? "No preferred channel"}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {[item.assigned_to, item.campaign_id].filter(Boolean).map((tag) => (
                            <Badge
                              key={String(tag)}
                              variant="outline"
                              className="rounded-md border-outline-variant/25 px-1.5 py-0 text-[9px] font-normal text-on-surface-variant"
                            >
                              {String(tag).slice(0, 10)}
                              {String(tag).length > 10 ? "…" : ""}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                  {idx < list.length - 1 ? <Separator className="bg-outline-variant/10" /> : null}
                </div>
              );
            })}
          </div>
        </aside>

        <section className="custom-scrollbar relative flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overscroll-y-contain bg-surface">
          {!selected ? (
            <div className="flex flex-1 items-center justify-center p-8 text-sm text-on-surface-variant">Select a prospect from the list.</div>
          ) : (
            <>
              <div className="p-4 pb-6 sm:p-6 md:p-8 md:pb-10">
                <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/25 sm:h-[4.5rem] sm:w-[4.5rem]">
                      <span className="material-symbols-outlined text-3xl text-primary">domain</span>
                    </div>
                    <div className="min-w-0">
                      <p className="mb-1 font-mono text-xs text-on-surface-variant">{selected.id}</p>
                      <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">Prospect profile</h2>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className={cn("rounded-full px-3 py-1 text-xs font-semibold", statusBadgeClass(selected.status))}>
                          {selected.status ?? "Unknown"}
                        </Badge>
                        <Badge variant="outline" className="rounded-full border-outline-variant/30 px-3 py-1 text-xs font-semibold text-on-surface-variant">
                          {selected.preferred_channel ?? "No channel"}
                        </Badge>
                        <Badge variant="outline" className="rounded-full border-primary/25 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                          ICP {selected.icp_score ?? "—"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2 self-start sm:self-auto">
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      disabled
                      title="Coming soon"
                      className="h-10 w-10 rounded-xl border border-outline-variant/20 bg-surface-container"
                    >
                      <span className="material-symbols-outlined text-on-surface-variant">star</span>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon"
                          className="h-10 w-10 rounded-xl border border-outline-variant/20 bg-surface-container"
                          aria-label="More actions"
                        >
                          <span className="material-symbols-outlined">more_horiz</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="border-outline-variant/20 bg-surface-container-highest">
                        <DropdownMenuItem disabled>Pin prospect</DropdownMenuItem>
                        <DropdownMenuItem disabled>Open in CRM</DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" disabled>
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                  <MetricTile label="Short ID" value={shortId(selected.id)} accent />
                  <MetricTile label="Created" value={selected.created_at ? new Date(selected.created_at).toLocaleDateString() : "—"} />
                  <MetricTile label="Updated" value={selected.updated_at ? new Date(selected.updated_at).toLocaleDateString() : "—"} />
                </div>

                <Card className="mb-8 gap-0 overflow-hidden rounded-2xl border-0 bg-surface-container py-0 ring-0">
                  <CardHeader className="flex flex-col gap-4 bg-surface-container-low/50 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-lg font-extrabold text-primary ring-1 ring-primary/25">
                      {shortId(selected.id).slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-on-surface sm:text-xl">Record details</CardTitle>
                      <CardDescription className="text-on-surface-variant">Fields from your API</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-2 sm:gap-5 sm:px-6 sm:py-6">
                    <Detail icon="tag" text={`Status: ${selected.status ?? "—"}`} />
                    <Detail icon="link" text={`Campaign: ${selected.campaign_id ?? "—"}`} />
                    <Detail icon="person" text={`Assigned: ${selected.assigned_to ?? "—"}`} />
                    <Detail icon="route" text={`Channel: ${selected.preferred_channel ?? "—"}`} />
                  </CardContent>
                </Card>

                <div className="mb-28 space-y-3 pb-4 sm:mb-32 md:pb-8">
                  <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="flex items-center gap-2 text-base font-bold text-on-surface sm:text-lg">
                      <span className="material-symbols-outlined text-primary">auto_awesome</span>
                      Enrichment & signals
                    </h3>
                    <span className="text-[10px] text-on-surface-variant sm:text-xs">
                      {selected.updated_at ? `Updated ${new Date(selected.updated_at).toLocaleString()}` : "No update timestamp"}
                    </span>
                  </div>

                  <div className="overflow-hidden rounded-2xl border-0 bg-surface-container-low">
                    <div className="flex items-center justify-between bg-surface-container-high/50 px-4 py-3 sm:px-5">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-on-surface-variant">psychology</span>
                        <span className="text-sm font-bold text-on-surface">Pain points</span>
                      </div>
                      <Badge className="rounded-md bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">API</Badge>
                    </div>
                    <div className="border-l-2 border-primary/60 bg-surface-container/50 p-4 text-sm leading-relaxed text-on-surface-variant sm:ml-4 sm:p-5">
                      {selected.pain_points ? (
                        <pre className="whitespace-pre-wrap break-all font-mono text-xs text-on-surface/90">
                          {JSON.stringify(selected.pain_points, null, 2)}
                        </pre>
                      ) : (
                        <span className="italic">No pain points data.</span>
                      )}
                    </div>
                  </div>

                  {["Buying signals", "Status", "Preferred channel"].map((row) => (
                    <div key={row} className="rounded-2xl border-0 bg-surface-container-low">
                      <div className="flex items-center justify-between px-4 py-3 sm:px-5">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm text-on-surface-variant">chevron_right</span>
                          <span className="text-sm font-bold text-on-surface">{row}</span>
                        </div>
                        <span className="max-w-[55%] truncate text-right text-xs text-on-surface-variant">
                          {row === "Buying signals"
                            ? selected.buying_signals
                              ? "JSON available"
                              : "—"
                            : row === "Status"
                              ? selected.status ?? "—"
                              : selected.preferred_channel ?? "—"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel fixed inset-x-0 bottom-0 z-40 flex min-h-[4.5rem] flex-col gap-3 border-t border-outline-variant/15 bg-surface-container-low/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md supports-[backdrop-filter]:bg-surface-container-low/85 sm:flex-row sm:items-center sm:justify-between sm:px-6 md:left-[min(100%,400px)] md:px-8">
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <Button
                    type="button"
                    disabled
                    className="gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-on-primary shadow-lg shadow-primary/15 sm:px-6 sm:py-3"
                  >
                    <span className="material-symbols-outlined text-lg">call</span>
                    Start call
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    disabled
                    className="gap-2 rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-2.5 text-sm font-semibold sm:px-5 sm:py-3"
                  >
                    <span className="material-symbols-outlined">send</span>
                    Email
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    disabled
                    className="hidden gap-2 rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-2.5 text-sm font-semibold sm:inline-flex sm:px-5 sm:py-3"
                  >
                    <span className="material-symbols-outlined">share</span>
                    LinkedIn
                  </Button>
                </div>
                <div className="flex items-center gap-2 truncate text-[10px] font-medium text-on-surface-variant sm:text-xs">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <span className="truncate">Selected · {shortId(selected.id)}</span>
                </div>
              </div>
            </>
          )}
        </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricTile({ label, value, suffix, accent = false }: { label: string; value: string; suffix?: string; accent?: boolean }) {
  return (
    <Card className="gap-0 rounded-2xl border-0 bg-surface-container py-0 ring-0">
      <CardContent className="px-4 py-4 sm:px-5 sm:py-5">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{label}</p>
        <p className={cn("text-xl font-bold sm:text-2xl", accent ? "font-mono text-primary" : "text-on-surface")}>
          {value}
          {suffix ? <span className="ml-1 text-xs font-normal text-on-surface-variant">{suffix}</span> : null}
        </p>
      </CardContent>
    </Card>
  );
}

function Detail({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border-0 bg-surface-container-low/50 px-3 py-3 sm:items-center sm:px-4">
      <span className="material-symbols-outlined mt-0.5 shrink-0 text-primary sm:mt-0">{icon}</span>
      <span className="text-sm font-medium leading-snug text-on-surface">{text}</span>
    </div>
  );
}
