'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { AppShell } from '@/components/layout/app-shell';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { registerServiceWorker } from '@/lib/pwa/sw-registration';
import { usePwaUpdate } from '@/lib/pwa/usePwaUpdate';

export function AppProviders({ children }: { children: ReactNode }) {
  const { isUpdateAvailable, applyUpdate } = usePwaUpdate();

  useEffect(() => {
    registerServiceWorker();
  }, []);

  useEffect(() => {
    if (isUpdateAvailable) {
      toast('Update available', {
        description: 'An updated version is ready. Reload now?',
        action: {
          label: 'Reload',
          onClick: () => applyUpdate()
        }
      });
    }
  }, [isUpdateAvailable, applyUpdate]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppShell>{children}</AppShell>
      <Toaster />
    </ThemeProvider>
  );
}
