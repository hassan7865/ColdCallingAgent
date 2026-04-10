"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toastApiError } from "@/lib/api-error";
import { createResourceApi } from "@/lib/api";
import { triggersKeys } from "@/lib/query-keys";

const api = createResourceApi<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>>("/triggers");

export function useGetTriggers(params: Record<string, unknown> = {}) {
  return useQuery({ queryKey: triggersKeys.list(params), queryFn: () => api.list(params) });
}

export function useCreateTriggers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => api.create(payload),
    onSettled: async (_data, error) => {
      await queryClient.invalidateQueries({ queryKey: triggersKeys.all });
      if (error) toastApiError(error, "Create failed");
      else toast.success("Created successfully");
    },
  });
}

export function useUpdateTriggers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: string; payload: Record<string, unknown> }) => api.update(args.id, args.payload),
    onSettled: async (_data, error) => {
      await queryClient.invalidateQueries({ queryKey: triggersKeys.all });
      if (error) toastApiError(error, "Update failed");
      else toast.success("Updated successfully");
    },
  });
}

export function useDeleteTriggers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(id),
    onSettled: async (_data, error) => {
      await queryClient.invalidateQueries({ queryKey: triggersKeys.all });
      if (error) toastApiError(error, "Delete failed");
      else toast.success("Deleted successfully");
    },
  });
}
