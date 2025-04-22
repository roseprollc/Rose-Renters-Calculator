"use client"

import { useEffect, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { useRouter } from "next/navigation"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0()
  const router = useRouter()
  const [hasTriedRedirect, setHasTriedRedirect] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !hasTriedRedirect) {
      // Store the current URL to redirect back after login
      const currentPath = window.location.pathname
      loginWithRedirect({
        appState: { returnTo: currentPath },
        authorizationParams: {
          redirect_uri: window.location.origin + "/api/auth/callback",
        },
      })
      setHasTriedRedirect(true)
    }
  }, [isLoading, isAuthenticated, loginWithRedirect, hasTriedRedirect])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0ffdf] text-black text-xl">
        <div className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Checking authentication...
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
