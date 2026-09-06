import { z } from "zod";

export const holidaySchema = z
  .object({
    title: z.string().trim().min(1, "שם החופשה/חג הוא שדה חובה").max(150),
    start_date: z.string().trim().min(1, "תאריך התחלה הוא שדה חובה"),
    end_date: z.string().trim().min(1, "תאריך סיום הוא שדה חובה"),
    description: z.string().trim().max(500).optional().or(z.literal("")),
  })
  .refine((data) => data.end_date >= data.start_date, {
    message: "תאריך הסיום חייב להיות אחרי (או שווה ל) תאריך ההתחלה",
    path: ["end_date"],
  });

export type HolidayInput = z.infer<typeof holidaySchema>;
