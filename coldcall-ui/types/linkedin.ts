export interface LinkedinResponse {
  id: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface LinkedinCreate {
  [key: string]: unknown;
}

export interface LinkedinUpdate {
  [key: string]: unknown;
}
