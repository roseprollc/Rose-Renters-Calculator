'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-black text-[#2ecc71] antialiased">
        {children}
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </div>
    </SessionProvider>
  );
} 