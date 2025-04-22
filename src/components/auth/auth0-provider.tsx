"use client"

import { Auth0Provider, useAuth0 } from "@auth0/auth0-react"
import { useRouter } from "next/navigation"
import { ReactNode, useEffect } from "react"

interface Auth0ProviderWithNavigateProps {
  children: ReactNode
}

function Auth0Logger() {
  const { isAuthenticated, user, isLoading } = useAuth0()

  useEffect(() => {
    console.log("🔐 Auth Status Changed:", {
      isAuthenticated,
      isLoading,
      user,
    })
  }, [isAuthenticated, isLoading, user])

  return null
}

export default function Auth0ProviderWithNavigate({ children }: Auth0ProviderWithNavigateProps) {
  const router = useRouter()

  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID
  // Use the exact origin without any path for the redirect URI
  const redirectUri = typeof window !== "undefined" ? window.location.origin : ""

  if (!domain || !clientId) {
    console.error("❌ Missing Auth0 environment variables")
    return null
  }

  const onRedirectCallback = (appState: any) => {
    // If there's a returnTo path in the appState, navigate to it
    // Otherwise, navigate to the dashboard
    router.push(appState?.returnTo || "/dashboard")
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        scope: "openid profile email",
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
      onRedirectCallback={onRedirectCallback}
    >
      <Auth0Logger />
      {children}
    </Auth0Provider>
  )
}
