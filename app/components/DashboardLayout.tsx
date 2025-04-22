"use client"

import Footer from "./Footer"

export default function DashboardLayout({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className={`flex-grow ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  )
} 