import { listEventsWithLinkedResources } from "@/lib/data/events";
import { daysUntil, formatDate } from "@/lib/utils";
import { EventDetail } from "@/components/class/event-detail";
import { Badge } from "@/components/ui/badge";

export default async function ExamsPage() {
  const events = await listEventsWithLinkedResources("exam");

  const upcoming = events.filter((e) => daysUntil(e.event_date) >= 0);
  const past = events
    .filter((e) => daysUntil(e.event_date) < 0)
    .sort((a, b) => (a.event_date < b.event_date ? 1 : -1));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">מבחנים ובחנים</h1>
        <p className="text-sm text-neutral-500">כל המבחנים והבחנים הקרובים של הכיתה.</p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-neutral-900">מבחנים קרובים</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-neutral-400">אין מבחנים קרובים.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {upcoming.map((event) => (
              <EventDetail key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section className="flex flex-col gap-3 opacity-60">
          <h2 className="text-sm font-semibold text-neutral-500">מבחנים שעברו</h2>
          <div className="flex flex-col gap-2">
            {past.map((event) => (
              <div key={event.id} className="flex items-center justify-between text-sm text-neutral-500">
                <span>
                  <Badge tone="neutral">מבחן</Badge> {event.title} — {event.subject.name}
                </span>
                <span className="ltr-nums">{formatDate(event.event_date)}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
