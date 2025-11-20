import { createId } from '@/lib/utils/ids';

/**
 * Event domain model representing a scheduled block.
 * Uses ISO strings for times to keep parity with Supabase timestamptz.
 */
export interface Event {
  /** Stable identifier (uuid string). */
  id?: string;
  /** Owning user id for multi-tenant separation. */
  userId?: string;
  /** Event title shown on strip and timeline. */
  title: string;
  /** Optional description/agenda. */
  description?: string | null;
  /** Start time (ISO timestamptz). */
  startAt: string;
  /** End time (ISO timestamptz). */
  endAt: string;
  /** Optional location string. */
  location?: string | null;
  /** Tags for filtering and linking. */
  tags: string[];
  /** Optional related note id for meeting notes. */
  relatedNoteId?: string | null;
  /** Created timestamp (ISO). */
  createdAt?: string;
  /** Updated timestamp (ISO). */
  updatedAt?: string;
}

/**
 * Shape of the Supabase `events` row (snake_case).
 */
export interface EventRow {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  start_at: string;
  end_at: string;
  location: string | null;
  tags: string[];
  related_note_id: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Convert a Supabase `events` row into an Event domain model.
 * @param row - Raw row from Supabase (snake_case).
 */
export function eventFromRow(row: EventRow): Event {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description,
    startAt: row.start_at,
    endAt: row.end_at,
    location: row.location,
    tags: row.tags ?? [],
    relatedNoteId: row.related_note_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

/**
 * Convert an Event domain model into a Supabase-compatible `events` row.
 * @param event - Event domain object.
 * @param userId - Owning user id (stored as user_id).
 */
export function eventToRow(event: Event, userId: string): EventRow {
  const now = new Date().toISOString();
  return {
    id: event.id ?? createId('event'),
    user_id: userId,
    title: event.title,
    description: event.description ?? null,
    start_at: event.startAt,
    end_at: event.endAt,
    location: event.location ?? null,
    tags: event.tags ?? [],
    related_note_id: event.relatedNoteId ?? null,
    created_at: event.createdAt ?? now,
    updated_at: event.updatedAt ?? now
  };
}
