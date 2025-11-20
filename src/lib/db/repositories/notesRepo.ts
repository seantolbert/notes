import { openPlannerDatabase } from '@/lib/db/indexedDbClient';
import { enqueueOutbox, processOutbox } from '@/lib/db/outbox';
import type { Note, NoteRow } from '@/lib/models/note';
import { noteFromRow, noteToRow } from '@/lib/models/note';
import { getSupabaseClient } from '@/lib/supabase/client';

const STORE_NAME = 'notes';

const ensureUserId = (userId?: string) => userId ?? 'local-user'; // TODO: replace with real auth.

/**
 * Create a note locally first, then push to Supabase in the background.
 */
export async function create(note: Note, userId?: string): Promise<Note> {
  const db = await openPlannerDatabase();
  const supabase = getSupabaseClient();
  const uid = ensureUserId(userId);
  const prepared: Note = {
    ...note,
    id: note.id ?? noteToRow(note, uid).id, // ensures deterministic id generation
    userId: uid,
    tags: note.tags ?? [],
    createdAt: note.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (db) {
    await db.put(STORE_NAME, prepared);
  }

  const row = noteToRow(prepared, uid);
  if (supabase) {
    void supabase
      .from('notes')
      .insert([row])
      .catch(async () => {
        await enqueueOutbox({ table: STORE_NAME, operation: 'insert', payload: row, userId: uid });
      });
  } else {
    await enqueueOutbox({ table: STORE_NAME, operation: 'insert', payload: row, userId: uid });
  }

  return prepared;
}

/**
 * Update a note locally, then push update to Supabase.
 */
export async function update(note: Note, userId?: string): Promise<Note> {
  const db = await openPlannerDatabase();
  const supabase = getSupabaseClient();
  const uid = ensureUserId(userId);
  const prepared: Note = {
    ...note,
    userId: uid,
    tags: note.tags ?? [],
    createdAt: note.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (db && prepared.id) {
    await db.put(STORE_NAME, prepared);
  }

  if (prepared.id) {
    const row = noteToRow(prepared, uid);
    if (supabase) {
      void supabase
        .from('notes')
        .update(row)
        .eq('id', prepared.id)
        .eq('user_id', uid)
        .catch(async () => {
          await enqueueOutbox({ table: STORE_NAME, operation: 'update', payload: row, userId: uid });
        });
    } else {
      await enqueueOutbox({ table: STORE_NAME, operation: 'update', payload: row, userId: uid });
    }
  }

  return prepared;
}

/**
 * Delete a note locally, then remove from Supabase.
 */
export async function deleteNote(id: string, userId?: string): Promise<void> {
  const db = await openPlannerDatabase();
  const supabase = getSupabaseClient();
  const uid = ensureUserId(userId);

  if (db) {
    await db.delete(STORE_NAME, id);
  }

  if (supabase) {
    void supabase
      .from('notes')
      .delete()
      .eq('id', id)
      .eq('user_id', uid)
      .catch(async () => {
        await enqueueOutbox({ table: STORE_NAME, operation: 'delete', payload: { id }, userId: uid });
      });
  } else {
    await enqueueOutbox({ table: STORE_NAME, operation: 'delete', payload: { id }, userId: uid });
  }
}

/**
 * Fetch a note from local cache.
 */
export async function get(id: string): Promise<Note | null> {
  const db = await openPlannerDatabase();
  if (!db) return null;
  return (await db.get(STORE_NAME, id)) ?? null;
}

/**
 * List notes from local cache.
 */
export async function list(): Promise<Note[]> {
  const db = await openPlannerDatabase();
  if (!db) return [];
  return db.getAll(STORE_NAME);
}

/**
 * Pull latest notes from Supabase and merge into IndexedDB.
 * Newer updated_at wins.
 */
export async function sync(userId?: string): Promise<void> {
  const db = await openPlannerDatabase();
  if (!db) return;
  const supabase = getSupabaseClient();
  const uid = ensureUserId(userId);

  if (!supabase) return;
  await processOutbox(STORE_NAME, async (entry) => {
    if (!supabase) return;
    if (entry.operation === 'delete') {
      await supabase.from('notes').delete().eq('id', entry.payload.id as string).eq('user_id', uid);
    } else if (entry.operation === 'insert') {
      await supabase.from('notes').insert([entry.payload]);
    } else if (entry.operation === 'update') {
      await supabase.from('notes').update(entry.payload).eq('id', entry.payload.id as string).eq('user_id', uid);
    }
  });

  const { data, error } = await supabase.from('notes').select('*').eq('user_id', uid);
  if (error || !data) return;

  for (const row of data as NoteRow[]) {
    const remote = noteFromRow(row);
    const local = await db.get(STORE_NAME, remote.id!);
    const localUpdated = local?.updatedAt ? new Date(local.updatedAt).getTime() : 0;
    const remoteUpdated = remote.updatedAt ? new Date(remote.updatedAt).getTime() : 0;
    if (!local || remoteUpdated > localUpdated) {
      await db.put(STORE_NAME, remote);
    }
  }
}
