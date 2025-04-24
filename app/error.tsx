"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    const crashReport = {
      error: error.toString(),
      stack: error.stack,
      digest: error.digest,
      timestamp: new Date().toISOString()
    }
    console.error('CRASH_REPORT:', crashReport)
  }, [error])

  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{
        margin: 0,
        padding: '2rem',
        display: 'grid',
        placeItems: 'center',
        minHeight: '100vh',
        fontFamily: 'system-ui'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            🚨 Application Crash
          </h1>
          <pre style={{
            background: '#f5f5f5',
            padding: '1rem',
            borderRadius: '0.5rem',
            overflowX: 'auto',
            maxWidth: '100%'
          }}>
            {error.message || 'Unknown fatal error'}
          </pre>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              marginTop: '2rem',
              padding: '0.5rem 1rem',
              background: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            Restart Application
          </button>
        </div>
      </body>
    </html>
  )
} 