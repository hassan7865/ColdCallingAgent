import { z } from "zod";

export const campaignChannelSchema = z.enum(["call", "email", "linkedin"]);

export const campaignFormSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(255),
    target_segment: z.string().optional(),
    channels: z.array(campaignChannelSchema).optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    status: z.enum(["draft", "active", "paused", "completed"]).optional(),
  })
  .refine(
    (data) => {
      if (!data.start_date?.trim() || !data.end_date?.trim()) return true;
      return new Date(data.end_date) >= new Date(data.start_date);
    },
    { message: "End must be on or after start", path: ["end_date"] },
  );

export type CampaignFormValues = z.infer<typeof campaignFormSchema>;
