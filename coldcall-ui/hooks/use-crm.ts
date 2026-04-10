"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toastApiError } from "@/lib/api-error";
import { createResourceApi } from "@/lib/api";
import { crmKeys } from "@/lib/query-keys";

const api = createResourceApi<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>>("/crm/connections");

export function useGetCrm(params: Record<string, unknown> = {}) {
  return useQuery({ queryKey: crmKeys.list(params), queryFn: () => api.list(params) });
}

export function useCreateCrm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => api.create(payload),
    onSettled: async (_data, error) => {
      await queryClient.invalidateQueries({ queryKey: crmKeys.all });
      if (error) toastApiError(error, "Create failed");
      else toast.success("Created successfully");
    },
  });
}

export function useUpdateCrm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: string; payload: Record<string, unknown> }) => api.update(args.id, args.payload),
    onSettled: async (_data, error) => {
      await queryClient.invalidateQueries({ queryKey: crmKeys.all });
      if (error) toastApiError(error, "Update failed");
      else toast.success("Updated successfully");
    },
  });
}

export function useDeleteCrm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(id),
    onSettled: async (_data, error) => {
      await queryClient.invalidateQueries({ queryKey: crmKeys.all });
      if (error) toastApiError(error, "Delete failed");
      else toast.success("Deleted successfully");
    },
  });
}
