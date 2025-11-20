'use client';

import { useCallback, useEffect, useState } from 'react';

import * as linksRepo from '@/lib/db/repositories/linksRepo';
import type { Link } from '@/lib/models/link';

interface UseLinksResult {
  data: Link[];
  loading: boolean;
  error: Error | null;
  create: (link: Link) => Promise<void>;
  update: (link: Link) => Promise<void>;
  delete: (id: string) => Promise<void>;
  sync: () => Promise<void>;
}

/**
 * Local-first links hook, useful for backlink-aware UIs.
 */
export function useLinks(): UseLinksResult {
  const [data, setData] = useState<Link[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadLocal = useCallback(async () => {
    const local = await linksRepo.list();
    setData(local);
  }, []);

  const sync = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await linksRepo.sync();
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
    async (link: Link) => {
      try {
        await linksRepo.create(link);
        await loadLocal();
      } catch (err) {
        setError(err as Error);
      }
    },
    [loadLocal]
  );

  const update = useCallback(
    async (link: Link) => {
      try {
        await linksRepo.update(link);
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
        await linksRepo.deleteLink(id);
        await loadLocal();
      } catch (err) {
        setError(err as Error);
      }
    },
    [loadLocal]
  );

  return { data, loading, error, create, update, delete: remove, sync };
}
