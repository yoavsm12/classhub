import { z } from "zod";

export const scheduleSlotSchema = z
  .object({
    subject_id: z.string().uuid("יש לבחור מקצוע"),
    day_of_week: z.coerce.number().int().min(0).max(6),
    start_time: z
      .string()
      .trim()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "שעת התחלה לא תקינה"),
    end_time: z
      .string()
      .trim()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "שעת סיום לא תקינה"),
    teacher: z.string().trim().max(100).optional().or(z.literal("")),
    room: z.string().trim().max(50).optional().or(z.literal("")),
    group_label: z.string().trim().max(20).optional().or(z.literal("")),
  })
  .refine((data) => data.end_time > data.start_time, {
    message: "שעת הסיום חייבת להיות אחרי שעת ההתחלה",
    path: ["end_time"],
  });

export type ScheduleSlotInput = z.infer<typeof scheduleSlotSchema>;
