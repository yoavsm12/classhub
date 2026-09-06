"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { savedRedirectPath } from "@/lib/admin-redirect";
import { scheduleSlotSchema } from "@/lib/validation/schedule";
import { createScheduleSlot, deleteScheduleSlot, updateScheduleSlot } from "@/lib/data/schedule";

export interface ScheduleFormState {
  error?: string;
}

function readScheduleForm(formData: FormData) {
  return {
    subject_id: String(formData.get("subject_id") ?? ""),
    day_of_week: formData.get("day_of_week") ?? "",
    start_time: String(formData.get("start_time") ?? ""),
    end_time: String(formData.get("end_time") ?? ""),
    teacher: String(formData.get("teacher") ?? ""),
    room: String(formData.get("room") ?? ""),
    group_label: String(formData.get("group_label") ?? ""),
  };
}

export async function createScheduleSlotAction(
  _prevState: ScheduleFormState,
  formData: FormData
): Promise<ScheduleFormState> {
  await requireAdmin();

  const parsed = scheduleSlotSchema.safeParse(readScheduleForm(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "שגיאה בטופס" };
  }

  await createScheduleSlot(parsed.data);
  revalidatePath("/admin/schedule");
  revalidatePath("/class/schedule");
  redirect(savedRedirectPath(formData, "/admin/schedule"));
}

export async function updateScheduleSlotAction(
  id: string,
  _prevState: ScheduleFormState,
  formData: FormData
): Promise<ScheduleFormState> {
  await requireAdmin();

  const parsed = scheduleSlotSchema.safeParse(readScheduleForm(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "שגיאה בטופס" };
  }

  await updateScheduleSlot(id, parsed.data);
  revalidatePath("/admin/schedule");
  revalidatePath("/class/schedule");
  redirect("/admin/schedule?saved=1");
}

export async function deleteScheduleSlotAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id"));
  await deleteScheduleSlot(id);
  revalidatePath("/admin/schedule");
  revalidatePath("/class/schedule");
}
