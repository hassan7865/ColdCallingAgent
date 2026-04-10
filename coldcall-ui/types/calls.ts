export interface CallResponse {
  id: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface CallCreate {
  [key: string]: unknown;
}

export interface CallUpdate {
  [key: string]: unknown;
}
