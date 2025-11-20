import { openPlannerDatabase } from '@/lib/db/indexedDbClient';
import { createId } from '@/lib/utils/ids';

export type OutboxOperation = 'insert' | 'update' | 'delete';

/**
 * Outbox entry persisted locally until it is successfully sent to Supabase.
 */
export interface OutboxEntry {
  id: string;
  table: string;
  operation: OutboxOperation;
  userId: string;
  payload: Record<string, unknown>;
  updatedAt: string;
}

/**
 * Queue an outbox entry for later delivery.
 */
export async function enqueueOutbox(entry: Omit<OutboxEntry, 'id' | 'updatedAt'>): Promise<void> {
  const db = await openPlannerDatabase();
  if (!db) return;
  const now = new Date().toISOString();
  const record: OutboxEntry = { ...entry, id: createId('outbox'), updatedAt: now };
  await db.put('outbox', record);
}

/**
 * Drain outbox entries for a table, applying the provided sender fn.
 * Removes entries that complete without throwing.
 */
export async function processOutbox(
  table: string,
  sender: (entry: OutboxEntry) => Promise<void>
): Promise<void> {
  const db = await openPlannerDatabase();
  if (!db) return;
  const entries = await db.getAll('outbox');
  const relevant = entries.filter((e) => e.table === table);

  for (const entry of relevant) {
    try {
      await sender(entry);
      await db.delete('outbox', entry.id);
    } catch {
      // Keep the outbox entry so a future sync can retry.
    }
  }
}
