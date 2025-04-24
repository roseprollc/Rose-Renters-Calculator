import { DefaultSession, DefaultUser } from 'next-auth'
import { User as PrismaUser } from '@prisma/client'

declare module "next-auth" {
  interface User extends Omit<PrismaUser, 'emailVerified'> {}

  interface Session extends DefaultSession {
    user: {
      id: string
      email: string
      subscriptionTier: PrismaUser['subscriptionTier']
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    subscriptionTier: PrismaUser['subscriptionTier']
  }
} 