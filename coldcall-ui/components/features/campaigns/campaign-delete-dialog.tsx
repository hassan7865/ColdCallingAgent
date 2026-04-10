"use client";

import { Loader2 } from "lucide-react";
import { useDeleteCampaigns } from "@/hooks/use-campaigns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function CampaignDeleteDialog({
  open,
  onOpenChange,
  campaignId,
  campaignName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignId: string | null;
  campaignName: string;
}) {
  const deleteMutation = useDeleteCampaigns();
  const pending = deleteMutation.isPending;

  const onConfirm = async () => {
    if (!campaignId) return;
    try {
      await deleteMutation.mutateAsync(campaignId);
      onOpenChange(false);
    } catch {
      // Toast from hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-outline-variant/20 bg-surface-container sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-on-surface">Delete campaign</DialogTitle>
          <DialogDescription className="text-on-surface-variant">
            This permanently removes <span className="font-semibold text-on-surface">{campaignName}</span>. This
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:justify-end">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={pending}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={pending || !campaignId}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
