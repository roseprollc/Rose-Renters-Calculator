'use client'

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { TierProvider } from '@/app/contextEngine/tier';
import { Toaster } from 'react-hot-toast'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TierProvider>
        {children}
      </TierProvider>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #2ecc71',
          },
          success: {
            iconTheme: {
              primary: '#2ecc71',
              secondary: '#1a1a1a',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff4444',
              secondary: '#1a1a1a',
            },
          },
        }}
      />
    </SessionProvider>
  )
} 