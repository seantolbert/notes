'use client';

import { useCallback, useMemo, useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

import { NotificationTestCard } from '@/components/notifications/notification-test-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useNetworkStatus } from '@/lib/hooks/useNetworkStatus';
import { DEFAULT_STORE, openDatabase } from '@/lib/pwa/indexeddb';

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { online } = useNetworkStatus();
  const [clearing, setClearing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = useMemo(() => (mounted ? resolvedTheme === 'dark' : false), [mounted, resolvedTheme]);

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  const handleClearStorage = useCallback(async () => {
    setClearing(true);
    try {
      const db = await openDatabase();
      const tx = db.transaction(DEFAULT_STORE, 'readwrite');
      tx.store.clear();
      await tx.done;
    } finally {
      setClearing(false);
    }
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Toggle dark mode to preview how your UI adapts.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <Label htmlFor="theme-toggle">Dark Mode</Label>
            <p className="text-sm text-muted-foreground">Current: {mounted ? theme ?? 'system' : 'system'}</p>
          </div>
          <Switch id="theme-toggle" checked={isDark} onCheckedChange={handleThemeToggle} disabled={!mounted} />
        </CardContent>
      </Card>

      <NotificationTestCard />

      <Card>
        <CardHeader>
          <CardTitle>Storage</CardTitle>
          <CardDescription>Reset the default IndexedDB store used by the shell.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Useful when testing subscription flows.</p>
          </div>
          <Button variant="destructive" onClick={handleClearStorage} disabled={clearing}>
            {clearing ? 'Clearing…' : 'Clear IndexedDB'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connectivity</CardTitle>
          <CardDescription>Live network status from the browser.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Status:{' '}
            <span className={online ? 'text-emerald-500' : 'text-destructive'}>
              {online ? 'Online' : 'Offline'}
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
