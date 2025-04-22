"use client"

import Header from "./Header"
import Footer from "./Footer"

export default function PageLayout({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-grow pt-20 ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  )
} 