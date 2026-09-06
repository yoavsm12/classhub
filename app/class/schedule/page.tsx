import { listScheduleSlots } from "@/lib/data/schedule";
import { ScheduleView } from "@/components/class/schedule-view";

export default async function ClassSchedulePage() {
  const slots = await listScheduleSlots();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">מערכת שעות</h1>
        <p className="text-sm text-neutral-500">מערכת השעות השבועית הקבועה של הכיתה.</p>
      </div>
      <ScheduleView slots={slots} />
    </div>
  );
}
