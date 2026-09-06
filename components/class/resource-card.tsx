import { RESOURCE_TYPE_LABELS, SOURCE_TYPE_LABELS } from "@/lib/constants";
import { formatDate, isSafeExternalUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ReportButton } from "@/components/class/report-button";
import type { ClassEvent, Resource } from "@/lib/types";

export function ResourceCard({
  resource,
  subjectLabel,
}: {
  resource: Resource & { events?: ClassEvent[] };
  subjectLabel?: string;
}) {
  const resourceDate = formatDate(resource.resource_date);
  const events = resource.events ?? [];
  const canOpen = isSafeExternalUrl(resource.external_url);

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-neutral-900">{resource.title}</h3>
          {resource.description && <p className="mt-1 text-sm text-neutral-500">{resource.description}</p>}
        </div>
        {resource.is_important && <Badge tone="warning">⭐ חשוב</Badge>}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {subjectLabel && <Badge tone="neutral">{subjectLabel}</Badge>}
        {resource.topic && <Badge tone="neutral">{resource.topic}</Badge>}
        <Badge tone="accent">{RESOURCE_TYPE_LABELS[resource.resource_type]}</Badge>
        <Badge tone="neutral">{SOURCE_TYPE_LABELS[resource.source_type]}</Badge>
        {events.map((event) => (
          <Badge key={event.id} tone={event.event_type === "exam" ? "danger" : "success"}>
            {event.event_type === "exam" ? "למבחן" : "להגשה"}: {event.title}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-neutral-400">
        <span className="ltr-nums">נוסף: {formatDate(resource.created_at)}</span>
        {resourceDate && <span className="ltr-nums">תאריך החומר: {resourceDate}</span>}
      </div>

      <div className="flex items-center justify-between pt-1">
        {canOpen ? (
          <a
            href={resource.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
          >
            פתח חומר ↗
          </a>
        ) : (
          <span className="text-sm text-red-500">קישור לא תקין</span>
        )}
        <ReportButton resourceId={resource.id} />
      </div>
    </Card>
  );
}
