"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { savedRedirectPath } from "@/lib/admin-redirect";
import { subjectSchema } from "@/lib/validation/subject";
import { slugify } from "@/lib/utils";
import {
  countSubjectDependents,
  createSubject,
  deleteSubject,
  isSlugTaken,
  listSubjects,
  reorderSubjects,
  setSubjectActive,
  updateSubject,
} from "@/lib/data/subjects";

export interface SubjectFormState {
  error?: string;
}

function readSubjectForm(formData: FormData) {
  const name = String(formData.get("name") ?? "");
  const rawSlug = String(formData.get("slug") ?? "");
  return {
    name,
    slug: (rawSlug.trim() ? rawSlug : slugify(name)).trim(),
    icon: String(formData.get("icon") ?? ""),
    description: String(formData.get("description") ?? ""),
    display_order: formData.get("display_order") ?? 0,
    is_active: formData.get("is_active") === "on",
  };
}

export async function createSubjectAction(_prevState: SubjectFormState, formData: FormData): Promise<SubjectFormState> {
  await requireAdmin();

  const parsed = subjectSchema.safeParse(readSubjectForm(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "שגיאה בטופס" };
  }

  if (await isSlugTaken(parsed.data.slug)) {
    return { error: "כתובת (slug) זו כבר תפוסה על ידי מקצוע אחר." };
  }

  await createSubject(parsed.data);
  revalidatePath("/admin/subjects");
  revalidatePath("/class");
  redirect(savedRedirectPath(formData, "/admin/subjects"));
}

export async function updateSubjectAction(
  id: string,
  _prevState: SubjectFormState,
  formData: FormData
): Promise<SubjectFormState> {
  await requireAdmin();

  const parsed = subjectSchema.safeParse(readSubjectForm(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "שגיאה בטופס" };
  }

  if (await isSlugTaken(parsed.data.slug, id)) {
    return { error: "כתובת (slug) זו כבר תפוסה על ידי מקצוע אחר." };
  }

  await updateSubject(id, parsed.data);
  revalidatePath("/admin/subjects");
  revalidatePath("/class");
  redirect("/admin/subjects?saved=1");
}

export async function toggleSubjectActiveAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id"));
  const nextActive = formData.get("next_active") === "true";
  await setSubjectActive(id, nextActive);
  revalidatePath("/admin/subjects");
  revalidatePath("/class");
}

export async function deleteSubjectAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id"));
  await deleteSubject(id);
  revalidatePath("/admin/subjects");
  revalidatePath("/class");
}

export async function checkSubjectDependents(id: string) {
  await requireAdmin();
  return countSubjectDependents(id);
}

export async function moveSubjectAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id"));
  const direction = String(formData.get("direction"));

  const subjects = await listSubjects();
  const index = subjects.findIndex((s) => s.id === id);
  if (index === -1) return;

  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= subjects.length) return;

  const reordered = [...subjects];
  [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];

  await reorderSubjects(reordered.map((s) => s.id));
  revalidatePath("/admin/subjects");
  revalidatePath("/class");
}
