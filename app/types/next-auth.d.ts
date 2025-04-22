import 'next-auth'
import type { DefaultSession } from "next-auth"
import type { SubscriptionTier } from "@prisma/client"

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    subscriptionTier: SubscriptionTier;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      subscriptionTier: SubscriptionTier;
    } & DefaultSession["user"]
  }

  interface JWT {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    subscriptionTier: SubscriptionTier;
  }
} 