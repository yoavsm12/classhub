"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { eventSchema } from "@/lib/validation/event";
import { createEvent, deleteEvent, updateEvent } from "@/lib/data/events";

export interface EventFormState {
  error?: string;
}

function readEventForm(formData: FormData) {
  return {
    subject_id: String(formData.get("subject_id") ?? ""),
    title: String(formData.get("title") ?? ""),
    event_type: String(formData.get("event_type") ?? ""),
    event_date: String(formData.get("event_date") ?? ""),
    description: String(formData.get("description") ?? ""),
    topics: String(formData.get("topics") ?? ""),
    is_important: formData.get("is_important") === "on",
    linked_resource_ids: formData.getAll("linked_resource_ids").map(String),
  };
}

export async function createEventAction(_prevState: EventFormState, formData: FormData): Promise<EventFormState> {
  await requireAdmin();

  const parsed = eventSchema.safeParse(readEventForm(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "שגיאה בטופס" };
  }

  await createEvent(parsed.data);
  revalidatePath("/admin/events");
  revalidatePath("/class");
  redirect("/admin/events");
}

export async function updateEventAction(
  id: string,
  _prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  await requireAdmin();

  const parsed = eventSchema.safeParse(readEventForm(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "שגיאה בטופס" };
  }

  await updateEvent(id, parsed.data);
  revalidatePath("/admin/events");
  revalidatePath("/class");
  redirect("/admin/events");
}

export async function deleteEventAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id"));
  await deleteEvent(id);
  revalidatePath("/admin/events");
  revalidatePath("/class");
}
