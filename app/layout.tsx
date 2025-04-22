'use client';

import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react'
import { TierProvider } from './contexts/TierContext'

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <TierProvider>
            {children}
            <Toaster />
          </TierProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
