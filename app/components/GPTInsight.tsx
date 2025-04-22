"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Loader2, Lock, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface GPTInsightProps {
  calculatorType: 'airbnb' | 'rental' | 'wholesale' | 'mortgage'
  formData: any
  autoRun?: boolean
  className?: string
}

export default function GPTInsight({ 
  calculatorType, 
  formData, 
  autoRun = false,
  className = ''
}: GPTInsightProps) {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [insight, setInsight] = useState<string | null>(null)

  // Helper to determine user tier
  const getUserTier = () => {
    if (!session?.user) return 'free'
    // TODO: Implement actual tier logic based on JWT/session
    return session.user.tier || 'free'
  }

  const tier = getUserTier()

  const generateInsight = async () => {
    if (tier === 'free') return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/gpt/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calculatorType,
          formData,
          tier
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate insight')
      }

      const data = await response.json()
      setInsight(data.insight)
    } catch (err) {
      setError('Failed to generate AI insight. Please try again.')
      console.error('GPT insight error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Auto-run for Elite tier if specified
  if (autoRun && tier === 'elite' && !insight && !loading) {
    generateInsight()
  }

  if (tier === 'free') {
    return (
      <div className={`bg-[#111111] border border-[#2ecc71]/20 rounded-lg p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-[#2ecc71]" />
          <h3 className="text-lg font-bold text-white">AI Deal Analysis</h3>
        </div>
        <p className="text-gray-400 mb-4">
          Upgrade to Pro or Elite to unlock AI-powered investment insights.
        </p>
        <Link 
          href="/pricing"
          className="inline-block bg-[#2ecc71] text-black px-4 py-2 rounded hover:bg-[#27ae60] transition-colors"
        >
          Upgrade Now
        </Link>
      </div>
    )
  }

  return (
    <div className={`bg-[#111111] border border-[#2ecc71]/20 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">AI Deal Analysis</h3>
        {tier === 'pro' && !loading && (
          <button
            onClick={generateInsight}
            disabled={loading}
            className="bg-[#2ecc71] text-black px-4 py-2 rounded hover:bg-[#27ae60] transition-colors disabled:opacity-50"
          >
            Get AI Insight
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-[#2ecc71]">
          <Loader2 className="w-5 h-5 animate-spin" />
          <p>Generating AI insight...</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      {insight && (
        <div className="prose prose-invert max-w-none">
          <div className="whitespace-pre-wrap font-mono text-sm text-gray-300">
            {insight}
          </div>
        </div>
      )}
    </div>
  )
} 