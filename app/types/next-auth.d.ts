import { DefaultSession, DefaultUser } from "next-auth";
import { SubscriptionTier } from "./subscription";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    email: string;
    subscriptionTier: SubscriptionTier;
    role?: string;
  }

  interface Session extends DefaultSession {
    user: User;
  }
} 