import { EventCard } from "@/components/class/event-card";
import type { EventWithResources } from "@/lib/types";

export function EventDetail({ event }: { event: EventWithResources }) {
  return (
    <div className="flex flex-col gap-2">
      <EventCard event={event} />
      {event.resources.length > 0 && (
        <div className="mr-2 flex flex-wrap gap-1.5 text-xs text-neutral-500">
          <span>חומרים קשורים:</span>
          {event.resources.map((resource) => (
            <a
              key={resource.id}
              href={resource.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 hover:text-neutral-800 hover:underline"
            >
              {resource.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
