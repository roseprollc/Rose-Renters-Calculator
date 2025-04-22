"use client"

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '../components/theme-provider'
import { Toaster as Sonner } from '../components/ui/sonner'

export default function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Sonner />
      </ThemeProvider>
    </SessionProvider>
  )
} 