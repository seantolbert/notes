import type { Event } from '@/lib/models/event';
import type { Note } from '@/lib/models/note';
import type { Task } from '@/lib/models/task';
import { listEvents } from '@/lib/db/repositories/eventsRepo';
import { listNotes } from '@/lib/db/repositories/notesRepo';
import { listTasks } from '@/lib/db/repositories/tasksRepo';

export interface TodayPlan {
  notes: Note[];
  tasks: Task[];
  events: Event[];
}

export async function loadTodayPlan(): Promise<TodayPlan> {
  // TODO: scope to the active date and merge timeline logic.
  const [notes, tasks, events] = await Promise.all([listNotes(), listTasks(), listEvents()]);
  return { notes, tasks, events };
}
