import { CalendarStrip } from '@/components/calendar/CalendarStrip';
import { DayTimeline } from '@/components/calendar/DayTimeline';
import type { Event } from '@/lib/models/event';
import { formatShortDate, toIsoDate } from '@/lib/utils/dates';

const today = new Date();
const todayIso = toIsoDate(today);

const SAMPLE_EVENTS: Event[] = [
  {
    id: 'event-2',
    title: 'Inbox triage',
    startAt: `${todayIso}T12:00:00.000Z`,
    endAt: `${todayIso}T12:30:00.000Z`,
    tags: [],
    description: 'Sort captured notes and tasks.'
  }
];

export default function CalendarPage() {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Calendar</h2>
        <p className="text-sm text-muted-foreground">
          TODO: use real events and let the user jump days. Showing {formatShortDate(today)}.
        </p>
      </div>

      <CalendarStrip days={[{ date: todayIso, events: SAMPLE_EVENTS }]} />
      <DayTimeline events={SAMPLE_EVENTS} />
    </div>
  );
}
