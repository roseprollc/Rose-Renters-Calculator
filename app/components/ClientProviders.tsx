'use client';

import { SessionProvider } from 'next-auth/react';
import { TierProvider } from '../contextEngine/tier';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TierProvider>
        {children}
      </TierProvider>
    </SessionProvider>
  );
} 