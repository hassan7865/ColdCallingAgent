import { isAxiosError } from "axios";
import { toast } from "sonner";
type FastAPIValidationItem = { msg?: string; type?: string; loc?: unknown[] };

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/**
 * Human-readable message from API failures: FastAPI `detail`, app `Envelope`, or Axios/network.
 */
export function getApiErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (isAxiosError(error)) {
    const data = error.response?.data;

    if (isRecord(data)) {
      if (data.status === "error" && typeof data.message === "string" && data.message.trim()) {
        return data.message.trim();
      }

      const detail = data.detail;
      if (typeof detail === "string" && detail.trim()) {
        return detail.trim();
      }
      if (Array.isArray(detail) && detail.length > 0) {
        const first = detail[0] as FastAPIValidationItem;
        if (first && typeof first === "object" && typeof first.msg === "string" && first.msg.trim()) {
          return first.msg.trim();
        }
        return detail.map((d) => (typeof d === "string" ? d : JSON.stringify(d))).join("; ");
      }
      if (isRecord(detail) && typeof detail.message === "string") {
        return detail.message;
      }
    }

    if (error.response?.status === 401 && !error.response?.data) {
      return "Session expired or invalid. Please sign in again.";
    }

    if (error.message && !error.message.startsWith("Request failed with status code")) {
      return error.message;
    }

    if (error.response?.status) {
      return `Request failed (${error.response.status})`;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function toastApiError(error: unknown, fallback: string): void {
  toast.error(getApiErrorMessage(error, fallback));
}
