import { z } from "zod";

export const announcementSchema = z.object({
  title: z.string().trim().min(1, "כותרת היא שדה חובה").max(150),
  content: z.string().trim().min(1, "תוכן ההודעה הוא שדה חובה").max(2000),
  is_pinned: z.coerce.boolean().default(false),
  is_active: z.coerce.boolean().default(true),
});

export type AnnouncementInput = z.infer<typeof announcementSchema>;
