'use client';

import { useNetworkStatus } from '@/lib/hooks/useNetworkStatus';

export function OfflineBanner() {
  const { online } = useNetworkStatus();

  if (online) {
    return null;
  }

  return (
    <div className="bg-destructive text-destructive-foreground px-4 py-2 text-center text-sm">
      You&apos;re offline. Changes will sync when connection returns.
    </div>
  );
}
