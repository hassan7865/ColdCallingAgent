export interface CampaignResponse {
  id: string;
  name: string;
  user_id?: string;
  target_segment?: string;
  status?: string;
  channels?: string[];
  total_prospects?: number;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
}

/** Create payload — `user_id` is set by the API from the session. */
export interface CampaignCreate {
  name: string;
  target_segment?: string;
  channels?: string[];
  start_date?: string;
  end_date?: string;
}

export interface CampaignUpdate {
  name?: string;
  target_segment?: string;
  status?: string;
  channels?: string[];
  start_date?: string;
  end_date?: string;
}
