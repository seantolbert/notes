'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Home, Settings } from 'lucide-react';

import { OfflineBanner } from '@/components/feedback/offline-banner';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/', label: 'Home', Icon: Home },
  { href: '/settings', label: 'Settings', Icon: Settings }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">PWA Shell</p>
            <h1 className="text-lg font-semibold">Starter Experience</h1>
          </div>
          <span className="text-xs text-muted-foreground">Mobile-first</span>
        </div>
      </header>

      <OfflineBanner />

      <main className="flex-1 overflow-y-auto px-4 py-6">{children}</main>

      <nav className="border-t border-border bg-card">
        <div className="flex">
          {NAV_LINKS.map(({ href, label, Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex-1 flex flex-col items-center gap-1 py-2 text-xs',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
