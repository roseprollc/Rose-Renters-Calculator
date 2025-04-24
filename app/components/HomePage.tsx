'use client'

import SafeHydrate from './utils/SafeHydrate'

export default function HomePage() {
  return (
    <SafeHydrate>
      <main className="min-h-screen flex items-center justify-center bg-black text-[#2ecc71] font-mono">
        <h1 className="text-5xl">Hello world</h1>
      </main>
    </SafeHydrate>
  )
} 