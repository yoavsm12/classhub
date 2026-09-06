import { notFound } from "next/navigation";
import { getResourceById, getResourceLinkedEventIds } from "@/lib/data/resources";
import { listSubjects } from "@/lib/data/subjects";
import { listEventsWithSubject } from "@/lib/data/events";
import { ResourceForm } from "@/components/admin/resource-form";
import { updateResourceAction } from "@/app/admin/(protected)/resources/actions";

export default async function EditResourcePage({ params }: PageProps<"/admin/resources/[id]/edit">) {
  const { id } = await params;
  const resource = await getResourceById(id);
  if (!resource) notFound();

  const [subjects, events, linkedEventIds] = await Promise.all([
    listSubjects(),
    listEventsWithSubject(),
    getResourceLinkedEventIds(id),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-neutral-900">עריכת חומר</h1>
      <ResourceForm
        resource={resource}
        subjects={subjects}
        events={events}
        linkedEventIds={linkedEventIds}
        action={updateResourceAction.bind(null, id)}
      />
    </div>
  );
}
