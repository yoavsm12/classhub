import { listSubjects } from "@/lib/data/subjects";
import { SavedBanner, isSaved } from "@/components/admin/saved-banner";
import { ScheduleForm } from "@/components/admin/schedule-form";
import { createScheduleSlotAction } from "@/app/admin/(protected)/schedule/actions";

export default async function NewScheduleSlotPage({ searchParams }: PageProps<"/admin/schedule/new">) {
  const params = await searchParams;
  const subjects = await listSubjects();

  return (
    <div className="flex flex-col gap-6">
      <SavedBanner show={isSaved(params)} message="נשמר בהצלחה ✓ אפשר להוסיף עוד" />
      <h1 className="text-xl font-bold text-neutral-900">שיעור חדש במערכת</h1>
      <ScheduleForm subjects={subjects} action={createScheduleSlotAction} />
    </div>
  );
}
