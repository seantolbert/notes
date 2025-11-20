'use client';

import { useCallback, useEffect, useState } from 'react';

import * as notesRepo from '@/lib/db/repositories/notesRepo';
import type { Note } from '@/lib/models/note';

interface UseNotesResult {
  data: Note[];
  loading: boolean;
  error: Error | null;
  create: (note: Note) => Promise<void>;
  update: (note: Note) => Promise<void>;
  delete: (id: string) => Promise<void>;
  sync: () => Promise<void>;
}

/**
 * Local-first notes hook:
 * - Loads instantly from IndexedDB on mount.
 * - Then attempts a remote sync to refresh data.
 * - Exposes CRUD methods that write locally first.
 */
export function useNotes(): UseNotesResult {
  const [data, setData] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadLocal = useCallback(async () => {
    const local = await notesRepo.list();
    setData(local);
  }, []);

  const sync = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await notesRepo.sync();
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
    async (note: Note) => {
      try {
        await notesRepo.create(note);
        await loadLocal();
      } catch (err) {
        setError(err as Error);
      }
    },
    [loadLocal]
  );

  const update = useCallback(
    async (note: Note) => {
      try {
        await notesRepo.update(note);
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
        await notesRepo.deleteNote(id);
        await loadLocal();
      } catch (err) {
        setError(err as Error);
      }
    },
    [loadLocal]
  );

  return { data, loading, error, create, update, delete: remove, sync };
}
