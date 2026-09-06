import { z } from "zod";
import { isSafeExternalUrl } from "@/lib/utils";

const resourceTypeValues = [
  "summary",
  "presentation",
  "worksheet",
  "homework",
  "exam_material",
  "submission_material",
  "important_link",
  "other",
] as const;

const sourceTypeValues = [
  "google_drive",
  "google_classroom",
  "mega",
  "youtube",
  "whatsapp",
  "website",
  "other",
] as const;

export const resourceSchema = z.object({
  subject_id: z.string().uuid("יש לבחור מקצוע"),
  title: z.string().trim().min(1, "כותרת היא שדה חובה").max(150),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  topic: z.string().trim().max(150).optional().or(z.literal("")),
  resource_type: z.enum(resourceTypeValues, { message: "סוג חומר לא תקין" }),
  source_type: z.enum(sourceTypeValues, { message: "מקור חומר לא תקין" }),
  external_url: z
    .string()
    .trim()
    .min(1, "קישור חיצוני הוא שדה חובה")
    .refine(isSafeExternalUrl, "יש להזין קישור תקין שמתחיל ב-http:// או https://"),
  resource_date: z.string().trim().optional().or(z.literal("")),
  is_important: z.coerce.boolean().default(false),
  is_active: z.coerce.boolean().default(true),
  linked_event_ids: z.array(z.string().uuid()).default([]),
});

export type ResourceInput = z.infer<typeof resourceSchema>;
