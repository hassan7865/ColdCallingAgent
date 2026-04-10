import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { emitAuthEvent } from "@/lib/auth-events";
import { ApiEnvelope } from "@/types/common";
import { User } from "@/types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let queue: Array<() => void> = [];

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

function handleAuthFailure() {
  emitAuthEvent("force-logout");
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.withCredentials = true;
  return config;
});

function isAuthCredentialRequest(url: string | undefined): boolean {
  if (!url) return false;
  return (
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/refresh")
  );
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableRequestConfig | undefined;
    if (!original) throw error;
    const shouldRefresh =
      error.response?.status === 401 &&
      !isAuthCredentialRequest(original.url) &&
      !original._retry;
    if (!shouldRefresh) throw error;
    original._retry = true;

    if (isRefreshing) {
      await new Promise<void>((resolve) => queue.push(resolve));
      return api(original);
    }

    isRefreshing = true;
    try {
      await api.post("/auth/refresh");
      queue.forEach((resolve) => resolve());
      queue = [];
      return api(original);
    } catch (refreshError) {
      queue = [];
      handleAuthFailure();
      throw refreshError;
    } finally {
      isRefreshing = false;
    }
  },
);

export const authApi = {
  me: async (): Promise<ApiEnvelope<User>> => (await api.get("/auth/me")).data,
  login: async (payload: { email: string; password: string }): Promise<ApiEnvelope<{ user_id: string }>> =>
    (await api.post("/auth/login", payload)).data,
  register: async (payload: { email: string; password: string; name: string }): Promise<ApiEnvelope<{ user_id: string }>> =>
    (await api.post("/auth/register", payload)).data,
  logout: async (): Promise<ApiEnvelope<null>> => (await api.post("/auth/logout")).data,
};

export const createResourceApi = <TResponse, TCreate, TUpdate>(basePath: string) => ({
  list: async (params: Record<string, unknown>) => (await api.get<ApiEnvelope<TResponse>>(basePath, { params })).data,
  create: async (payload: TCreate) => (await api.post<ApiEnvelope<TResponse>>(basePath, payload)).data,
  update: async (id: string, payload: TUpdate) => (await api.patch<ApiEnvelope<TResponse>>(`${basePath}/${id}`, payload)).data,
  delete: async (id: string) => (await api.delete<ApiEnvelope<{ deleted: boolean }>>(`${basePath}/${id}`)).data,
  get: async (id: string) => (await api.get<ApiEnvelope<TResponse>>(`${basePath}/${id}`)).data,
});

export default api;
