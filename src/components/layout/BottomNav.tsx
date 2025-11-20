'use client';

import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

export interface BottomNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface BottomNavProps {
  items: BottomNavItem[];
  activePath?: string;
}

export function BottomNav({ items, activePath }: BottomNavProps) {
  return (
    <nav className="border-t border-border bg-card">
      <div className="flex">
        {items.map(({ href, label, icon: Icon }) => {
          const isActive = activePath ? activePath === href || activePath.startsWith(`${href}/`) : false;

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 py-2 text-xs transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
