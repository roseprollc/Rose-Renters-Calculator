'use client'

import { useState } from 'react'
import { formatCurrency, formatDate } from '@/app/lib/utils'
import { Analysis } from '@/app/types/analysis'
import { Button } from '@/app/components/ui/button'
import { Checkbox } from '@/app/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Trash2, Download, Brain, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/app/components/ui/dropdown-menu'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/app/components/ui/collapsible'
import { useUserTier } from '@/app/contextLayer/userContext'
import { Badge } from '@/app/components/ui/badge'
import { ExportMenu } from '@/app/components/ExportMenu'
import { VersionHistory } from '@/app/components/VersionHistory'

interface AnalysisCardProps {
  analysis: Analysis
  isSelected: boolean
  onSelect: (id: string) => void
  onDelete?: (id: string) => void
  onExport?: (id: string, format: 'pdf' | 'csv') => void
  onAskAI?: (id: string) => Promise<string | null>
  onVersionRestored?: () => void
}

export function AnalysisCard({ 
  analysis, 
  isSelected, 
  onSelect, 
  onDelete,
  onExport,
  onAskAI,
  onVersionRestored
}: AnalysisCardProps) {
  const { data: session } = useSession()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isAskingAI, setIsAskingAI] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)
  const [aiResponse, setAIResponse] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [insights, setInsights] = useState<string | null>(null)
  const userTier = useUserTier()

  const handleDelete = async () => {
    if (!onDelete) return
    setIsDeleting(true)
    try {
      await onDelete(analysis.id)
    } catch (error) {
      console.error('Error deleting analysis:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleExport = async (format: 'pdf' | 'csv') => {
    if (!onExport) return
    setIsExporting(true)
    try {
      await onExport(analysis.id, format)
      toast.success(`Analysis exported as ${format.toUpperCase()}`)
    } catch (error) {
      console.error('Error exporting analysis:', error)
      toast.error('Failed to export analysis')
    } finally {
      setIsExporting(false)
    }
  }

  const handleAskAI = async () => {
    if (!onAskAI) return
    setIsAskingAI(true)
    try {
      setIsLoading(true)
      
      // Prepare metrics based on analysis type
      const metrics: Record<string, any> = {}
      
      if (analysis.type === 'mortgage') {
        metrics.monthlyPayment = analysis.monthlyPayment
        metrics.totalCost = analysis.totalCost
        metrics.roi = analysis.roi
        metrics.interestRate = analysis.interestRate
      } else if (analysis.type === 'rental') {
        metrics.monthlyCashFlow = analysis.monthlyCashFlow
        metrics.annualCashFlow = analysis.annualCashFlow
        metrics.capRate = analysis.capRate
      } else if (analysis.type === 'wholesale') {
        metrics.arv = analysis.arv
        metrics.potentialProfit = analysis.potentialProfit
        metrics.totalInvestment = analysis.totalInvestment
        metrics.repairCosts = analysis.repairCosts
      } else if (analysis.type === 'airbnb') {
        metrics.monthlyRevenue = analysis.monthlyRevenue
        metrics.monthlyProfit = analysis.monthlyProfit
        metrics.nightlyRate = analysis.nightlyRate
      }

      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysisId: analysis._id,
          address: analysis.propertyAddress,
          type: analysis.type,
          metrics,
          notes: analysis.notes
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate insights')
      }

      const data = await response.json()
      setInsights(data.insights)
      
      // Expand the card to show insights
      setIsExpanded(true)
    } catch (error) {
      console.error('Error generating insights:', error)
      toast.error('Unable to retrieve AI insights. Please try again later.')
    } finally {
      setIsAskingAI(false)
      setIsLoading(false)
    }
  }

  const getKeyMetrics = () => {
    switch (analysis.type) {
      case 'mortgage':
        return [
          { label: 'Monthly Payment', value: formatCurrency(analysis.monthlyPayment) },
          { label: 'Total Cost', value: formatCurrency(analysis.totalCost) },
          { label: 'ROI', value: `${analysis.roi.toFixed(2)}%` }
        ]
      case 'rental':
        return [
          { label: 'Monthly Cash Flow', value: formatCurrency(analysis.monthlyCashFlow) },
          { label: 'Cap Rate', value: `${analysis.capRate.toFixed(2)}%` },
          { label: 'Annual Cash Flow', value: formatCurrency(analysis.annualCashFlow) }
        ]
      case 'wholesale':
        return [
          { label: 'ARV', value: formatCurrency(analysis.arv) },
          { label: 'Potential Profit', value: formatCurrency(analysis.potentialProfit) },
          { label: 'Total Investment', value: formatCurrency(analysis.totalInvestment) }
        ]
      case 'airbnb':
        return [
          { label: 'Monthly Revenue', value: formatCurrency(analysis.monthlyRevenue) },
          { label: 'Monthly Profit', value: formatCurrency(analysis.monthlyProfit) },
          { label: 'Nightly Rate', value: formatCurrency(analysis.nightlyRate) }
        ]
      default:
        return []
    }
  }

  const isProOrElite = session?.user?.role === 'pro' || session?.user?.role === 'elite'

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {analysis.propertyAddress}
          </CardTitle>
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(analysis.id)}
            className="h-4 w-4"
          />
        </div>
        <div className="text-sm text-gray-500">
          {formatDate(analysis.createdAt)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analysis.aiSummary && (
            <div className="text-sm text-gray-600">
              {analysis.aiSummary}
            </div>
          )}
          <div className="grid grid-cols-3 gap-4">
            {getKeyMetrics().map((metric) => (
              <div key={metric.label} className="text-center">
                <div className="text-sm text-gray-500">{metric.label}</div>
                <div className="font-semibold">{metric.value}</div>
              </div>
            ))}
          </div>
          {analysis.notes && (
            <div className="text-sm text-gray-600">
              <strong>Notes:</strong> {analysis.notes}
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Analysis Details</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="overview">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="metrics">Metrics</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold">Property Address</h3>
                        <p>{analysis.propertyAddress}</p>
                      </div>
                      {analysis.notes && (
                        <div>
                          <h3 className="font-semibold">Notes</h3>
                          <p>{analysis.notes}</p>
                        </div>
                      )}
                      {analysis.aiSummary && (
                        <div>
                          <h3 className="font-semibold">AI Summary</h3>
                          <p>{analysis.aiSummary}</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="metrics">
                    <div className="grid grid-cols-2 gap-4">
                      {getKeyMetrics().map((metric) => (
                        <div key={metric.label}>
                          <h3 className="font-semibold">{metric.label}</h3>
                          <p>{metric.value}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="history">
                    {analysis.versions && analysis.versions.length > 0 ? (
                      <div className="space-y-4">
                        {analysis.versions.map((version) => (
                          <div key={version.id} className="border-b pb-2">
                            <div className="text-sm text-gray-500">
                              {formatDate(version.createdAt)}
                            </div>
                            {version.notes && (
                              <div className="text-sm">{version.notes}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">No version history available</div>
                    )}
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>

            {isProOrElite && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" disabled={isExporting}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExport('pdf')}>
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('csv')}>
                    Export as CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {userTier !== 'free' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAskAI}
                disabled={isLoading}
                className="flex items-center space-x-1"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Brain className="h-4 w-4" />
                )}
                <span>Ask AI</span>
              </Button>
            )}

            {onDelete && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDelete} 
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : <Trash2 className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
      </Collapsible>

      <CollapsibleContent className="mt-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          {getKeyMetrics().map((metric, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-500">{metric.label}</p>
              <p className="font-medium">{metric.value}</p>
            </div>
          ))}
        </div>

        {insights && (
          <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-100">
            <h4 className="font-medium text-blue-800 mb-2 flex items-center">
              <Brain className="h-4 w-4 mr-2" />
              AI Insights
            </h4>
            <p className="text-sm text-blue-700">{insights}</p>
          </div>
        )}

        {analysis.notes && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Notes</h4>
            <p className="text-sm text-gray-700">{analysis.notes}</p>
          </div>
        )}
      </CollapsibleContent>

      <CardFooter className="flex justify-between pt-2">
        <div className="flex gap-2">
          <VersionHistory 
            analysis={analysis} 
            onVersionRestored={onVersionRestored} 
          />
          <ExportMenu analysis={analysis} />
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleDelete} 
          disabled={isDeleting}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </CardFooter>
    </Card>
  )
} 