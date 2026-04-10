/** `datetime-local` value from an ISO string, or empty. */
export function toDatetimeLocal(iso: string | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 16);
}

/** ISO string for API, or `undefined` if empty. */
export function toOptionalIso(datetimeLocal: string | undefined): string | undefined {
  const t = datetimeLocal?.trim();
  if (!t) return undefined;
  const d = new Date(t);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}
