import 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    email?: string | null
    name?: string | null
    image?: string | null
    role?: string
    subscriptionTier?: 'free' | 'pro' | 'enterprise'
  }

  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
      role?: string
      subscriptionTier?: 'free' | 'pro' | 'elite'
    }
  }
} 