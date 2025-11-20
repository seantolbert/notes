import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

import type { OutboxEntry } from '@/lib/db/outbox';
import type { DailyPage } from '@/lib/models/dailyPage';
import type { Event } from '@/lib/models/event';
import type { Link } from '@/lib/models/link';
import type { Note } from '@/lib/models/note';
import type { Task } from '@/lib/models/task';

export const PLANNER_DB_NAME = 'planner-local';
// Bump version any time stores change to trigger onupgradeneeded.
export const PLANNER_DB_VERSION = 2;

/**
 * Typed schema for IndexedDB. Each store uses the domain model shape so the app
 * can work offline without additional mapping.
 */
export interface PlannerDBSchema extends DBSchema {
  notes: {
    key: string;
    value: Note;
  };
  tasks: {
    key: string;
    value: Task;
  };
  events: {
    key: string;
    value: Event;
  };
  links: {
    key: string;
    value: Link;
  };
  dailyPages: {
    key: string;
    value: DailyPage;
  };
  outbox: {
    key: string;
    value: OutboxEntry;
  };
}

/**
 * Open (or create) the local planner IndexedDB database.
 * Returns null when IndexedDB is unavailable (e.g., SSR or restricted contexts).
 */
export async function openPlannerDatabase(): Promise<IDBPDatabase<PlannerDBSchema> | null> {
  if (typeof indexedDB === 'undefined') {
    // IndexedDB is not available in this environment (e.g., during SSR).
    return null;
  }

  return openDB<PlannerDBSchema>(PLANNER_DB_NAME, PLANNER_DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('notes')) {
        db.createObjectStore('notes', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('tasks')) {
        db.createObjectStore('tasks', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('events')) {
        db.createObjectStore('events', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('links')) {
        db.createObjectStore('links', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('dailyPages')) {
        db.createObjectStore('dailyPages', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('outbox')) {
        db.createObjectStore('outbox', { keyPath: 'id' });
      }
    }
  });
}
