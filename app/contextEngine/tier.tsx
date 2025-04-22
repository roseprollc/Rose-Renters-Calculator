'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

type Tier = 'free' | 'pro' | 'elite';

// Define a custom user type with subscriptionTier
interface CustomUser {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  role?: string;
  subscriptionTier?: Tier;
}

interface TierContextValue {
  tier: Tier;
}

const TierContext = createContext<TierContextValue>({ tier: 'free' });

export const useTier = () => {
  const context = useContext(TierContext);
  if (!context) {
    throw new Error('useTier must be used within a TierProvider');
  }
  return context;
};

interface TierProviderProps {
  children: ReactNode;
}

export const TierProvider = ({ children }: TierProviderProps) => {
  const { data: session } = useSession();
  // Use type assertion to access subscriptionTier
  const user = session?.user as CustomUser | undefined;
  const tier = user?.subscriptionTier || 'free';

  return (
    <TierContext.Provider value={{ tier }}>
      {children}
    </TierContext.Provider>
  );
}; 