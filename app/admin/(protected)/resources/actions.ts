"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { resourceSchema } from "@/lib/validation/resource";
import { createResource, deleteResource, setResourceActive, updateResource } from "@/lib/data/resources";

export interface ResourceFormState {
  error?: string;
}

function readResourceForm(formData: FormData) {
  return {
    subject_id: String(formData.get("subject_id") ?? ""),
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    topic: String(formData.get("topic") ?? ""),
    resource_type: String(formData.get("resource_type") ?? ""),
    source_type: String(formData.get("source_type") ?? ""),
    external_url: String(formData.get("external_url") ?? ""),
    resource_date: String(formData.get("resource_date") ?? ""),
    is_important: formData.get("is_important") === "on",
    is_active: formData.get("is_active") === "on",
    linked_event_ids: formData.getAll("linked_event_ids").map(String),
  };
}

export async function createResourceAction(
  _prevState: ResourceFormState,
  formData: FormData
): Promise<ResourceFormState> {
  await requireAdmin();

  const parsed = resourceSchema.safeParse(readResourceForm(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "שגיאה בטופס" };
  }

  await createResource(parsed.data);
  revalidatePath("/admin/resources");
  revalidatePath("/class");
  redirect("/admin/resources");
}

export async function updateResourceAction(
  id: string,
  _prevState: ResourceFormState,
  formData: FormData
): Promise<ResourceFormState> {
  await requireAdmin();

  const parsed = resourceSchema.safeParse(readResourceForm(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "שגיאה בטופס" };
  }

  await updateResource(id, parsed.data);
  revalidatePath("/admin/resources");
  revalidatePath("/class");
  redirect("/admin/resources");
}

export async function toggleResourceActiveAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id"));
  const nextActive = formData.get("next_active") === "true";
  await setResourceActive(id, nextActive);
  revalidatePath("/admin/resources");
  revalidatePath("/class");
}

export async function deleteResourceAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id"));
  await deleteResource(id);
  revalidatePath("/admin/resources");
  revalidatePath("/class");
}
