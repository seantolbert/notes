'use client';

import { useCallback, useEffect, useState } from 'react';

import * as dailyPagesRepo from '@/lib/db/repositories/dailyPagesRepo';
import type { DailyPage } from '@/lib/models/dailyPage';
import { getToday } from '@/lib/utils/dates';

interface UseDailyPageResult {
  data: DailyPage | null;
  loading: boolean;
  error: Error | null;
  create: (page: DailyPage) => Promise<void>;
  update: (page: DailyPage) => Promise<void>;
  delete: (id: string) => Promise<void>;
  sync: () => Promise<void>;
}

/**
 * Hook for a single day's page with local-first fetch and sync.
 */
export function useDailyPage(targetDate: string = getToday()): UseDailyPageResult {
  const [data, setData] = useState<DailyPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadLocal = useCallback(async () => {
    const pages = await dailyPagesRepo.list();
    const match = pages.find((p) => p.date === targetDate) ?? null;
    setData(match);
  }, [targetDate]);

  const sync = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await dailyPagesRepo.sync();
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
    async (page: DailyPage) => {
      try {
        await dailyPagesRepo.create(page);
        await loadLocal();
      } catch (err) {
        setError(err as Error);
      }
    },
    [loadLocal]
  );

  const update = useCallback(
    async (page: DailyPage) => {
      try {
        await dailyPagesRepo.update(page);
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
        await dailyPagesRepo.deleteDailyPage(id);
        await loadLocal();
      } catch (err) {
        setError(err as Error);
      }
    },
    [loadLocal]
  );

  return { data, loading, error, create, update, delete: remove, sync };
}
