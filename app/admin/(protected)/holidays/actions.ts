"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { savedRedirectPath } from "@/lib/admin-redirect";
import { holidaySchema } from "@/lib/validation/holiday";
import { createHoliday, deleteHoliday, updateHoliday } from "@/lib/data/holidays";

export interface HolidayFormState {
  error?: string;
}

function readHolidayForm(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    start_date: String(formData.get("start_date") ?? ""),
    end_date: String(formData.get("end_date") ?? ""),
    description: String(formData.get("description") ?? ""),
  };
}

export async function createHolidayAction(
  _prevState: HolidayFormState,
  formData: FormData
): Promise<HolidayFormState> {
  await requireAdmin();

  const parsed = holidaySchema.safeParse(readHolidayForm(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "שגיאה בטופס" };
  }

  await createHoliday(parsed.data);
  revalidatePath("/admin/holidays");
  revalidatePath("/class/calendar");
  redirect(savedRedirectPath(formData, "/admin/holidays"));
}

export async function updateHolidayAction(
  id: string,
  _prevState: HolidayFormState,
  formData: FormData
): Promise<HolidayFormState> {
  await requireAdmin();

  const parsed = holidaySchema.safeParse(readHolidayForm(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "שגיאה בטופס" };
  }

  await updateHoliday(id, parsed.data);
  revalidatePath("/admin/holidays");
  revalidatePath("/class/calendar");
  redirect("/admin/holidays?saved=1");
}

export async function deleteHolidayAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id"));
  await deleteHoliday(id);
  revalidatePath("/admin/holidays");
  revalidatePath("/class/calendar");
}
