import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      tier: 'free' | 'pro' | 'elite'
      role?: string
    } & DefaultSession['user']
  }

  interface User {
    id: string
    tier: 'free' | 'pro' | 'elite'
    role?: string
  }

  interface JWT {
    id: string
    tier: 'free' | 'pro' | 'elite'
    role?: string
  }
} 