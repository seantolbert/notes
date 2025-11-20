import { createId } from '@/lib/utils/ids';

/** Allowed task statuses. */
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

/**
 * Task domain model used across UI and storage layers.
 * All timestamps are ISO strings; tags is always an array.
 */
export interface Task {
  /** Stable identifier (uuid string). */
  id?: string;
  /** Owning user id for multi-tenant isolation. */
  userId?: string;
  /** Short task title. */
  title: string;
  /** Longer description/notes. */
  description?: string | null;
  /** Status flag for workflows. */
  status: TaskStatus;
  /** Optional due date/time as ISO string (timestamptz). */
  dueAt?: string | null;
  /** Tags for filtering and grouping. */
  tags: string[];
  /** Optional link to a note for context. */
  noteId?: string | null;
  /** Created timestamp (ISO). */
  createdAt?: string;
  /** Updated timestamp (ISO). */
  updatedAt?: string;
}

/**
 * Shape of the Supabase `tasks` row (snake_case).
 */
export interface TaskRow {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  due_at: string | null;
  tags: string[];
  note_id: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Convert a Supabase `tasks` row into a Task domain model.
 * @param row - Raw row from Supabase (snake_case).
 */
export function taskFromRow(row: TaskRow): Task {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description,
    status: row.status,
    dueAt: row.due_at,
    tags: row.tags ?? [],
    noteId: row.note_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

/**
 * Convert a Task domain model into a Supabase-compatible `tasks` row.
 * Ensures ISO timestamps and default values where necessary.
 * @param task - Task domain object.
 * @param userId - Owning user id (stored as user_id).
 */
export function taskToRow(task: Task, userId: string): TaskRow {
  const now = new Date().toISOString();
  return {
    id: task.id ?? createId('task'),
    user_id: userId,
    title: task.title,
    description: task.description ?? null,
    status: task.status,
    due_at: task.dueAt ?? null,
    tags: task.tags ?? [],
    note_id: task.noteId ?? null,
    created_at: task.createdAt ?? now,
    updated_at: task.updatedAt ?? now
  };
}
