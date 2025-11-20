export function createId(prefix = 'id'): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  // Fallback for server environments where crypto.randomUUID is not available.
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

// TODO: switch to a consistent id generation strategy across services.
