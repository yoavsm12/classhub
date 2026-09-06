"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { reportStatusSchema } from "@/lib/validation/report";
import { updateReportStatus } from "@/lib/data/reports";

export async function setReportStatusAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = reportStatusSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
  });
  if (!parsed.success) return;

  await updateReportStatus(parsed.data.id, parsed.data.status);
  revalidatePath("/admin/reports");
  revalidatePath("/admin");
}
