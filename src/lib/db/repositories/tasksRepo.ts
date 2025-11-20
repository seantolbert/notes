import { openPlannerDatabase } from '@/lib/db/indexedDbClient';
import { enqueueOutbox, processOutbox } from '@/lib/db/outbox';
import type { Task, TaskRow } from '@/lib/models/task';
import { taskFromRow, taskToRow } from '@/lib/models/task';
import { getSupabaseClient } from '@/lib/supabase/client';

const STORE_NAME = 'tasks';
const ensureUserId = (userId?: string) => userId ?? 'local-user'; // TODO: replace with real auth provider.

/**
 * Create a task locally first, then push to Supabase.
 */
export async function create(task: Task, userId?: string): Promise<Task> {
  const db = await openPlannerDatabase();
  const supabase = getSupabaseClient();
  const uid = ensureUserId(userId);
  const prepared: Task = {
    ...task,
    id: task.id ?? taskToRow(task, uid).id,
    userId: uid,
    tags: task.tags ?? [],
    createdAt: task.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (db) {
    await db.put(STORE_NAME, prepared);
  }

  const row = taskToRow(prepared, uid);
  if (supabase) {
    try {
      const { error } = await supabase.from('tasks').insert([row]);
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
 * Update a task locally and then push upstream.
 */
export async function update(task: Task, userId?: string): Promise<Task> {
  const db = await openPlannerDatabase();
  const supabase = getSupabaseClient();
  const uid = ensureUserId(userId);
  const prepared: Task = {
    ...task,
    userId: uid,
    tags: task.tags ?? [],
    createdAt: task.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (db && prepared.id) {
    await db.put(STORE_NAME, prepared);
  }

  if (prepared.id) {
    const row = taskToRow(prepared, uid);
    if (supabase) {
      try {
        const { error } = await supabase
          .from('tasks')
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
 * Delete a task locally and upstream.
 */
export async function deleteTask(id: string, userId?: string): Promise<void> {
  const db = await openPlannerDatabase();
  const supabase = getSupabaseClient();
  const uid = ensureUserId(userId);

  if (db) {
    await db.delete(STORE_NAME, id);
  }

  if (supabase) {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id).eq('user_id', uid);
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
 * Fetch a task from local cache.
 */
export async function get(id: string): Promise<Task | null> {
  const db = await openPlannerDatabase();
  if (!db) return null;
  return (await db.get(STORE_NAME, id)) ?? null;
}

/**
 * List tasks from local cache.
 */
export async function list(): Promise<Task[]> {
  const db = await openPlannerDatabase();
  if (!db) return [];
  return db.getAll(STORE_NAME);
}

/**
 * Pull latest tasks from Supabase and merge into IndexedDB with last-write-wins.
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
      await supabase.from('tasks').delete().eq('id', payload.id).eq('user_id', uid);
    } else if (entry.operation === 'insert') {
      await supabase.from('tasks').insert([entry.payload]);
    } else if (entry.operation === 'update' && payload.id) {
      await supabase.from('tasks').update(entry.payload).eq('id', payload.id).eq('user_id', uid);
    }
  });

  const { data, error } = await supabase.from('tasks').select('*').eq('user_id', uid);
  if (error || !data) return;

  for (const row of data as TaskRow[]) {
    const remote = taskFromRow(row);
    const local = await db.get(STORE_NAME, remote.id!);
    const localUpdated = local?.updatedAt ? new Date(local.updatedAt).getTime() : 0;
    const remoteUpdated = remote.updatedAt ? new Date(remote.updatedAt).getTime() : 0;
    if (!local || remoteUpdated > localUpdated) {
      await db.put(STORE_NAME, remote);
    }
  }
}
