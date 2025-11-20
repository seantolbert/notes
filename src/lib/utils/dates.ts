/**
 * Return today's date as YYYY-MM-DD (local time).
 */
export function getToday(): string {
  return toISODate(new Date());
}

/**
 * Compare two YYYY-MM-DD strings for same calendar day.
 */
export function isSameDay(a: string, b: string): boolean {
  return a === b;
}

/**
 * Convert a Date to a YYYY-MM-DD string in local time.
 * Keeps parity with Supabase date columns.
 */
export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Start-of-day Date object (local time, 00:00:00.000).
 */
export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * End-of-day Date object (local time, 23:59:59.999).
 */
export function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}
