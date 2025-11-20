import { createId } from '@/lib/utils/ids';

/**
 * Flexible note content that can be plain text today and JSON-based rich text later.
 * Keep this serializable so it can live in Supabase (jsonb) and IndexedDB.
 */
export type NoteContent = Record<string, unknown> | string | null;

/**
 * Unified Note domain model used by the app.
 * Dates are stored as ISO 8601 strings for portability across storage layers.
 */
export interface Note {
  /** Stable identifier (uuid string). */
  id?: string;
  /** Owning user id for multi-tenant safety. */
  userId?: string;
  /** Short title shown in lists and cards. */
  title: string;
  /** Rich content payload; stored as jsonb in Supabase. */
  content: NoteContent;
  /** Optional excerpt/preview to speed up list rendering. */
  excerpt?: string | null;
  /** User-defined tags; always an array. */
  tags: string[];
  /** Whether the note is pinned for quick access. */
  pinned?: boolean;
  /** Created timestamp (ISO string). */
  createdAt?: string;
  /** Updated timestamp (ISO string). */
  updatedAt?: string;
}

/**
 * Shape of the Supabase `notes` row (snake_case, jsonb for content).
 */
export interface NoteRow {
  id: string;
  user_id: string;
  title: string;
  content: NoteContent;
  excerpt: string | null;
  tags: string[];
  pinned: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Convert a Supabase `notes` row into the Note domain model.
 * @param row - Raw row from Supabase (snake_case fields).
 */
export function noteFromRow(row: NoteRow): Note {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    content: row.content,
    excerpt: row.excerpt,
    tags: row.tags ?? [],
    pinned: row.pinned,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

/**
 * Convert a Note domain model into a Supabase-compatible `notes` row shape.
 * Ensures all required fields are populated and dates are ISO strings.
 * @param note - Note domain object.
 * @param userId - Owning user id (stored as user_id in the table).
 */
export function noteToRow(note: Note, userId: string): NoteRow {
  const now = new Date().toISOString();
  return {
    id: note.id ?? createId('note'),
    user_id: userId,
    title: note.title,
    content: note.content ?? null,
    excerpt: note.excerpt ?? null,
    tags: note.tags ?? [],
    pinned: note.pinned ?? false,
    created_at: note.createdAt ?? now,
    updated_at: note.updatedAt ?? now
  };
}
