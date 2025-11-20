import { EventCard } from '@/components/calendar/EventCard';
import type { Event } from '@/lib/models/event';

interface DayTimelineProps {
  events: Event[];
}

export function DayTimeline({ events }: DayTimelineProps) {
  if (!events.length) {
    return (
      <div className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
        No events scheduled. TODO: source calendar data.
      </div>
    );
  }

  const sorted = [...events].sort((a, b) => a.startAt.localeCompare(b.startAt));

  return (
    <div className="space-y-2">
      {sorted.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
