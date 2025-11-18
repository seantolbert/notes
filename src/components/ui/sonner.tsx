'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      toastOptions={{
        classNames: {
          toast: 'bg-card border border-border text-foreground',
          actionButton: 'text-primary',
          description: 'text-muted-foreground'
        }
      }}
    />
  );
}
