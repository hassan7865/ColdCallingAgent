export interface ScriptResponse {
  id: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface ScriptCreate {
  [key: string]: unknown;
}

export interface ScriptUpdate {
  [key: string]: unknown;
}
