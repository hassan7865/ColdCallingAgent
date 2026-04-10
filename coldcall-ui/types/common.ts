export interface ApiEnvelope<T> {
  status: "success" | "error";
  message: string;
  data: T;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}
