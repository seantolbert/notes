/**
 * Create a stable uuid string with a simple prefix for readability.
 * Uses crypto.randomUUID() when available with a deterministic fallback.
 */
export function createId(prefix = 'id'): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  // Fallback for environments without crypto.randomUUID (e.g., older Node runtimes).
  const fallback = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
  return `${prefix}_${fallback}`;
}
