import type { ReactNode } from 'react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function Header({ title = 'Planner', subtitle, actions }: HeaderProps) {
  return (
    <header className="border-b border-border px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Unified workspace</p>
          <h1 className="text-lg font-semibold">{title}</h1>
          {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
