import { z } from "zod";


const emailField = z
  .string()
  .transform((val) => val.trim().toLowerCase())
  .pipe(z.string().min(1, "Email is required").email("Enter a valid email address"));

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: emailField,
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
