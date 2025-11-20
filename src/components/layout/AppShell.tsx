'use client';

import { CalendarDays, CheckSquare, FileText, Home, Inbox, Search, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { OfflineBanner } from '@/components/feedback/offline-banner';
import { BottomNav } from '@/components/layout/BottomNav';
import { Header } from '@/components/layout/Header';

const NAV_LINKS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/notes', label: 'Notes', icon: FileText },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/inbox', label: 'Inbox', icon: Inbox },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/settings', label: 'Settings', icon: Settings }
];

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header
        title="Planner"
        subtitle="Notes, tasks, and calendar"
        // TODO: swap placeholder hero copy for day summaries or context-aware actions.
      />

      <OfflineBanner />

      <main className="flex-1 overflow-y-auto px-4 py-6">{children}</main>

      <BottomNav items={NAV_LINKS} activePath={pathname} />
    </div>
  );
}
