import { listSubjects } from "@/lib/data/subjects";
import { ScheduleForm } from "@/components/admin/schedule-form";
import { createScheduleSlotAction } from "@/app/admin/(protected)/schedule/actions";

export default async function NewScheduleSlotPage() {
  const subjects = await listSubjects();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-neutral-900">שיעור חדש במערכת</h1>
      <ScheduleForm subjects={subjects} action={createScheduleSlotAction} />
    </div>
  );
}
