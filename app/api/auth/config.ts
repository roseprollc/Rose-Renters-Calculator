import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

type UserType = {
  id: string;
  email: string;
  name?: string;
  subscriptionTier: 'free' | 'pro' | 'elite';
}

declare module "next-auth" {
  interface User extends UserType {}

  interface Session {
    user: User & {
      subscriptionTier: 'free' | 'pro' | 'elite';
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    subscriptionTier: 'free' | 'pro' | 'elite';
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        mode: { label: 'Mode', type: 'text' }
      },
      async authorize(credentials): Promise<UserType | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        const { email, password, mode } = credentials;

        // For demo purposes, always allow the demo account
        if (email === 'demo@example.com' && password === 'demo123') {
          return {
            id: 'demo',
            email: 'demo@example.com',
            name: 'Demo User',
            subscriptionTier: 'free'
          };
        }

        if (mode === 'signup') {
          // Check if user already exists
          const existingUser = await prisma.user.findUnique({
            where: { email }
          });

          if (existingUser) {
            throw new Error('User already exists');
          }

          // Create new user
          const hashedPassword = await bcrypt.hash(password, 10);
          const user = await prisma.user.create({
            data: {
              email,
              password: hashedPassword,
              subscriptionTier: 'free'
            }
          });
          
          return {
            id: user.id,
            email: user.email,
            subscriptionTier: user.subscriptionTier as 'free' | 'pro' | 'elite'
          };
        }

        // Login mode
        const user = await prisma.user.findUnique({
          where: { email }
        });

        if (!user) {
          throw new Error('No user found with this email');
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user.id,
          email: user.email,
          subscriptionTier: user.subscriptionTier as 'free' | 'pro' | 'elite'
        };
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.subscriptionTier = user.subscriptionTier;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.subscriptionTier = token.subscriptionTier;
      }
      return session;
    }
  }
}; 