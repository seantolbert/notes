import { createId } from '@/lib/utils/ids';

/**
 * Daily page model for journaling + plan overview.
 * The `date` is stored as YYYY-MM-DD to align with Supabase `date` columns.
 */
export interface DailyPage {
  /** Stable identifier (uuid string). */
  id?: string;
  /** Owning user id. */
  userId?: string;
  /** Calendar day (YYYY-MM-DD). */
  date: string;
  /** Optional reference to a detailed note for the day. */
  noteId?: string | null;
  /** Task ids associated with the day. */
  taskIds: string[];
  /** Optional summary or highlights for the day. */
  summary?: string | null;
  /** Created timestamp (ISO). */
  createdAt?: string;
  /** Updated timestamp (ISO). */
  updatedAt?: string;
}

/**
 * Shape of the Supabase `daily_pages` row (snake_case).
 */
export interface DailyPageRow {
  id: string;
  user_id: string;
  date: string;
  note_id: string | null;
  task_ids: string[];
  summary: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Convert a Supabase `daily_pages` row into a DailyPage domain model.
 * @param row - Raw row from Supabase (snake_case).
 */
export function dailyPageFromRow(row: DailyPageRow): DailyPage {
  return {
    id: row.id,
    userId: row.user_id,
    date: row.date,
    noteId: row.note_id,
    taskIds: row.task_ids ?? [],
    summary: row.summary,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

/**
 * Convert a DailyPage domain model into a Supabase-compatible `daily_pages` row.
 * @param page - DailyPage domain object.
 * @param userId - Owning user id (stored as user_id).
 */
export function dailyPageToRow(page: DailyPage, userId: string): DailyPageRow {
  const now = new Date().toISOString();
  return {
    id: page.id ?? createId('daily'),
    user_id: userId,
    date: page.date,
    note_id: page.noteId ?? null,
    task_ids: page.taskIds ?? [],
    summary: page.summary ?? null,
    created_at: page.createdAt ?? now,
    updated_at: page.updatedAt ?? now
  };
}
