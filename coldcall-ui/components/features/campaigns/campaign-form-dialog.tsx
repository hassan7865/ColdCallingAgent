"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useCreateCampaigns, useUpdateCampaigns } from "@/hooks/use-campaigns";
import { toDatetimeLocal, toOptionalIso } from "@/lib/campaign-dates";
import { campaignFormSchema, type CampaignFormValues } from "@/lib/validations/campaigns";
import { CampaignResponse } from "@/types/campaigns";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type ChannelId = NonNullable<CampaignFormValues["channels"]>[number];

const CHANNELS: { id: ChannelId; label: string }[] = [
  { id: "call", label: "Phone" },
  { id: "email", label: "Email" },
  { id: "linkedin", label: "LinkedIn" },
];

function parseChannels(raw: string[] | undefined): CampaignFormValues["channels"] {
  const allowed = new Set(["call", "email", "linkedin"]);
  const out: CampaignFormValues["channels"] = [];
  for (const c of raw ?? []) {
    if (allowed.has(c)) out.push(c as NonNullable<CampaignFormValues["channels"]>[number]);
  }
  return out;
}

export function CampaignFormDialog({
  open,
  onOpenChange,
  mode,
  campaign,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  campaign: CampaignResponse | null;
}) {
  const createMutation = useCreateCampaigns();
  const updateMutation = useUpdateCampaigns();
  const pending = createMutation.isPending || updateMutation.isPending;

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      name: "",
      target_segment: "",
      channels: [],
      start_date: "",
      end_date: "",
      status: "draft",
    },
  });

  useEffect(() => {
    if (!open) return;
    if (mode === "create") {
      form.reset({
        name: "",
        target_segment: "",
        channels: [],
        start_date: "",
        end_date: "",
        status: "draft",
      });
      return;
    }
    if (campaign) {
      const st = campaign.status;
      const status =
        st === "draft" || st === "active" || st === "paused" || st === "completed" ? st : "draft";
      form.reset({
        name: campaign.name,
        target_segment: campaign.target_segment ?? "",
        channels: parseChannels(campaign.channels),
        start_date: toDatetimeLocal(campaign.start_date),
        end_date: toDatetimeLocal(campaign.end_date),
        status,
      });
    }
  }, [open, mode, campaign, form]);

  const toggleChannel = (id: (typeof CHANNELS)[number]["id"], checked: boolean) => {
    const cur = form.getValues("channels") ?? [];
    const next = checked ? [...new Set([...cur, id])] : cur.filter((c) => c !== id);
    form.setValue("channels", next, { shouldDirty: true });
  };

  const onSubmit = form.handleSubmit(async (values) => {
    const channels = values.channels?.length ? values.channels : undefined;
    const target_segment = values.target_segment?.trim() || undefined;
    const start_date = toOptionalIso(values.start_date);
    const end_date = toOptionalIso(values.end_date);

    try {
      if (mode === "create") {
        await createMutation.mutateAsync({
          name: values.name.trim(),
          target_segment,
          channels,
          start_date,
          end_date,
        });
        onOpenChange(false);
        return;
      }
      if (!campaign?.id) return;
      await updateMutation.mutateAsync({
        id: campaign.id,
        payload: {
          name: values.name.trim(),
          target_segment,
          channels,
          start_date,
          end_date,
          status: values.status,
        },
      });
      onOpenChange(false);
    } catch {
      // Toasts from hooks
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="max-h-[min(90dvh,720px)] gap-0 overflow-y-auto border-outline-variant/20 bg-surface-container p-0 sm:max-w-lg"
      >
        <DialogHeader className="border-b border-outline-variant/15 px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
          <DialogTitle className="text-lg font-bold text-on-surface sm:text-xl">
            {mode === "create" ? "New campaign" : "Edit campaign"}
          </DialogTitle>
          <DialogDescription className="text-sm text-on-surface-variant">
            {mode === "create"
              ? "Name your campaign, describe the segment, and choose outreach channels."
              : "Update details and status. Use Pause / Resume on the card for quick control."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col">
          <div className="space-y-5 px-5 py-5 sm:px-6">
            <div className="space-y-2">
              <Label htmlFor="campaign-name" className="text-on-surface">
                Name <span className="text-primary">*</span>
              </Label>
              <Input
                id="campaign-name"
                placeholder="e.g. Q2 outbound — healthcare"
                className="border-outline-variant/30 bg-surface-container-low"
                {...form.register("name")}
              />
              {form.formState.errors.name ? (
                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="campaign-segment" className="text-on-surface">
                Target segment
              </Label>
              <Textarea
                id="campaign-segment"
                placeholder="ICP, industry, company size, titles…"
                rows={3}
                className="border-outline-variant/30 bg-surface-container-low resize-y"
                {...form.register("target_segment")}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-on-surface">Channels</Label>
              <div className="flex flex-wrap gap-4">
                {CHANNELS.map(({ id, label }) => (
                  <label
                    key={id}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-lg border border-outline-variant/25 bg-surface-container-low px-3 py-2 text-sm text-on-surface transition-colors",
                      "hover:border-primary/30 has-[:checked]:border-primary/40 has-[:checked]:bg-primary/5",
                    )}
                  >
                    <Checkbox
                      checked={(form.watch("channels") ?? []).includes(id)}
                      onCheckedChange={(v) => toggleChannel(id, v === true)}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="campaign-start" className="text-on-surface">
                  Start (optional)
                </Label>
                <Input
                  id="campaign-start"
                  type="datetime-local"
                  className="border-outline-variant/30 bg-surface-container-low"
                  {...form.register("start_date")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="campaign-end" className="text-on-surface">
                  End (optional)
                </Label>
                <Input
                  id="campaign-end"
                  type="datetime-local"
                  className="border-outline-variant/30 bg-surface-container-low"
                  {...form.register("end_date")}
                />
              </div>
            </div>
            {form.formState.errors.end_date ? (
              <p className="text-xs text-destructive">{form.formState.errors.end_date.message}</p>
            ) : null}

            {mode === "edit" ? (
              <div className="space-y-2">
                <Label className="text-on-surface">Status</Label>
                <Select
                  value={form.watch("status") ?? "draft"}
                  onValueChange={(v) =>
                    form.setValue("status", v as CampaignFormValues["status"], { shouldDirty: true })
                  }
                >
                  <SelectTrigger className="border-outline-variant/30 bg-surface-container-low">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : null}
          </div>

          <DialogFooter className="gap-2 border-t border-outline-variant/15 bg-surface-container-low/80 px-5 py-4 sm:px-6">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending} className="bg-primary text-on-primary hover:bg-primary/90">
              {pending ? <Loader2 className="size-4 animate-spin" /> : mode === "create" ? "Create campaign" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
