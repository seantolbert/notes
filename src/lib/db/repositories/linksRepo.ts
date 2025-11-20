import { openPlannerDatabase } from '@/lib/db/indexedDbClient';
import { enqueueOutbox, processOutbox } from '@/lib/db/outbox';
import type { Link, LinkRow } from '@/lib/models/link';
import { linkFromRow, linkToRow } from '@/lib/models/link';
import { getSupabaseClient } from '@/lib/supabase/client';

const STORE_NAME = 'links';
const ensureUserId = (userId?: string) => userId ?? 'local-user'; // TODO: swap with authenticated user context.

/**
 * Create a link locally, then push upstream.
 */
export async function create(link: Link, userId?: string): Promise<Link> {
  const db = await openPlannerDatabase();
  const supabase = getSupabaseClient();
  const uid = ensureUserId(userId);
  const prepared: Link = {
    ...link,
    id: link.id ?? linkToRow(link, uid).id,
    userId: uid,
    createdAt: link.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (db) {
    await db.put(STORE_NAME, prepared);
  }

  const row = linkToRow(prepared, uid);
  if (supabase) {
    void supabase
      .from('links')
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
 * Update a link locally and push changes upstream.
 */
export async function update(link: Link, userId?: string): Promise<Link> {
  const db = await openPlannerDatabase();
  const supabase = getSupabaseClient();
  const uid = ensureUserId(userId);
  const prepared: Link = {
    ...link,
    userId: uid,
    createdAt: link.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (db && prepared.id) {
    await db.put(STORE_NAME, prepared);
  }

  if (prepared.id) {
    const row = linkToRow(prepared, uid);
    if (supabase) {
      void supabase
        .from('links')
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
 * Delete a link locally and remotely.
 */
export async function deleteLink(id: string, userId?: string): Promise<void> {
  const db = await openPlannerDatabase();
  const supabase = getSupabaseClient();
  const uid = ensureUserId(userId);

  if (db) {
    await db.delete(STORE_NAME, id);
  }

  if (supabase) {
    void supabase
      .from('links')
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
 * Fetch a link from local cache.
 */
export async function get(id: string): Promise<Link | null> {
  const db = await openPlannerDatabase();
  if (!db) return null;
  return (await db.get(STORE_NAME, id)) ?? null;
}

/**
 * List links from local cache.
 */
export async function list(): Promise<Link[]> {
  const db = await openPlannerDatabase();
  if (!db) return [];
  return db.getAll(STORE_NAME);
}

/**
 * Pull remote link changes and merge into IndexedDB.
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
      await supabase.from('links').delete().eq('id', entry.payload.id as string).eq('user_id', uid);
    } else if (entry.operation === 'insert') {
      await supabase.from('links').insert([entry.payload]);
    } else if (entry.operation === 'update') {
      await supabase.from('links').update(entry.payload).eq('id', entry.payload.id as string).eq('user_id', uid);
    }
  });

  const { data, error } = await supabase.from('links').select('*').eq('user_id', uid);
  if (error || !data) return;

  for (const row of data as LinkRow[]) {
    const remote = linkFromRow(row);
    const local = await db.get(STORE_NAME, remote.id!);
    const localUpdated = local?.updatedAt ? new Date(local.updatedAt).getTime() : 0;
    const remoteUpdated = remote.updatedAt ? new Date(remote.updatedAt).getTime() : 0;
    if (!local || remoteUpdated > localUpdated) {
      await db.put(STORE_NAME, remote);
    }
  }
}
