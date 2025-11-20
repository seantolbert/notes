import { createId } from '@/lib/utils/ids';

/** Allowed entity types for bidirectional links. */
export type LinkType = 'note' | 'task' | 'event';

/**
 * Link domain model describing relationships across entities.
 */
export interface Link {
  /** Stable identifier (uuid string). */
  id?: string;
  /** Owning user id. */
  userId?: string;
  /** Source entity id (uuid). */
  sourceId: string;
  /** Source entity type. */
  sourceType: LinkType;
  /** Target entity id (uuid). */
  targetId: string;
  /** Target entity type. */
  targetType: LinkType;
  /** Optional context for the link (e.g., selection). */
  context?: string | null;
  /** Created timestamp (ISO). */
  createdAt?: string;
  /** Updated timestamp (ISO). */
  updatedAt?: string;
}

/**
 * Shape of the Supabase `links` row (snake_case).
 */
export interface LinkRow {
  id: string;
  user_id: string;
  source_id: string;
  source_type: LinkType;
  target_id: string;
  target_type: LinkType;
  context: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Convert a Supabase `links` row into a Link domain model.
 * @param row - Raw row from Supabase (snake_case).
 */
export function linkFromRow(row: LinkRow): Link {
  return {
    id: row.id,
    userId: row.user_id,
    sourceId: row.source_id,
    sourceType: row.source_type,
    targetId: row.target_id,
    targetType: row.target_type,
    context: row.context,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

/**
 * Convert a Link domain model into a Supabase-compatible `links` row.
 * @param link - Link domain object.
 * @param userId - Owning user id (stored as user_id).
 */
export function linkToRow(link: Link, userId: string): LinkRow {
  const now = new Date().toISOString();
  return {
    id: link.id ?? createId('link'),
    user_id: userId,
    source_id: link.sourceId,
    source_type: link.sourceType,
    target_id: link.targetId,
    target_type: link.targetType,
    context: link.context ?? null,
    created_at: link.createdAt ?? now,
    updated_at: link.updatedAt ?? now
  };
}
