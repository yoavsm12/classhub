"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { savedRedirectPath } from "@/lib/admin-redirect";
import { announcementSchema } from "@/lib/validation/announcement";
import {
  createAnnouncement,
  deleteAnnouncement,
  setAnnouncementActive,
  setAnnouncementPinned,
  updateAnnouncement,
} from "@/lib/data/announcements";

export interface AnnouncementFormState {
  error?: string;
}

function readAnnouncementForm(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    content: String(formData.get("content") ?? ""),
    is_pinned: formData.get("is_pinned") === "on",
    is_active: formData.get("is_active") === "on",
  };
}

export async function createAnnouncementAction(
  _prevState: AnnouncementFormState,
  formData: FormData
): Promise<AnnouncementFormState> {
  await requireAdmin();

  const parsed = announcementSchema.safeParse(readAnnouncementForm(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "שגיאה בטופס" };
  }

  await createAnnouncement(parsed.data);
  revalidatePath("/admin/announcements");
  revalidatePath("/class");
  redirect(savedRedirectPath(formData, "/admin/announcements"));
}

export async function updateAnnouncementAction(
  id: string,
  _prevState: AnnouncementFormState,
  formData: FormData
): Promise<AnnouncementFormState> {
  await requireAdmin();

  const parsed = announcementSchema.safeParse(readAnnouncementForm(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "שגיאה בטופס" };
  }

  await updateAnnouncement(id, parsed.data);
  revalidatePath("/admin/announcements");
  revalidatePath("/class");
  redirect("/admin/announcements?saved=1");
}

export async function togglePinnedAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id"));
  const nextPinned = formData.get("next_pinned") === "true";
  await setAnnouncementPinned(id, nextPinned);
  revalidatePath("/admin/announcements");
  revalidatePath("/class");
}

export async function toggleAnnouncementActiveAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id"));
  const nextActive = formData.get("next_active") === "true";
  await setAnnouncementActive(id, nextActive);
  revalidatePath("/admin/announcements");
  revalidatePath("/class");
}

export async function deleteAnnouncementAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id"));
  await deleteAnnouncement(id);
  revalidatePath("/admin/announcements");
  revalidatePath("/class");
}
