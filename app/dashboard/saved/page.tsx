'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Analysis, AnalysisFilters, AnalysisType, SortOption } from '@/app/types/analysis'
import { AnalysisList } from '@/app/components/saved/AnalysisList'
import { Input } from '@/app/components/ui/input'
import { Button } from '@/app/components/ui/button'
import { Search, Filter, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { generateInsightFromAnalysis } from '@/app/protocolLayer/gpt/generateInsightFromAnalysis'
import { useUserTier } from '@/app/contextLayer/userContext'

export default function SavedAnalysesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const userTier = useUserTier()
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<AnalysisFilters>({
    search: '',
    type: 'all' as const,
    sortBy: 'newest' as const
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    const fetchAnalyses = async () => {
      try {
        const response = await fetch('/api/analyses')
        if (!response.ok) throw new Error('Failed to fetch analyses')
        const data = await response.json()
        setAnalyses(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch analyses')
        toast.error('Failed to load saved analyses')
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchAnalyses()
    }
  }, [status, router])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/analyses/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete analysis')
      setAnalyses(analyses.filter(analysis => analysis.id !== id))
      toast.success('Analysis deleted successfully')
    } catch (err) {
      toast.error('Failed to delete analysis')
    }
  }

  const handleBulkDelete = async (ids: string[]) => {
    try {
      const response = await fetch('/api/analyses/bulk-delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids })
      })
      if (!response.ok) throw new Error('Failed to delete analyses')
      setAnalyses(analyses.filter(analysis => !ids.includes(analysis.id)))
      toast.success('Selected analyses deleted successfully')
    } catch (err) {
      toast.error('Failed to delete selected analyses')
    }
  }

  const handleExport = async (id: string, format: 'pdf' | 'csv') => {
    // This will be implemented in Step 3
    toast.info('Export functionality coming soon!')
  }

  const handleBulkExport = async (ids: string[], format: 'pdf' | 'csv') => {
    // This will be implemented in Step 3
    toast.info('Bulk export functionality coming soon!')
  }

  const handleAskAI = async (id: string): Promise<string | null> => {
    try {
      // Find the analysis
      const analysis = analyses.find(a => a.id === id)
      if (!analysis) {
        throw new Error('Analysis not found')
      }

      // Generate AI insight
      const insight = await generateInsightFromAnalysis(analysis, userTier)
      
      // Update the analysis with the AI insight
      const updatedAnalysis = {
        ...analysis,
        aiSummary: insight
      }
      
      // Update the analysis in the state
      setAnalyses(analyses.map(a => 
        a.id === id ? updatedAnalysis : a
      ))
      
      // Save the updated analysis to the server
      const response = await fetch(`/api/analyses/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ aiSummary: insight })
      })
      
      if (!response.ok) {
        throw new Error('Failed to save AI insight')
      }
      
      return insight
    } catch (err) {
      console.error('Error generating AI insight:', err)
      toast.error('Failed to generate AI insight')
      return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Saved Analyses</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search analyses..."
                className="pl-10"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {/* TODO: Implement filter modal */}}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <AnalysisList
          analyses={analyses}
          filters={filters}
          onDelete={handleDelete}
          onBulkDelete={handleBulkDelete}
          onExport={handleExport}
          onBulkExport={handleBulkExport}
          onAskAI={handleAskAI}
        />
      </div>
    </div>
  )
} 