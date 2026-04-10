export interface EmailResponse {
  id: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface EmailCreate {
  [key: string]: unknown;
}

export interface EmailUpdate {
  [key: string]: unknown;
}
