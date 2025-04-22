"use client"

import { useSession } from "next-auth/react"
import ProtectedRoute from "@/components/auth/protected-route"

export default function ProfilePage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="flex items-center gap-3">
            <svg
              className="animate-spin h-8 w-8 text-[#2ecc71]"
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
            <span className="text-[#2ecc71] text-xl font-medium">Loading User Info...</span>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (status === 'error') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-black p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-neutral-900 p-8 rounded-lg border border-[#2ecc71]/30">
              <h1 className="text-[#2ecc71] text-2xl font-bold mb-4">Error Loading User</h1>
              <p className="text-gray-300 mb-6">Failed to load user information</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-neutral-900 p-8 rounded-lg border border-[#2ecc71]/30">
            <h1 className="text-[#2ecc71] text-2xl font-bold mb-4">User Profile</h1>
            <div className="space-y-4">
              <p className="text-gray-300">
                <span className="font-medium">Name:</span> {session?.user?.name}
              </p>
              <p className="text-gray-300">
                <span className="font-medium">Email:</span> {session?.user?.email}
              </p>
              <p className="text-gray-300">
                <span className="font-medium">User ID:</span> {session?.user?.id}
              </p>
              <p className="text-gray-300">
                <span className="font-medium">Subscription Tier:</span> {session?.user?.subscriptionTier || 'free'}
              </p>
            </div>
            <pre className="mt-8 p-4 bg-black rounded-lg overflow-auto text-gray-300">
              {JSON.stringify(session?.user, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
