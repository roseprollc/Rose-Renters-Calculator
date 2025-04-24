"use client"

import { useState, useEffect } from 'react';
import SafeHydrate from '@/app/components/utils/SafeHydrate';
import { useSession } from 'next-auth/react';
import Header from "./Header"
import Footer from "./Footer"

export default function PageLayout({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <SafeHydrate>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className={`flex-grow pt-20 ${className}`}>
            {children}
          </main>
          <Footer />
        </div>
      </SafeHydrate>
    </div>
  )
} 