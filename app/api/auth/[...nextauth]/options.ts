import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/app/lib/prisma"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
      role?: string
      subscriptionTier?: string
    }
  }
  
  interface User {
    id: string
    email?: string | null
    name?: string | null
    image?: string | null
    role?: string
    subscriptionTier?: string
  }
}

export const authOptions: NextAuthOptions = {
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
      async authorize(credentials) {
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
            subscriptionTier: user.subscriptionTier
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
          subscriptionTier: user.subscriptionTier
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
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
        token.id = user.id
        token.subscriptionTier = user.subscriptionTier || 'free'
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string
        session.user.subscriptionTier = token.subscriptionTier as string
      }
      return session
    }
  }
} 