'use client';

import type { Event } from '@/lib/models/event';

interface CalendarStripProps {
  days: { date: string; events?: Event[] }[];
  onSelectDay?: (date: string) => void;
}

export function CalendarStrip({ days, onSelectDay }: CalendarStripProps) {
  return (
    <div className="grid grid-cols-7 gap-2 rounded-lg border border-border p-3 text-center text-sm">
      {days.map((day) => (
        <button
          key={day.date}
          className="rounded-md bg-muted/40 p-2 transition hover:bg-muted"
          onClick={() => onSelectDay?.(day.date)}
          type="button"
        >
          <p className="font-semibold">{new Date(day.date).toLocaleDateString()}</p>
          <p className="text-xs text-muted-foreground">{day.events?.length ?? 0} events</p>
        </button>
      ))}
    </div>
  );
}
