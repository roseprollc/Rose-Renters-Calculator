'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { TierProvider } from '../contextEngine/tier';

const Analytics = dynamic(() => import('@vercel/analytics/react').then(mod => mod.Analytics), { ssr: false });
const SpeedInsights = dynamic(() => import('@vercel/speed-insights/next').then(mod => mod.SpeedInsights), { ssr: false });

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TierProvider>
        <div className="min-h-screen bg-black text-[#2ecc71] antialiased">
          {children}
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </div>
      </TierProvider>
    </SessionProvider>
  );
} 