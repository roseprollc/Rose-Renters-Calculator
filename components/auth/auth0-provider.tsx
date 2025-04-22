"use client"

import { UserProvider } from "@auth0/nextjs-auth0/client"
import { useRouter } from "next/navigation"

export default function Auth0ProviderWithNavigate({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  return (
    <UserProvider>
      {children}
    </UserProvider>
  )
} 