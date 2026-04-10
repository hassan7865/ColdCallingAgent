export interface TriggerResponse {
  id: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface TriggerCreate {
  [key: string]: unknown;
}

export interface TriggerUpdate {
  [key: string]: unknown;
}
