import { z } from "zod";

export const classSettingsSchema = z.object({
  name: z.string().trim().min(1, "שם הכיתה הוא שדה חובה").max(100),
  academic_year: z.string().trim().min(1, "שנת הלימודים היא שדה חובה").max(20),
  subtitle: z.string().trim().max(150).optional().or(z.literal("")),
});

export type ClassSettingsInput = z.infer<typeof classSettingsSchema>;

export const guestLoginSchema = z.object({
  code: z.string().trim().min(1, "יש להזין קוד גישה").max(100),
});
