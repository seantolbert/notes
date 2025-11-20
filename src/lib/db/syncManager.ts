import * as dailyPagesRepo from '@/lib/db/repositories/dailyPagesRepo';
import * as eventsRepo from '@/lib/db/repositories/eventsRepo';
import * as linksRepo from '@/lib/db/repositories/linksRepo';
import * as notesRepo from '@/lib/db/repositories/notesRepo';
import * as tasksRepo from '@/lib/db/repositories/tasksRepo';

export type SyncHandle = {
  stop: () => void;
};

/**
 * Kick off a background sync loop that periodically syncs all repositories.
 * Returns a handle to stop the loop. Safe to no-op in SSR environments.
 */
export function startBackgroundSync(intervalMs = 60_000): SyncHandle {
  if (typeof window === 'undefined') {
    return { stop: () => undefined };
  }

  let stopped = false;

  const tick = async () => {
    if (stopped) return;
    // Fire-and-forget each sync; repos swallow network errors.
    void notesRepo.sync();
    void tasksRepo.sync();
    void eventsRepo.sync();
    void linksRepo.sync();
    void dailyPagesRepo.sync();
  };

  const id = window.setInterval(tick, intervalMs);
  // Run one immediately.
  void tick();

  return {
    stop: () => {
      stopped = true;
      window.clearInterval(id);
    }
  };
}
