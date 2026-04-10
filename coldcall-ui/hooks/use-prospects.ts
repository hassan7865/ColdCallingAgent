"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toastApiError } from "@/lib/api-error";
import { useAuthContext } from "@/context/AuthContext";
import { createResourceApi } from "@/lib/api";
import { prospectsKeys } from "@/lib/query-keys";
import { PaginatedData } from "@/types/common";
import { ProspectCreate, ProspectResponse, ProspectUpdate } from "@/types/prospects";

const api = createResourceApi<PaginatedData<ProspectResponse>, ProspectCreate, ProspectUpdate>("/prospects");

export function useGetProspects(params: Record<string, unknown> = {}) {
  const { isLoading: authLoading, isAuthenticated } = useAuthContext();
  return useQuery({
    queryKey: prospectsKeys.list(params),
    queryFn: () => api.list(params),
    enabled: !authLoading && isAuthenticated,
  });
}

export function useCreateProspects() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProspectCreate) => api.create(payload),
    onSettled: async (_data, error) => {
      await queryClient.invalidateQueries({ queryKey: prospectsKeys.all });
      if (error) toastApiError(error, "Create failed");
      else toast.success("Created successfully");
    },
  });
}

export function useUpdateProspects() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: string; payload: ProspectUpdate }) => api.update(args.id, args.payload),
    onSettled: async (_data, error) => {
      await queryClient.invalidateQueries({ queryKey: prospectsKeys.all });
      if (error) toastApiError(error, "Update failed");
      else toast.success("Updated successfully");
    },
  });
}

export function useDeleteProspects() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(id),
    onSettled: async (_data, error) => {
      await queryClient.invalidateQueries({ queryKey: prospectsKeys.all });
      if (error) toastApiError(error, "Delete failed");
      else toast.success("Deleted successfully");
    },
  });
}
