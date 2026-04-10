export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "agent" | "manager";
}

export interface AuthPayload {
  user_id: string;
}
