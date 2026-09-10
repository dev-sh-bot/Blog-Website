import { z } from "zod";

export const taxonomySchema = z.object({
  name: z.string().trim().min(2).max(100),
  slug: z.string().trim().min(2).max(120).optional().or(z.literal("")),
  description: z.string().trim().max(500).optional(),
  bio: z.string().trim().max(1000).optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  role: z.string().trim().max(100).optional(),
});
