"use client";

import { createContext, useContext, ReactNode, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { authKeys } from "@/lib/query-keys";
import { authApi } from "@/lib/api";
import { subscribeAuthEvents } from "@/lib/auth-events";
import { User } from "@/types/auth";
import { useEffect } from "react";

interface AuthContextValue {
  user: User | null;
  /** True while the `/auth/me` request is in flight. */
  isLoading: boolean;
  /** Session is known and valid: `me` succeeded and returned a user. */
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isLoading, isError } = useQuery({
    queryKey: authKeys.me(),
    queryFn: authApi.me,
    retry: false,
  });

  useEffect(() => {
    const unsubscribe = subscribeAuthEvents(async () => {
      try {
        await authApi.logout();
      } catch {
        // no-op: logout endpoint can fail if session is already invalid
      }
      router.replace("/login");
    });
    return unsubscribe;
  }, [router]);

  useEffect(() => {
    const isAuthPage = pathname === "/login" || pathname === "/register";
    const isPublicPage = pathname === "/terms" || pathname === "/privacy" || pathname === "/security";
    if (!isLoading && isError && !isAuthPage && !isPublicPage) {
      router.replace("/login");
    }
  }, [isError, isLoading, pathname, router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: data?.data ?? null,
      isLoading,
      isAuthenticated: !isLoading && data?.data != null,
      logout: async () => {
        await authApi.logout();
        router.replace("/login");
      },
    }),
    [data?.data, isLoading, router],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within AuthProvider");
  return context;
}
