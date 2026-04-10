"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "@/context/AuthContext";
import api from "@/lib/api";
import { reportsKeys } from "@/lib/query-keys";
import { ApiEnvelope } from "@/types/common";
import { ReportsSummaryResponse } from "@/types/reports";

export function useGetReportsSummary() {
  const { isLoading: authLoading, isAuthenticated } = useAuthContext();
  return useQuery({
    queryKey: reportsKeys.list({ scope: "summary" }),
    queryFn: async () => (await api.get<ApiEnvelope<ReportsSummaryResponse>>("/reports/summary")).data.data,
    enabled: !authLoading && isAuthenticated,
  });
}
