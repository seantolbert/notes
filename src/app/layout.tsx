import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AppProviders } from '@/components/providers/app-providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'PWA Shell',
  description: 'Installable starter experience wired up with offline caching and push notifications.',
  manifest: '/manifest.json',
  themeColor: '#0f172a',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'PWA Shell'
  }
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
