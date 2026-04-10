export interface ProspectResponse {
  id: string;
  company_id?: string;
  contact_id?: string;
  icp_score?: number;
  status?: string;
  assigned_to?: string;
  campaign_id?: string;
  pain_points?: Record<string, unknown>;
  buying_signals?: Record<string, unknown>;
  preferred_channel?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProspectCreate {
  company_id: string;
  contact_id: string;
  icp_score?: number;
  status?: string;
}

export interface ProspectUpdate {
  icp_score?: number;
  status?: string;
  assigned_to?: string;
  campaign_id?: string | null;
}
