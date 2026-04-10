import { cookies } from "next/headers";
import { ApiEnvelope } from "@/types/common";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

/** Join base URL with path; avoids `.../api/api/...` when base already ends with `/api`. */
function joinBaseAndPath(base: string, path: string): string {
  const b = base.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  if (b.endsWith("/api") && p.startsWith("/api/")) {
    return `${b}${p.slice(4)}`;
  }
  return `${b}${p}`;
}

export async function fetchServer<T>(path: string): Promise<ApiEnvelope<T> | null> {
  if (!baseUrl) return null;
  const url = joinBaseAndPath(baseUrl, path);

  const jar = await cookies();
  const cookieHeader = jar
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const response = await fetch(url, {
    cache: "no-store",
    headers: cookieHeader ? { Cookie: cookieHeader } : {},
  });
  if (!response.ok) return null;
  return (await response.json()) as ApiEnvelope<T>;
}
