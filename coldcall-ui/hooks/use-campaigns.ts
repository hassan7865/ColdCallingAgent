"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toastApiError } from "@/lib/api-error";
import { useAuthContext } from "@/context/AuthContext";
import api, { createResourceApi } from "@/lib/api";
import { campaignsKeys } from "@/lib/query-keys";
import { PaginatedData } from "@/types/common";
import { CampaignCreate, CampaignResponse, CampaignUpdate } from "@/types/campaigns";

const campaignsApi = createResourceApi<PaginatedData<CampaignResponse>, CampaignCreate, CampaignUpdate>("/campaigns");

export function useGetCampaigns(params: Record<string, unknown> = {}) {
  const { isLoading: authLoading, isAuthenticated } = useAuthContext();
  return useQuery({
    queryKey: campaignsKeys.list(params),
    queryFn: () => campaignsApi.list(params),
    enabled: !authLoading && isAuthenticated,
  });
}

export function useCreateCampaigns() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CampaignCreate) => campaignsApi.create(payload),
    onSettled: async (_data, error) => {
      await queryClient.invalidateQueries({ queryKey: campaignsKeys.all });
      if (error) toastApiError(error, "Create failed");
      else toast.success("Created successfully");
    },
  });
}

export function useUpdateCampaigns() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: string; payload: CampaignUpdate }) => campaignsApi.update(args.id, args.payload),
    onSettled: async (_data, error) => {
      await queryClient.invalidateQueries({ queryKey: campaignsKeys.all });
      if (error) toastApiError(error, "Update failed");
      else toast.success("Updated successfully");
    },
  });
}

export function useDeleteCampaigns() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => campaignsApi.delete(id),
    onSettled: async (_data, error) => {
      await queryClient.invalidateQueries({ queryKey: campaignsKeys.all });
      if (error) toastApiError(error, "Delete failed");
      else toast.success("Deleted successfully");
    },
  });
}

export function useActivateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.post(`/campaigns/${id}/activate`)).data,
    onSettled: async (_data, error) => {
      await queryClient.invalidateQueries({ queryKey: campaignsKeys.all });
      if (error) toastApiError(error, "Activate failed");
      else toast.success("Campaign activated");
    },
  });
}

export function usePauseCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.post(`/campaigns/${id}/pause`)).data,
    onSettled: async (_data, error) => {
      await queryClient.invalidateQueries({ queryKey: campaignsKeys.all });
      if (error) toastApiError(error, "Pause failed");
      else toast.success("Campaign paused");
    },
  });
}
