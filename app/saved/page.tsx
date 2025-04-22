'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Analysis, AnalysisFilters } from '@/app/types/analysis'
import { AnalysisList } from '@/app/components/saved/AnalysisList'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Select } from '@/app/components/ui/select'
import { toast } from 'sonner'

// Force dynamic rendering to prevent static generation
export const dynamic = 'force-dynamic'

export default function SavedAnalyses() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<AnalysisFilters>({
    type: 'all',
    search: '',
    sortBy: 'date-desc'
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchAnalyses()
    }
  }, [session])

  const fetchAnalyses = async () => {
    try {
      const response = await fetch('/api/analyses')
      if (!response.ok) throw new Error('Failed to fetch analyses')
      const data = await response.json()
      setAnalyses(data)
    } catch (error) {
      console.error('Error fetching analyses:', error)
      toast.error('Failed to load saved analyses')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/analyses/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete analysis')
      setAnalyses(analyses.filter(a => a.id !== id))
      toast.success('Analysis deleted successfully')
    } catch (error) {
      console.error('Error deleting analysis:', error)
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
      setAnalyses(analyses.filter(a => !ids.includes(a.id)))
      toast.success('Analyses deleted successfully')
    } catch (error) {
      console.error('Error deleting analyses:', error)
      toast.error('Failed to delete analyses')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Saved Analyses</h1>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <Input
            type="text"
            placeholder="Search analyses..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="max-w-xs"
          />
          <Select
            value={filters.type}
            onValueChange={(value) => setFilters({ ...filters, type: value })}
          >
            <option value="all">All Types</option>
            <option value="mortgage">Mortgage</option>
            <option value="rental">Rental</option>
            <option value="wholesale">Wholesale</option>
            <option value="airbnb">Airbnb</option>
          </Select>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => setFilters({ ...filters, sortBy: value })}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
          </Select>
        </div>

        <AnalysisList
          analyses={analyses}
          filters={filters}
          onDelete={handleDelete}
          onBulkDelete={handleBulkDelete}
        />
      </div>
    </div>
  )
} 