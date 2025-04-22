"use client"

import { useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import Link from "next/link"
import { LogOut, User } from 'lucide-react'
import ProtectedRoute from "@/components/auth/protected-route"

export default function DashboardPage() {
  const { user, logout } = useAuth0()

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } })
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#b4fc7f]">
        <header className="bg-black text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill="#b4fc7f"
                />
              </svg>
              <span className="text-2xl font-bold">RoseIntel</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/profile" className="hover:text-[#b4fc7f]">Profile</Link>
              <button onClick={handleLogout} className="hover:text-[#b4fc7f]">Logout</button>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Welcome, {user?.name}!</h2>
            <p>You are now logged in to RoseIntel.</p>
            
            <div className="mt-6">
              <h3 className="font-bold mb-2">Your Account</h3>
              <p>Email: {user?.email}</p>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}