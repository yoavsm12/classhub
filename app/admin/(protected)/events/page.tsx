import { listEventsWithSubject } from "@/lib/data/events";
import { SavedBanner, isSaved } from "@/components/admin/saved-banner";
import { deleteEventAction } from "@/app/admin/(protected)/events/actions";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { EVENT_TYPE_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export default async function AdminEventsPage({ searchParams }: PageProps<"/admin/events">) {
  const params = await searchParams;
  const events = await listEventsWithSubject();

  return (
    <div className="flex flex-col gap-6">
      <SavedBanner show={isSaved(params)} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900">מבחנים והגשות</h1>
        <LinkButton href="/admin/events/new" size="sm">
          + אירוע חדש
        </LinkButton>
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-neutral-400">עדיין לא נוספו אירועים.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {events.map((event) => (
            <Card key={event.id} className="flex flex-wrap items-center gap-3">
              <div className="min-w-48 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge tone={event.event_type === "exam" ? "danger" : "success"}>
                    {EVENT_TYPE_LABELS[event.event_type]}
                  </Badge>
                  <span className="font-semibold text-neutral-900">{event.title}</span>
                  {event.is_important && <Badge tone="warning">⭐</Badge>}
                </div>
                <div className="mt-1 text-xs text-neutral-400">
                  {event.subject.icon} {event.subject.name} · <span className="ltr-nums">{formatDate(event.event_date)}</span>
                </div>
              </div>

              <LinkButton href={`/admin/events/${event.id}/edit`} variant="secondary" size="sm">
                עריכה
              </LinkButton>

              <form action={deleteEventAction}>
                <input type="hidden" name="id" value={event.id} />
                <ConfirmSubmitButton confirmMessage={`למחוק את האירוע "${event.title}"?`} size="sm">
                  מחיקה
                </ConfirmSubmitButton>
              </form>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
