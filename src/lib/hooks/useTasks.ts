'use client';

import { useCallback, useEffect, useState } from 'react';

import * as tasksRepo from '@/lib/db/repositories/tasksRepo';
import type { Task } from '@/lib/models/task';

interface UseTasksResult {
  data: Task[];
  loading: boolean;
  error: Error | null;
  create: (task: Task) => Promise<void>;
  update: (task: Task) => Promise<void>;
  delete: (id: string) => Promise<void>;
  sync: () => Promise<void>;
}

/**
 * Local-first tasks hook with background sync.
 */
export function useTasks(): UseTasksResult {
  const [data, setData] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadLocal = useCallback(async () => {
    const local = await tasksRepo.list();
    setData(local);
  }, []);

  const sync = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await tasksRepo.sync();
      await loadLocal();
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [loadLocal]);

  useEffect(() => {
    let active = true;
    (async () => {
      await loadLocal();
      if (!active) return;
      await sync();
    })();
    return () => {
      active = false;
    };
  }, [loadLocal, sync]);

  const create = useCallback(
    async (task: Task) => {
      try {
        await tasksRepo.create(task);
        await loadLocal();
      } catch (err) {
        setError(err as Error);
      }
    },
    [loadLocal]
  );

  const update = useCallback(
    async (task: Task) => {
      try {
        await tasksRepo.update(task);
        await loadLocal();
      } catch (err) {
        setError(err as Error);
      }
    },
    [loadLocal]
  );

  const remove = useCallback(
    async (id: string) => {
      try {
        await tasksRepo.deleteTask(id);
        await loadLocal();
      } catch (err) {
        setError(err as Error);
      }
    },
    [loadLocal]
  );

  return { data, loading, error, create, update, delete: remove, sync };
}
