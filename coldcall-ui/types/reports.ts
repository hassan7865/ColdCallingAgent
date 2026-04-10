export interface ReportsSummaryResponse {
  calls_today: number;
  calls_prior: number;
  connect_rate: number;
  connect_rate_prior: number;
  meetings_booked: number;
  meetings_booked_prior: number;
  pipeline_added: number;
  pipeline_added_prior: number;
  avg_duration: number;
  avg_duration_prior: number;
}

export interface CallPerformancePoint {
  date: string;
  calls: number;
  connect_rate: number;
}

export interface CallPerformanceResponse {
  days: number;
  series: CallPerformancePoint[];
}

export interface SegmentRow {
  label: string;
  calls: number;
  meetings: number;
  rate: number;
}

export interface SegmentsResponse {
  segments: SegmentRow[];
}

export interface OutcomeRow {
  outcome: string;
  count: number;
}

export interface OutcomesResponse {
  breakdown: OutcomeRow[];
}

export interface InsightResponse {
  title: string;
  detail: string;
}
