import { CalendarStrip } from '@/components/calendar/CalendarStrip';
import { DayTimeline } from '@/components/calendar/DayTimeline';
import { NoteList } from '@/components/notes/NoteList';
import { TaskList } from '@/components/tasks/TaskList';
import type { Event } from '@/lib/models/event';
import type { Note } from '@/lib/models/note';
import type { Task } from '@/lib/models/task';
import { formatShortDate, toIsoDate } from '@/lib/utils/dates';

const today = new Date();
const todayIso = toIsoDate(today);

const SAMPLE_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'Capture ideas for planner',
    content: 'Draft unified planner UX and data model.',
    excerpt: 'Draft unified planner UX and data model.',
    tags: ['planning'],
    createdAt: todayIso,
    updatedAt: todayIso
  }
];

const SAMPLE_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Wire placeholder pages',
    status: 'pending',
    createdAt: todayIso,
    updatedAt: todayIso
  }
];

const SAMPLE_EVENTS: Event[] = [
  {
    id: 'event-1',
    title: 'Plan architecture',
    description: 'Sketch schema for notes, tasks, and calendar.',
    start: `${todayIso}T09:00:00.000Z`,
    end: `${todayIso}T10:00:00.000Z`,
    createdAt: todayIso,
    updatedAt: todayIso
  }
];

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Today</h2>
        <p className="text-sm text-muted-foreground">
          Placeholder overview for {formatShortDate(today)}. TODO: replace with live plan summary.
        </p>
        <CalendarStrip days={[{ date: todayIso, events: SAMPLE_EVENTS }]} />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Notes</h3>
          <p className="text-xs text-muted-foreground">Unify quick scratch pad and daily pages</p>
        </div>
        <NoteList notes={SAMPLE_NOTES} />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Tasks</h3>
          <p className="text-xs text-muted-foreground">TODO: pull from inbox and daily focus</p>
        </div>
        <TaskList tasks={SAMPLE_TASKS} />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Schedule</h3>
          <p className="text-xs text-muted-foreground">Upcoming events for the day</p>
        </div>
        <DayTimeline events={SAMPLE_EVENTS} />
      </section>
    </div>
  );
}
