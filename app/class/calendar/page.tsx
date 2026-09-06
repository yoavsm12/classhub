import { listEventsWithSubject } from "@/lib/data/events";
import { listHolidays } from "@/lib/data/holidays";
import { CalendarView } from "@/components/class/calendar-view";

export default async function CalendarPage() {
  const [events, holidays] = await Promise.all([listEventsWithSubject(), listHolidays()]);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">לוח שנה</h1>
        <p className="text-sm text-neutral-500">מבחנים, הגשות וחופשות לאורך שנת הלימודים.</p>
      </div>
      <CalendarView events={events} holidays={holidays} />
    </div>
  );
}
