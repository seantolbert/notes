'use client';

import { useCallback, useEffect, useState } from 'react';

import * as eventsRepo from '@/lib/db/repositories/eventsRepo';
import * as notesRepo from '@/lib/db/repositories/notesRepo';
import * as tasksRepo from '@/lib/db/repositories/tasksRepo';
import type { Event } from '@/lib/models/event';
import type { Note } from '@/lib/models/note';
import type { Task } from '@/lib/models/task';
import { getToday } from '@/lib/utils/dates';

export interface TodayPlan {
  date: string;
  tasks: Task[];
  events: Event[];
  notes: Note[];
}

type PlanEntity =
  | { type: 'task'; data: Task }
  | { type: 'event'; data: Event }
  | { type: 'note'; data: Note };

interface UseTodayPlanResult {
  data: TodayPlan;
  loading: boolean;
  error: Error | null;
  create: (entity: PlanEntity) => Promise<void>;
  update: (entity: PlanEntity) => Promise<void>;
  delete: (entity: { type: PlanEntity['type']; id: string }) => Promise<void>;
  sync: () => Promise<void>;
}

/**
 * Aggregates today's tasks, events, and relevant notes via local-first fetch + sync.
 * Notes are included if they were created today (simple heuristic for now).
 */
export function useTodayPlan(): UseTodayPlanResult {
  const [data, setData] = useState<TodayPlan>({ date: getToday(), tasks: [], events: [], notes: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const today = getToday();

  const computePlan = useCallback(async () => {
    const [tasks, events, notes] = await Promise.all([tasksRepo.list(), eventsRepo.list(), notesRepo.list()]);
    const dayTasks = tasks.filter((t) => (t.dueAt ? t.dueAt.slice(0, 10) === today : true)); // include floating tasks
    const dayEvents = events.filter((e) => e.startAt.slice(0, 10) === today);
    const dayNotes = notes.filter((n) => (n.createdAt ? n.createdAt.slice(0, 10) === today : false));
    setData({ date: today, tasks: dayTasks, events: dayEvents, notes: dayNotes });
  }, [today]);

  const sync = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([tasksRepo.sync(), eventsRepo.sync(), notesRepo.sync()]);
      await computePlan();
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [computePlan]);

  useEffect(() => {
    let active = true;
    (async () => {
      await computePlan();
      if (!active) return;
      await sync();
    })();
    return () => {
      active = false;
    };
  }, [computePlan, sync]);

  const create = useCallback(
    async (entity: PlanEntity) => {
      try {
        if (entity.type === 'task') {
          await tasksRepo.create(entity.data);
        } else if (entity.type === 'event') {
          await eventsRepo.create(entity.data);
        } else {
          await notesRepo.create(entity.data);
        }
        await computePlan();
      } catch (err) {
        setError(err as Error);
      }
    },
    [computePlan]
  );

  const update = useCallback(
    async (entity: PlanEntity) => {
      try {
        if (entity.type === 'task') {
          await tasksRepo.update(entity.data);
        } else if (entity.type === 'event') {
          await eventsRepo.update(entity.data);
        } else {
          await notesRepo.update(entity.data);
        }
        await computePlan();
      } catch (err) {
        setError(err as Error);
      }
    },
    [computePlan]
  );

  const remove = useCallback(
    async (entity: { type: PlanEntity['type']; id: string }) => {
      try {
        if (entity.type === 'task') {
          await tasksRepo.deleteTask(entity.id);
        } else if (entity.type === 'event') {
          await eventsRepo.deleteEvent(entity.id);
        } else {
          await notesRepo.deleteNote(entity.id);
        }
        await computePlan();
      } catch (err) {
        setError(err as Error);
      }
    },
    [computePlan]
  );

  return { data, loading, error, create, update, delete: remove, sync };
}
