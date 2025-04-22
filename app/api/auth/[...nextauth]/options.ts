import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import type { User } from "next-auth"
import type { SubscriptionTier } from "@prisma/client"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        mode: { label: "Mode", type: "text" }, // "login" or "signup"
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (credentials.mode === "signup") {
          if (user) {
            throw new Error("User already exists")
          }

          const hashedPassword = await bcrypt.hash(credentials.password, 10)
          const newUser = await prisma.user.create({
            data: {
              email: credentials.email,
              password: hashedPassword,
              subscriptionTier: "free" as SubscriptionTier,
            },
          })

          return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            subscriptionTier: newUser.subscriptionTier,
          }
        }

        if (!user) {
          throw new Error("Invalid credentials")
        }

        const isValid = await bcrypt.compare(credentials.password, user.password || '')
        if (!isValid) {
          throw new Error("Invalid credentials")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          subscriptionTier: user.subscriptionTier,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.subscriptionTier = user.subscriptionTier
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.subscriptionTier = token.subscriptionTier as SubscriptionTier
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
} 