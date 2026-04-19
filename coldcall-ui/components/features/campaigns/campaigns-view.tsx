"use client";

import { useMemo, useState } from "react";
import { Megaphone, Pause, Pencil, Play, Plus, Trash2 } from "lucide-react";
import { CampaignDeleteDialog } from "@/components/features/campaigns/campaign-delete-dialog";
import { CampaignFormDialog } from "@/components/features/campaigns/campaign-form-dialog";
import { ListLoading } from "@/components/features/shared/list-loading";
import { useAuthContext } from "@/context/AuthContext";
import { useActivateCampaign, useGetCampaigns, usePauseCampaign } from "@/hooks/use-campaigns";
import { CampaignResponse } from "@/types/campaigns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function statusBarClass(status: string): { bar: string; width: string; indeterminate?: boolean } {
  switch (status) {
    case "active":
      return { bar: "bg-primary", width: "45%", indeterminate: true };
    case "paused":
      return { bar: "bg-amber-400", width: "35%" };
    case "completed":
      return { bar: "bg-on-surface-variant", width: "100%" };
    default:
      return { bar: "bg-outline-variant", width: "8%" };
  }
}

function statusLabel(status: string): string {
  switch (status) {
    case "draft":
      return "Draft — not launched";
    case "active":
      return "Active — outreach running";
    case "paused":
      return "Paused";
    case "completed":
      return "Completed";
    default:
      return status;
  }
}

export function CampaignsView({ initialItems = [] }: { initialItems?: CampaignResponse[] }) {
  const { isLoading: authLoading, isAuthenticated } = useAuthContext();
  const query = useGetCampaigns({ skip: 0, limit: 50 });
  const activateMutation = useActivateCampaign();
  const pauseMutation = usePauseCampaign();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<CampaignResponse | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const items = query.data?.data?.items ?? initialItems;
  const displayItems = useMemo(() => (Array.isArray(items) ? items : []), [items]);

  const stats = useMemo(() => {
    const active = displayItems.filter((i) => i.status === "active").length;
    const paused = displayItems.filter((i) => i.status === "paused").length;
    const prospects = displayItems.reduce((s, i) => s + Number(i.total_prospects ?? 0), 0);
    return { active, paused, prospects };
  }, [displayItems]);

  if (authLoading) {
    return <ListLoading rows={6} />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const openCreate = () => {
    setFormMode("create");
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (c: CampaignResponse) => {
    setFormMode("edit");
    setEditing(c);
    setFormOpen(true);
  };

  const openDelete = (c: CampaignResponse) => {
    const id = String(c.id ?? "");
    if (!id) return;
    setDeleteTarget({ id, name: c.name });
    setDeleteOpen(true);
  };

  if (query.isLoading) return <ListLoading rows={4} />;

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col">
      <div className="mx-auto grid h-full min-h-0 min-w-0 w-full max-w-[1600px] flex-1 grid-rows-[auto_minmax(0,1fr)] gap-6 sm:gap-8">
        <div className="min-w-0">
          <div className="relative overflow-hidden rounded-2xl border-0 bg-surface-container-low/40 p-5 shadow-xl shadow-black/15 sm:p-7">
            <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/12 blur-[100px]" />
            <div className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-secondary/10 blur-[80px]" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <header className="min-w-0 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className="rounded-full border-primary/35 bg-primary/10 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-primary"
                  >
                    Outreach
                  </Badge>
                  <span className="text-[10px] font-medium uppercase tracking-widest text-on-surface-variant">
                    Campaigns
                  </span>
                </div>
                <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-on-surface sm:text-4xl lg:text-[2.5rem]">
                  Run sequences that <span className="text-primary">feel personal</span>
                </h1>
                <p className="max-w-xl text-sm leading-relaxed text-on-surface-variant sm:text-base">
                  Create campaigns, attach channels, and control live status—everything stays scoped to your account.
                </p>
              </header>
              <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row sm:justify-end lg:w-auto">
                <Button
                  type="button"
                  variant="secondary"
                  disabled
                  title="Coming soon"
                  className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-high px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant sm:w-auto"
                >
                  View archive
                </Button>
                <Button
                  type="button"
                  onClick={openCreate}
                  className="w-full rounded-xl bg-primary px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-on-primary shadow-lg shadow-primary/15 sm:w-auto"
                >
                  <Plus className="mr-2 size-4" aria-hidden />
                  New campaign
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col border-t border-outline-variant/15 pt-5 text-on-surface sm:pt-6">
          <div
            className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain pb-1 [scrollbar-gutter:stable]"
            role="region"
            aria-label="Campaigns and overview"
          >
            <div className="space-y-8 sm:space-y-10">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayItems.map((item, idx) => {
            const status = String(item.status ?? "draft");
            const borderAccent =
              status === "active"
                ? "border-l-primary shadow-primary/5"
                : status === "paused"
                  ? "border-l-amber-400"
                  : status === "completed"
                    ? "border-l-on-surface-variant"
                    : "border-l-outline-variant";
            const badgeClass =
              status === "active"
                ? "border-primary/30 bg-primary/10 text-primary"
                : status === "paused"
                  ? "border-amber-400/30 bg-amber-400/10 text-amber-400"
                  : status === "completed"
                    ? "border-outline-variant/40 bg-surface-container-high text-on-surface-variant"
                    : "border-outline-variant/40 bg-surface-container-low text-on-surface-variant";
            const { bar, width, indeterminate } = statusBarClass(status);
            const total = Math.max(Number(item.total_prospects ?? 0), 0);
            const ch = item.channels?.length ?? 0;

            return (
              <Card
                key={String(item.id ?? idx)}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border-0 border-l-4 bg-surface-container transition-all hover:shadow-lg",
                  borderAccent,
                )}
              >
                <div className="pointer-events-none absolute -right-6 -top-6 size-28 rounded-full bg-primary/5 blur-2xl transition-opacity group-hover:opacity-100" />
                <CardHeader className="relative space-y-3 p-5 pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="text-lg font-bold tracking-tight text-on-surface sm:text-xl">{item.name}</CardTitle>
                      <p className="mt-1.5 line-clamp-2 text-sm text-on-surface-variant">
                        {item.target_segment?.trim() ? item.target_segment : "No target segment description yet."}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn("shrink-0 rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider", badgeClass)}
                    >
                      {status === "active" ? (
                        <span className="mr-1.5 inline-block size-1.5 animate-pulse rounded-full bg-primary" />
                      ) : null}
                      {status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-5 p-5 pt-0">
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-on-surface-variant">Status</span>
                      <span className="text-right text-xs font-medium text-on-surface">{statusLabel(status)}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-low">
                      <div
                        className={cn("h-full rounded-full transition-all", bar, indeterminate && "animate-pulse")}
                        style={{ width: indeterminate ? "38%" : width }}
                      />
                    </div>
                    <p className="mt-2 text-[0.7rem] text-on-surface-variant">
                      {total} prospect{total === 1 ? "" : "s"} · {ch} channel{ch === 1 ? "" : "s"}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { k: "Prospects", v: total },
                      { k: "Channels", v: ch },
                      { k: "Status", v: status, cap: true },
                    ].map((cell) => (
                      <div
                        key={cell.k}
                        className="rounded-xl border-0 bg-surface-container-low/80 px-2 py-2.5 text-center sm:px-3"
                      >
                        <div className="text-[0.6rem] font-semibold uppercase tracking-wide text-on-surface-variant">{cell.k}</div>
                        <div
                          className={cn(
                            "mt-1 text-sm font-bold text-on-surface sm:text-base",
                            cell.cap && "capitalize",
                          )}
                        >
                          {cell.v}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="flex-1 rounded-xl border border-outline-variant/30 bg-surface-container-high"
                      onClick={() => openEdit(item)}
                    >
                      <Pencil className="mr-2 size-3.5" aria-hidden />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="flex-1 rounded-xl border border-outline-variant/30 bg-surface-container-high text-destructive hover:bg-destructive/10"
                      onClick={() => openDelete(item)}
                    >
                      <Trash2 className="mr-2 size-3.5" aria-hidden />
                      Delete
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      className={cn(
                        "flex-1 rounded-xl border font-semibold",
                        status === "paused" || status === "draft"
                          ? "border-primary/25 bg-primary/10 text-primary hover:bg-primary/15"
                          : "border-outline-variant/30 bg-surface-container-highest text-on-surface hover:bg-surface-container-high",
                      )}
                      disabled={
                        activateMutation.isPending || pauseMutation.isPending || status === "completed"
                      }
                      onClick={() => {
                        const id = String(item.id ?? "");
                        if (!id) return;
                        if (status === "paused" || status === "draft") {
                          activateMutation.mutate(id);
                          return;
                        }
                        if (status === "active") pauseMutation.mutate(id);
                      }}
                    >
                      {status === "paused" ? (
                        <>
                          <Play className="mr-2 size-3.5" aria-hidden />
                          Resume
                        </>
                      ) : status === "active" ? (
                        <>
                          <Pause className="mr-2 size-3.5" aria-hidden />
                          Pause
                        </>
                      ) : status === "draft" ? (
                        <>
                          <Play className="mr-2 size-3.5" aria-hidden />
                          Activate
                        </>
                      ) : (
                        <>
                          <Megaphone className="mr-2 size-3.5 opacity-50" aria-hidden />
                          Completed
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <button
            type="button"
            onClick={openCreate}
            className={cn(
              "group flex min-h-[280px] w-full flex-col items-center justify-center rounded-2xl border-0 bg-surface-container-lowest/80 p-8 text-center transition-all",
              "hover:bg-surface-container-low hover:shadow-lg hover:shadow-primary/5",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
            )}
          >
            <span className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-surface-container-high ring-0 transition-colors group-hover:bg-primary/10">
              <Megaphone className="size-7 text-primary" aria-hidden />
            </span>
            <span className="text-lg font-bold text-on-surface">Launch new campaign</span>
            <span className="mt-2 max-w-[260px] text-sm text-on-surface-variant">Open the form, add real data, and create via API.</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="rounded-2xl border-0 bg-surface-container py-6 md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-5 pb-2 pt-0 sm:px-6">
              <CardTitle className="text-base font-bold">Fleet overview</CardTitle>
              <Badge variant="outline" className="border-primary/25 bg-primary/5 text-[0.65rem] text-primary">
                Live
              </Badge>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-10 px-5 sm:px-6">
              <div>
                <div className="text-3xl font-extrabold tabular-nums text-primary">{stats.active}</div>
                <div className="mt-1 text-[0.65rem] font-bold uppercase tracking-widest text-on-surface-variant">Active</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold tabular-nums text-secondary">{stats.paused}</div>
                <div className="mt-1 text-[0.65rem] font-bold uppercase tracking-widest text-on-surface-variant">Paused</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold tabular-nums text-on-surface">{stats.prospects}</div>
                <div className="mt-1 text-[0.65rem] font-bold uppercase tracking-widest text-on-surface-variant">Prospects</div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-0 bg-gradient-to-br from-primary/10 to-transparent py-6">
            <CardContent className="space-y-3 px-5 sm:px-6">
              <CardTitle className="text-base font-bold">Tip</CardTitle>
              <p className="text-sm leading-relaxed text-on-surface-variant">
                Short, specific target segments outperform broad lists. Refine ICP in the form before activating.
              </p>
            </CardContent>
          </Card>
        </div>
            </div>
          </div>
        </div>
      </div>

      <CampaignFormDialog open={formOpen} onOpenChange={setFormOpen} mode={formMode} campaign={editing} />
      <CampaignDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        campaignId={deleteTarget?.id ?? null}
        campaignName={deleteTarget?.name ?? ""}
      />
    </div>
  );
}
