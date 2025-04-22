import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      subscriptionTier: 'free' | 'pro' | 'elite';
    }
  }

  interface User {
    id: string
    tier: 'free' | 'pro' | 'elite'
    role?: string
  }

  interface JWT {
    id: string;
    subscriptionTier: 'free' | 'pro' | 'elite';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    subscriptionTier: 'free' | 'pro' | 'elite';
  }
} 