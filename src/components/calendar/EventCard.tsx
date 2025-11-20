import type { Event } from '@/lib/models/event';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <article className="rounded-lg border border-border p-3">
      <h3 className="text-sm font-semibold">{event.title}</h3>
      <p className="text-xs text-muted-foreground">
        {event.startAt} – {event.endAt}
      </p>
      {event.location ? <p className="text-xs text-muted-foreground">Location: {event.location}</p> : null}
      {event.description ? <p className="text-sm">{event.description}</p> : null}
    </article>
  );
}
