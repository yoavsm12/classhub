import { notFound } from "next/navigation";
import { getEventById, getEventLinkedResourceIds } from "@/lib/data/events";
import { listSubjects } from "@/lib/data/subjects";
import { listResources } from "@/lib/data/resources";
import { EventForm } from "@/components/admin/event-form";
import { updateEventAction } from "@/app/admin/(protected)/events/actions";

export default async function EditEventPage({ params }: PageProps<"/admin/events/[id]/edit">) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  const [subjects, resources, linkedResourceIds] = await Promise.all([
    listSubjects(),
    listResources(),
    getEventLinkedResourceIds(id),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-neutral-900">עריכת אירוע</h1>
      <EventForm
        event={event}
        subjects={subjects}
        resources={resources}
        linkedResourceIds={linkedResourceIds}
        action={updateEventAction.bind(null, id)}
      />
    </div>
  );
}
