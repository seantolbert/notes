import { openPlannerDatabase } from '@/lib/db/indexedDbClient';
import { enqueueOutbox, processOutbox } from '@/lib/db/outbox';
import type { DailyPage, DailyPageRow } from '@/lib/models/dailyPage';
import { dailyPageFromRow, dailyPageToRow } from '@/lib/models/dailyPage';
import { getSupabaseClient } from '@/lib/supabase/client';

const STORE_NAME = 'dailyPages';
const ensureUserId = (userId?: string) => userId ?? 'local-user'; // TODO: swap with authenticated user.

/**
 * Create a daily page locally first, then insert to Supabase.
 */
export async function create(page: DailyPage, userId?: string): Promise<DailyPage> {
  const db = await openPlannerDatabase();
  const supabase = getSupabaseClient();
  const uid = ensureUserId(userId);
  const prepared: DailyPage = {
    ...page,
    id: page.id ?? dailyPageToRow(page, uid).id,
    userId: uid,
    taskIds: page.taskIds ?? [],
    createdAt: page.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (db) {
    await db.put(STORE_NAME, prepared);
  }

  const row = dailyPageToRow(prepared, uid);
  if (supabase) {
    void supabase
      .from('daily_pages')
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
 * Update a daily page locally, then push upstream.
 */
export async function update(page: DailyPage, userId?: string): Promise<DailyPage> {
  const db = await openPlannerDatabase();
  const supabase = getSupabaseClient();
  const uid = ensureUserId(userId);
  const prepared: DailyPage = {
    ...page,
    userId: uid,
    taskIds: page.taskIds ?? [],
    createdAt: page.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (db && prepared.id) {
    await db.put(STORE_NAME, prepared);
  }

  if (prepared.id) {
    const row = dailyPageToRow(prepared, uid);
    if (supabase) {
      void supabase
        .from('daily_pages')
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
 * Delete a daily page locally and remotely.
 */
export async function deleteDailyPage(id: string, userId?: string): Promise<void> {
  const db = await openPlannerDatabase();
  const supabase = getSupabaseClient();
  const uid = ensureUserId(userId);

  if (db) {
    await db.delete(STORE_NAME, id);
  }

  if (supabase) {
    void supabase
      .from('daily_pages')
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
 * Get a daily page from the local cache.
 */
export async function get(id: string): Promise<DailyPage | null> {
  const db = await openPlannerDatabase();
  if (!db) return null;
  return (await db.get(STORE_NAME, id)) ?? null;
}

/**
 * List daily pages from the local cache.
 */
export async function list(): Promise<DailyPage[]> {
  const db = await openPlannerDatabase();
  if (!db) return [];
  return db.getAll(STORE_NAME);
}

/**
 * Pull remote daily pages and merge into IndexedDB using updated_at for conflict resolution.
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
      await supabase.from('daily_pages').delete().eq('id', entry.payload.id as string).eq('user_id', uid);
    } else if (entry.operation === 'insert') {
      await supabase.from('daily_pages').insert([entry.payload]);
    } else if (entry.operation === 'update') {
      await supabase.from('daily_pages').update(entry.payload).eq('id', entry.payload.id as string).eq('user_id', uid);
    }
  });

  const { data, error } = await supabase.from('daily_pages').select('*').eq('user_id', uid);
  if (error || !data) return;

  for (const row of data as DailyPageRow[]) {
    const remote = dailyPageFromRow(row);
    const local = await db.get(STORE_NAME, remote.id!);
    const localUpdated = local?.updatedAt ? new Date(local.updatedAt).getTime() : 0;
    const remoteUpdated = remote.updatedAt ? new Date(remote.updatedAt).getTime() : 0;
    if (!local || remoteUpdated > localUpdated) {
      await db.put(STORE_NAME, remote);
    }
  }
}
