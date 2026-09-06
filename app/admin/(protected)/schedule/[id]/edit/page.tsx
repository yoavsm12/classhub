import { notFound } from "next/navigation";
import { getScheduleSlotById } from "@/lib/data/schedule";
import { listSubjects } from "@/lib/data/subjects";
import { ScheduleForm } from "@/components/admin/schedule-form";
import { updateScheduleSlotAction } from "@/app/admin/(protected)/schedule/actions";

export default async function EditScheduleSlotPage({ params }: PageProps<"/admin/schedule/[id]/edit">) {
  const { id } = await params;
  const slot = await getScheduleSlotById(id);
  if (!slot) notFound();

  const subjects = await listSubjects();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-neutral-900">עריכת שיעור</h1>
      <ScheduleForm slot={slot} subjects={subjects} action={updateScheduleSlotAction.bind(null, id)} />
    </div>
  );
}
