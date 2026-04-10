export type AuthEvent = "force-logout";

type Listener = (event: AuthEvent) => void;

const listeners = new Set<Listener>();

export function subscribeAuthEvents(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function emitAuthEvent(event: AuthEvent): void {
  for (const listener of listeners) listener(event);
}
