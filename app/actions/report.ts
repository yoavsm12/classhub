"use server";

import { revalidatePath } from "next/cache";
import { requireClassAccess } from "@/lib/auth/session";
import { reportSchema } from "@/lib/validation/report";
import { createReport } from "@/lib/data/reports";

export interface ReportActionState {
  error?: string;
  success?: boolean;
}

export async function reportResourceAction(
  _prevState: ReportActionState,
  formData: FormData
): Promise<ReportActionState> {
  await requireClassAccess();

  const parsed = reportSchema.safeParse({
    resource_id: formData.get("resource_id"),
    reason: formData.get("reason"),
    note: formData.get("note"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "שגיאה בשליחת הדיווח" };
  }

  await createReport(parsed.data);
  revalidatePath("/admin/reports");
  return { success: true };
}
