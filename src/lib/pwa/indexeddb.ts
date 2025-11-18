import { openDB, type IDBPDatabase, type DBSchema } from 'idb';

/**
 * Minimal schema definition that powers this shell.
 * - `appMeta` exists so the database always has a store to work with from day one.
 * - Additional stores can be layered on without changing this helper by bumping the DB version
 *   and creating them inside the `upgrade` callback (see comments below).
 */
interface PwaShellDBSchema extends DBSchema {
  appMeta: {
    key: IDBValidKey;
    value: unknown;
  };
}

export const DEFAULT_STORE = 'appMeta' as const;
type StoreName = typeof DEFAULT_STORE;

/**
 * To add more stores later:
 * 1. Extend `PwaShellDBSchema` with a new key (e.g. `userPrefs`).
 * 2. Update `StoreName` to include it: `type StoreName = typeof DEFAULT_STORE | 'userPrefs';`
 * 3. Bump `DB_VERSION` and create the store inside the `upgrade` callback.
 */
const DB_NAME = 'pwaShell';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<PwaShellDBSchema>> | null = null;

/**
 * Opens (or reuses) the shared IndexedDB instance.
 *
 * How to add more stores later:
 * 1. Increment `DB_VERSION`.
 * 2. In the `upgrade` callback below, call `db.createObjectStore('yourStoreName')` when
 *    `oldVersion < newVersion`.
 * 3. Avoid removing or renaming stores unless you also migrate existing data.
 *
 * This helper intentionally stays lightweight and unopinionated: we simply expose a typed
 * `openDatabase` and a few CRUD helpers so feature teams can decide how to structure their
 * own stores, keys, and value shapes without a central abstraction getting in the way.
 */
export function openDatabase() {
  if (!dbPromise) {
    dbPromise = openDB<PwaShellDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Ensure the default store exists; safe to call multiple times.
        if (!db.objectStoreNames.contains(DEFAULT_STORE)) {
          db.createObjectStore(DEFAULT_STORE);
        }
        /**
         * To extend the schema, add additional `if (!db.objectStoreNames.contains(...))` blocks here.
         * This keeps the shell flexible: each new feature can ship its own store without touching
         * any other shared logic, just by bumping DB_VERSION and adding a few lines above.
         */
      }
    });
  }
  return dbPromise;
}

export async function setItem(store: StoreName, key: IDBValidKey, value: unknown) {
  const db = await openDatabase();
  return db.put(store, value, key);
}

export async function getItem<T = unknown>(store: StoreName, key: IDBValidKey) {
  const db = await openDatabase();
  return db.get(store, key) as Promise<T | undefined>;
}

export async function removeItem(store: StoreName, key: IDBValidKey) {
  const db = await openDatabase();
  return db.delete(store, key);
}
