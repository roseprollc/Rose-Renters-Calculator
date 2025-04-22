'use client'

import { useState } from 'react'
import { Analysis, AnalysisFilters } from '@/app/types/analysis'
import { AnalysisCard } from './AnalysisCard'
import { Trash2, Download } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { Button } from '@/app/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/app/components/ui/dropdown-menu'

interface AnalysisListProps {
  analyses: Analysis[]
  filters: AnalysisFilters
  onDelete?: (id: string) => void
  onBulkDelete?: (ids: string[]) => void
  onExport?: (id: string, format: 'pdf' | 'csv') => void
  onBulkExport?: (ids: string[], format: 'pdf' | 'csv') => void
  onAskAI?: (id: string) => Promise<string | null>
}

export function AnalysisList({ 
  analyses, 
  filters, 
  onDelete, 
  onBulkDelete,
  onExport,
  onBulkExport,
  onAskAI
}: AnalysisListProps) {
  const { data: session } = useSession()
  const [selectedAnalyses, setSelectedAnalyses] = useState<string[]>([])
  const [isExporting, setIsExporting] = useState(false)

  const handleSelect = (id: string) => {
    setSelectedAnalyses(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  const handleBulkDelete = async () => {
    if (!onBulkDelete || selectedAnalyses.length === 0) return
    try {
      await onBulkDelete(selectedAnalyses)
      setSelectedAnalyses([])
      toast.success('Selected analyses deleted successfully')
    } catch (error) {
      console.error('Error deleting analyses:', error)
      toast.error('Failed to delete analyses')
    }
  }

  const handleBulkExport = async (format: 'pdf' | 'csv') => {
    if (!onBulkExport || selectedAnalyses.length === 0) return
    setIsExporting(true)
    try {
      await onBulkExport(selectedAnalyses, format)
      toast.success(`Selected analyses exported as ${format.toUpperCase()}`)
    } catch (error) {
      console.error('Error exporting analyses:', error)
      toast.error('Failed to export analyses')
    } finally {
      setIsExporting(false)
    }
  }

  const isProOrElite = session?.user?.role === 'pro' || session?.user?.role === 'elite'

  const filteredAnalyses = analyses.filter(analysis => {
    if (filters.search && !analysis.propertyAddress.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    if (filters.type !== 'all' && analysis.type !== filters.type) {
      return false
    }
    return true
  })

  const sortedAnalyses = [...filteredAnalyses].sort((a, b) => {
    switch (filters.sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'price-high':
        return (b.data.price || 0) - (a.data.price || 0)
      case 'price-low':
        return (a.data.price || 0) - (b.data.price || 0)
      case 'revenue-high':
        return (b.data.revenue || 0) - (a.data.revenue || 0)
      case 'revenue-low':
        return (a.data.revenue || 0) - (b.data.revenue || 0)
      default:
        return 0
    }
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {selectedAnalyses.length > 0 && (
            <>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                disabled={!onBulkDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
              {isProOrElite && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" disabled={isExporting}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Selected
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleBulkExport('pdf')}>
                      Export as PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkExport('csv')}>
                      Export as CSV
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedAnalyses.map(analysis => (
          <AnalysisCard
            key={analysis.id}
            analysis={analysis}
            isSelected={selectedAnalyses.includes(analysis.id)}
            onSelect={handleSelect}
            onDelete={onDelete}
            onExport={onExport}
            onAskAI={onAskAI}
          />
        ))}
      </div>
      {sortedAnalyses.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No analyses found</p>
        </div>
      )}
    </div>
  )
} 