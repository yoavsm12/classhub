import { EVENT_TYPE_LABELS } from "@/lib/constants";
import { formatDate, relativeDayLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { EventWithSubject } from "@/lib/types";

export function EventCard({ event }: { event: EventWithSubject }) {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-1.5">
            <Badge tone={event.event_type === "exam" ? "danger" : "success"}>
              {EVENT_TYPE_LABELS[event.event_type]}
            </Badge>
            <Badge tone="neutral">
              {event.subject.icon} {event.subject.name}
            </Badge>
            {event.is_important && <Badge tone="warning">⭐ חשוב</Badge>}
          </div>
          <h3 className="font-semibold text-neutral-900">{event.title}</h3>
          {event.description && <p className="mt-1 text-sm text-neutral-500">{event.description}</p>}
          {event.topics.length > 0 && (
            <p className="mt-1 text-xs text-neutral-400">נושאים: {event.topics.join(", ")}</p>
          )}
        </div>
        <div className="shrink-0 text-left">
          <div className="ltr-nums text-sm font-semibold text-neutral-900">{formatDate(event.event_date)}</div>
          <div className="text-xs text-neutral-400">{relativeDayLabel(event.event_date)}</div>
        </div>
      </div>
    </Card>
  );
}
