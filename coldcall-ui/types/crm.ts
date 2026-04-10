export interface CrmResponse {
  id: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface CrmCreate {
  [key: string]: unknown;
}

export interface CrmUpdate {
  [key: string]: unknown;
}
