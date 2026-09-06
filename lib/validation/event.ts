import { z } from "zod";

export const eventSchema = z.object({
  subject_id: z.string().uuid("יש לבחור מקצוע"),
  title: z.string().trim().min(1, "כותרת היא שדה חובה").max(150),
  event_type: z.enum(["exam", "assignment"], { message: "סוג אירוע לא תקין" }),
  event_date: z.string().trim().min(1, "תאריך הוא שדה חובה"),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  topics: z.string().trim().max(500).optional().or(z.literal("")),
  is_important: z.coerce.boolean().default(false),
  linked_resource_ids: z.array(z.string().uuid()).default([]),
});

export type EventInput = z.infer<typeof eventSchema>;
