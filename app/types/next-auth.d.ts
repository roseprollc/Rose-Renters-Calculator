import { DefaultSession } from "next-auth"
import { SubscriptionTier } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string | null
      subscriptionTier: SubscriptionTier
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    email: string
    name: string | null
    subscriptionTier: SubscriptionTier
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    name: string | null
    subscriptionTier: SubscriptionTier
  }
}
