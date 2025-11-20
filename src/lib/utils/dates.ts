export function toIsoDate(date: Date | string): string {
  if (typeof date === 'string') return date;
  return date.toISOString().slice(0, 10);
}

export function formatShortDate(date: Date | string, locale = 'en-US') {
  return new Date(date).toLocaleDateString(locale, { month: 'short', day: 'numeric' });
}

export function startOfTodayIso() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.toISOString();
}

// TODO: add time zone handling and recurring date helpers.
