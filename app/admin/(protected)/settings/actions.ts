"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { classSettingsSchema } from "@/lib/validation/settings";
import { updateClassSettings } from "@/lib/data/settings";

export interface SettingsActionState {
  error?: string;
  success?: boolean;
}

export async function updateSettingsAction(
  _prevState: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  await requireAdmin();

  const parsed = classSettingsSchema.safeParse({
    name: formData.get("name"),
    academic_year: formData.get("academic_year"),
    subtitle: formData.get("subtitle"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "שגיאה בעדכון" };
  }

  await updateClassSettings(parsed.data);
  revalidatePath("/", "layout");
  return { success: true };
}
