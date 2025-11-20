'use client';

import { useCallback, useEffect, useState } from 'react';

import * as eventsRepo from '@/lib/db/repositories/eventsRepo';
import type { Event } from '@/lib/models/event';

interface UseEventsResult {
  data: Event[];
  loading: boolean;
  error: Error | null;
  create: (event: Event) => Promise<void>;
  update: (event: Event) => Promise<void>;
  delete: (id: string) => Promise<void>;
  sync: () => Promise<void>;
}

/**
 * Local-first events hook with Supabase sync fallback.
 */
export function useEvents(): UseEventsResult {
  const [data, setData] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadLocal = useCallback(async () => {
    const local = await eventsRepo.list();
    setData(local);
  }, []);

  const sync = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await eventsRepo.sync();
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
    async (event: Event) => {
      try {
        await eventsRepo.create(event);
        await loadLocal();
      } catch (err) {
        setError(err as Error);
      }
    },
    [loadLocal]
  );

  const update = useCallback(
    async (event: Event) => {
      try {
        await eventsRepo.update(event);
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
        await eventsRepo.deleteEvent(id);
        await loadLocal();
      } catch (err) {
        setError(err as Error);
      }
    },
    [loadLocal]
  );

  return { data, loading, error, create, update, delete: remove, sync };
}
