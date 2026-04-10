"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toastApiError } from "@/lib/api-error";
import { authApi } from "@/lib/api";
import { authKeys, campaignsKeys, prospectsKeys, reportsKeys } from "@/lib/query-keys";

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.all });
      await queryClient.invalidateQueries({ queryKey: reportsKeys.all });
      await queryClient.invalidateQueries({ queryKey: campaignsKeys.all });
      await queryClient.invalidateQueries({ queryKey: prospectsKeys.all });
      toast.success("Login successful");
    },
    onError: (error) => toastApiError(error, "Couldn't sign in"),
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.all });
      await queryClient.invalidateQueries({ queryKey: reportsKeys.all });
      await queryClient.invalidateQueries({ queryKey: campaignsKeys.all });
      await queryClient.invalidateQueries({ queryKey: prospectsKeys.all });
      toast.success("Registration successful");
    },
    onError: (error) => toastApiError(error, "Couldn't create account"),
  });
}
