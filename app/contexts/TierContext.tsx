'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export type Tier = 'free' | 'pro' | 'elite';

interface TierContextType {
  tier: Tier;
  isLoading: boolean;
  error: string | null;
}

const TierContext = createContext<TierContextType>({
  tier: 'free',
  isLoading: true,
  error: null,
});

export function TierProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [tier, setTier] = useState<Tier>('free');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTier() {
      if (status === 'loading') return;
      
      if (!session?.user) {
        setTier('free');
        setIsLoading(false);
        return;
      }

      // First check if tier is available in the session
      if (session.user.subscriptionTier) {
        setTier(session.user.subscriptionTier as Tier);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/user/tier');
        if (!response.ok) throw new Error('Failed to fetch tier');
        const data = await response.json();
        setTier(data.tier);
      } catch (err) {
        console.error('Error fetching tier:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch tier');
        setTier('free');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTier();
  }, [session, status]);

  return (
    <TierContext.Provider value={{ tier, isLoading, error }}>
      {children}
    </TierContext.Provider>
  );
}

export function useTier() {
  const context = useContext(TierContext);
  if (context === undefined) {
    throw new Error('useTier must be used within a TierProvider');
  }
  return context;
} 