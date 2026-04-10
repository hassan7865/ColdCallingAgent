export interface MeetingResponse {
  id: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface MeetingCreate {
  [key: string]: unknown;
}

export interface MeetingUpdate {
  [key: string]: unknown;
}
