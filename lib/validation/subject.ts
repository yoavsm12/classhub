import { z } from "zod";

export const subjectSchema = z.object({
  name: z.string().trim().min(1, "שם המקצוע הוא שדה חובה").max(80),
  slug: z
    .string()
    .trim()
    .min(1, "כתובת (slug) היא שדה חובה")
    .max(80)
    .regex(/^[\p{L}\p{N}-]+$/u, "כתובת יכולה להכיל אותיות, ספרות ומקפים בלבד"),
  icon: z.string().trim().max(10).optional().or(z.literal("")),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  display_order: z.coerce.number().int().min(0).default(0),
  is_active: z.coerce.boolean().default(true),
});

export type SubjectInput = z.infer<typeof subjectSchema>;
