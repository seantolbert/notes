'use client';

import { useEffect, useState } from 'react';

import type { Note } from '@/lib/models/note';
import { listNotes } from '@/lib/db/repositories/notesRepo';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    void refresh();
  }, []);

  const refresh = async () => {
    const data = await listNotes();
    setNotes(data);
  };

  return { notes, refresh };
}
