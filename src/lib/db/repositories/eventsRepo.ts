import { openPlannerDatabase } from '@/lib/db/indexedDbClient';
import { enqueueOutbox, processOutbox } from '@/lib/db/outbox';
import type { Event, EventRow } from '@/lib/models/event';
import { eventFromRow, eventToRow } from '@/lib/models/event';
import { getSupabaseClient } from '@/lib/supabase/client';

const STORE_NAME = 'events';
const ensureUserId = (userId?: string) => userId ?? 'local-user'; // TODO: replace with authenticated user id.

/**
 * Create an event locally, then insert to Supabase.
 */
export async function create(event: Event, userId?: string): Promise<Event> {
  const db = await openPlannerDatabase();
  const supabase = getSupabaseClient();
  const uid = ensureUserId(userId);
  const prepared: Event = {
    ...event,
    id: event.id ?? eventToRow(event, uid).id,
    userId: uid,
    tags: event.tags ?? [],
    createdAt: event.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (db) {
    await db.put(STORE_NAME, prepared);
  }

  const row = eventToRow(prepared, uid);
  if (supabase) {
    try {
      const { error } = await supabase.from('events').insert([row]);
      if (error) throw error;
    } catch {
      await enqueueOutbox({
        table: STORE_NAME,
        operation: 'insert',
        payload: row,
        userId: uid
      });
    }
  } else {
    await enqueueOutbox({
      table: STORE_NAME,
      operation: 'insert',
      payload: row,
      userId: uid
    });
  }

  return prepared;
}

/**
 * Update an event locally, then push to Supabase.
 */
export async function update(event: Event, userId?: string): Promise<Event> {
  const db = await openPlannerDatabase();
  const supabase = getSupabaseClient();
  const uid = ensureUserId(userId);
  const prepared: Event = {
    ...event,
    userId: uid,
    tags: event.tags ?? [],
    createdAt: event.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (db && prepared.id) {
    await db.put(STORE_NAME, prepared);
  }

  if (prepared.id) {
    const row = eventToRow(prepared, uid);
    if (supabase) {
      try {
        const { error } = await supabase
          .from('events')
          .update(row)
          .eq('id', prepared.id)
          .eq('user_id', uid);
        if (error) throw error;
      } catch {
        await enqueueOutbox({
          table: STORE_NAME,
          operation: 'update',
          payload: row,
          userId: uid
        });
      }
    } else {
      await enqueueOutbox({
        table: STORE_NAME,
        operation: 'update',
        payload: row,
        userId: uid
      });
    }
  }

  return prepared;
}

/**
 * Delete an event locally and remotely.
 */
export async function deleteEvent(id: string, userId?: string): Promise<void> {
  const db = await openPlannerDatabase();
  const supabase = getSupabaseClient();
  const uid = ensureUserId(userId);

  if (db) {
    await db.delete(STORE_NAME, id);
  }

  if (supabase) {
    try {
      const { error } = await supabase.from('events').delete().eq('id', id).eq('user_id', uid);
      if (error) throw error;
    } catch {
      await enqueueOutbox({
        table: STORE_NAME,
        operation: 'delete',
        payload: { id },
        userId: uid
      });
    }
  } else {
    await enqueueOutbox({
        table: STORE_NAME,
        operation: 'delete',
        payload: { id },
        userId: uid
      });
    }
}

/**
 * Get an event from the local cache.
 */
export async function get(id: string): Promise<Event | null> {
  const db = await openPlannerDatabase();
  if (!db) return null;
  return (await db.get(STORE_NAME, id)) ?? null;
}

/**
 * List events from the local cache.
 */
export async function list(): Promise<Event[]> {
  const db = await openPlannerDatabase();
  if (!db) return [];
  return db.getAll(STORE_NAME);
}

/**
 * Pull latest events from Supabase and merge into IndexedDB with last-write-wins semantics.
 */
export async function sync(userId?: string): Promise<void> {
  const db = await openPlannerDatabase();
  if (!db) return;
  const supabase = getSupabaseClient();
  const uid = ensureUserId(userId);

  if (!supabase) return;
  await processOutbox(STORE_NAME, async (entry) => {
    if (!supabase) return;
    const payload = entry.payload as { id?: string };
    if (entry.operation === 'delete' && payload.id) {
      await supabase.from('events').delete().eq('id', payload.id).eq('user_id', uid);
    } else if (entry.operation === 'insert') {
      await supabase.from('events').insert([entry.payload]);
    } else if (entry.operation === 'update' && payload.id) {
      await supabase.from('events').update(entry.payload).eq('id', payload.id).eq('user_id', uid);
    }
  });

  const { data, error } = await supabase.from('events').select('*').eq('user_id', uid);
  if (error || !data) return;

  for (const row of data as EventRow[]) {
    const remote = eventFromRow(row);
    const local = await db.get(STORE_NAME, remote.id!);
    const localUpdated = local?.updatedAt ? new Date(local.updatedAt).getTime() : 0;
    const remoteUpdated = remote.updatedAt ? new Date(remote.updatedAt).getTime() : 0;
    if (!local || remoteUpdated > localUpdated) {
      await db.put(STORE_NAME, remote);
    }
  }
}
