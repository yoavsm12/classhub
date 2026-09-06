import { listSubjects } from "@/lib/data/subjects";
import { SavedBanner, isSaved } from "@/components/admin/saved-banner";
import { listResources } from "@/lib/data/resources";
import { EventForm } from "@/components/admin/event-form";
import { createEventAction } from "@/app/admin/(protected)/events/actions";

export default async function NewEventPage({ searchParams }: PageProps<"/admin/events/new">) {
  const params = await searchParams;
  const [subjects, resources] = await Promise.all([listSubjects(), listResources()]);

  return (
    <div className="flex flex-col gap-6">
      <SavedBanner show={isSaved(params)} message="נשמר בהצלחה ✓ אפשר להוסיף עוד" />
      <h1 className="text-xl font-bold text-neutral-900">מבחן / הגשה חדשים</h1>
      <EventForm subjects={subjects} resources={resources} action={createEventAction} />
    </div>
  );
}
