import { z } from "zod";

export const reportSchema = z.object({
  resource_id: z.string().uuid("חומר לא תקין"),
  reason: z.enum(["broken_link", "wrong_content", "other"], { message: "יש לבחור סיבה" }),
  note: z.string().trim().max(500).optional().or(z.literal("")),
});

export type ReportInput = z.infer<typeof reportSchema>;

export const reportStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["open", "resolved", "ignored"]),
});
