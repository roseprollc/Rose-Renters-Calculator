import { Analysis, AnalysisType } from '@/app/types/analysis'
import { getUserAnalyses, saveAnalysis, updateAnalysisNotes, deleteAnalyses, exportAnalysis } from '@/app/lib/analyses'
import { useSession } from 'next-auth/react'
import { useState, useCallback } from 'react'

export interface AnalysisProtocol {
  // Data fetching
  fetchAnalyses: () => Promise<void>
  isLoading: boolean
  error: string | null
  
  // Analysis management
  analyses: Analysis[]
  selectedAnalyses: string[]
  setSelectedAnalyses: (ids: string[]) => void
  
  // Actions
  handleDelete: (id: string) => Promise<void>
  handleBulkDelete: () => Promise<void>
  handleExport: (id: string, format: 'pdf' | 'csv') => Promise<void>
  handleBulkExport: (format: 'pdf' | 'csv') => Promise<void>
  handleUpdateNotes: (id: string, notes: string) => Promise<void>
  
  // Filtering and sorting
  searchQuery: string
  setSearchQuery: (query: string) => void
  filterType: string
  setFilterType: (type: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  
  // Computed values
  filteredAnalyses: Analysis[]
  totalProperties: number
  averagePrice: number
  totalRevenue: number
  propertyTypes: string[]
}

export function useAnalysisProtocol(): AnalysisProtocol {
  const { data: session } = useSession()
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAnalyses, setSelectedAnalyses] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const fetchAnalyses = useCallback(async () => {
    if (!session?.user?.email) return
    
    try {
      setIsLoading(true)
      setError(null)
      const data = await getUserAnalyses(session.user.email)
      setAnalyses(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analyses')
    } finally {
      setIsLoading(false)
    }
  }, [session?.user?.email])

  const handleDelete = useCallback(async (id: string) => {
    if (!session?.user?.email) return
    
    try {
      await deleteAnalyses([id])
      setAnalyses(prev => prev.filter(a => a.id !== id))
      setSelectedAnalyses(prev => prev.filter(i => i !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete analysis')
    }
  }, [session?.user?.email])

  const handleBulkDelete = useCallback(async () => {
    if (!session?.user?.email || selectedAnalyses.length === 0) return
    
    try {
      await deleteAnalyses(selectedAnalyses)
      setAnalyses(prev => prev.filter(a => !selectedAnalyses.includes(a.id)))
      setSelectedAnalyses([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete analyses')
    }
  }, [session?.user?.email, selectedAnalyses])

  const handleExport = useCallback(async (id: string, format: 'pdf' | 'csv') => {
    if (!session?.user?.email) return
    
    try {
      const blob = await exportAnalysis(id, format)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analysis-${id}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export analysis')
    }
  }, [session?.user?.email])

  const handleBulkExport = useCallback(async (format: 'pdf' | 'csv') => {
    if (!session?.user?.email || selectedAnalyses.length === 0) return
    
    try {
      // For bulk export, we'll create a zip file containing all analyses
      // This is a placeholder - you'll need to implement the actual zip creation
      const zip = new JSZip()
      
      for (const id of selectedAnalyses) {
        const blob = await exportAnalysis(id, format)
        zip.file(`analysis-${id}.${format}`, blob)
      }
      
      const content = await zip.generateAsync({ type: 'blob' })
      const url = window.URL.createObjectURL(content)
      const a = document.createElement('a')
      a.href = url
      a.download = `analyses-${new Date().toISOString()}.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export analyses')
    }
  }, [session?.user?.email, selectedAnalyses])

  const handleUpdateNotes = useCallback(async (id: string, notes: string) => {
    if (!session?.user?.email) return
    
    try {
      await updateAnalysisNotes(id, notes)
      setAnalyses(prev => prev.map(a => 
        a.id === id ? { ...a, notes } : a
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update notes')
    }
  }, [session?.user?.email])

  const filteredAnalyses = analyses
    .filter(analysis => {
      if (searchQuery && !analysis.propertyAddress.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      
      if (filterType !== 'all' && analysis.type !== filterType) {
        return false
      }
      
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'price-high':
          return (b.data as any).price - (a.data as any).price
        case 'price-low':
          return (a.data as any).price - (b.data as any).price
        case 'revenue-high':
          return (b.data as any).revenue - (a.data as any).revenue
        case 'revenue-low':
          return (a.data as any).revenue - (b.data as any).revenue
        default:
          return 0
      }
    })

  const totalProperties = analyses.length
  const averagePrice = analyses.length > 0
    ? Math.round(analyses.reduce((sum, a) => sum + (a.data as any).price, 0) / analyses.length)
    : 0
  const totalRevenue = analyses.reduce((sum, a) => sum + (a.data as any).revenue, 0)
  const propertyTypes = Array.from(new Set(analyses.map(a => a.type)))

  return {
    // Data fetching
    fetchAnalyses,
    isLoading,
    error,
    
    // Analysis management
    analyses,
    selectedAnalyses,
    setSelectedAnalyses,
    
    // Actions
    handleDelete,
    handleBulkDelete,
    handleExport,
    handleBulkExport,
    handleUpdateNotes,
    
    // Filtering and sorting
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    sortBy,
    setSortBy,
    
    // Computed values
    filteredAnalyses,
    totalProperties,
    averagePrice,
    totalRevenue,
    propertyTypes
  }
} 