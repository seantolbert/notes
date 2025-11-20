export const PLANNER_DB_NAME = 'planner-local';
export const PLANNER_DB_VERSION = 1;

export async function openPlannerDatabase(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === 'undefined') {
    // IndexedDB is not available in this environment (e.g., during SSR).
    return null;
  }

  // TODO: define object stores for notes, tasks, events, tags, and links.
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(PLANNER_DB_NAME, PLANNER_DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('notes')) db.createObjectStore('notes', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('tasks')) db.createObjectStore('tasks', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('events')) db.createObjectStore('events', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('tags')) db.createObjectStore('tags', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('links')) db.createObjectStore('links', { keyPath: 'id' });
    };

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}
