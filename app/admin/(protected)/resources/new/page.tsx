import { listSubjects } from "@/lib/data/subjects";
import { SavedBanner, isSaved } from "@/components/admin/saved-banner";
import { listEventsWithSubject } from "@/lib/data/events";
import { ResourceForm } from "@/components/admin/resource-form";
import { createResourceAction } from "@/app/admin/(protected)/resources/actions";

export default async function NewResourcePage({ searchParams }: PageProps<"/admin/resources/new">) {
  const params = await searchParams;
  const [subjects, events] = await Promise.all([listSubjects(), listEventsWithSubject()]);

  return (
    <div className="flex flex-col gap-6">
      <SavedBanner show={isSaved(params)} message="נשמר בהצלחה ✓ אפשר להוסיף עוד" />
      <h1 className="text-xl font-bold text-neutral-900">חומר חדש</h1>
      <ResourceForm subjects={subjects} events={events} action={createResourceAction} />
    </div>
  );
}
