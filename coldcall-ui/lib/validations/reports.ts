import { z } from "zod";

export const createSchema = z.object({}).passthrough();
export const updateSchema = z.object({}).partial().passthrough();
