import { DefaultSession, DefaultUser } from "next-auth"
import { SubscriptionTier } from "@prisma/client"

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string
    email: string
    name: string
    subscriptionTier: SubscriptionTier
  }

  interface Session extends DefaultSession {
    user: {
      id: string
      email: string
      name: string
      subscriptionTier: SubscriptionTier
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    name: string
    subscriptionTier: SubscriptionTier
  }
} 