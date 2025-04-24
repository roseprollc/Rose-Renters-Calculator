import { useState } from 'react'
import { format } from 'date-fns'
import { 
  Edit2, 
  Share2, 
  Star, 
  Clock, 
  Tag, 
  Trash2, 
  Download,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/app/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { Checkbox } from '@/app/components/ui/checkbox'
import { ExportMenu } from '@/app/components/ExportMenu'
import { formatCurrency, formatPercentage } from '@/app/lib/utils'
import { Analysis } from '@/app/types/analysis'

interface AnalysisCardProps {
  analysis: Analysis
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onDownload: (id: string) => void
  isSelected?: boolean
  onSelect?: (id: string, selected: boolean) => void
  onView?: (id: string) => void
}

export function AnalysisCard({ 
  analysis, 
  onEdit, 
  onDelete, 
  onDownload,
  isSelected = false,
  onSelect,
  onView
}: AnalysisCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await onDelete(analysis.id)
      toast.success('Analysis deleted successfully')
    } catch (error) {
      console.error('Error deleting analysis:', error)
      toast.error('Failed to delete analysis')
    } finally {
      setIsDeleting(false)
    }
  }
  
  const handleView = () => {
    if (onView) {
      onView(analysis.id)
    }
  }
  
  const handleSelect = (checked: boolean) => {
    if (onSelect) {
      onSelect(analysis.id, checked)
    }
  }
  
  // Format metrics based on analysis type
  const getMetrics = () => {
    switch (analysis.type) {
      case 'mortgage':
        return [
          { label: 'Monthly Payment', value: formatCurrency(analysis.monthlyPayment) },
          { label: 'Down Payment', value: formatCurrency(analysis.downPayment) },
          { label: 'Interest Rate', value: formatPercentage(analysis.interestRate) }
        ]
      case 'rental':
        return [
          { label: 'Monthly Rent', value: formatCurrency(analysis.monthlyRent) },
          { label: 'Cash Flow', value: formatCurrency(analysis.monthlyCashFlow) },
          { label: 'Cap Rate', value: formatPercentage(analysis.capRate) }
        ]
      case 'wholesale':
        return [
          { label: 'ARV', value: formatCurrency(analysis.arv) },
          { label: 'Repair Costs', value: formatCurrency(analysis.repairCosts) },
          { label: 'Potential Profit', value: formatPercentage(analysis.potentialProfit) }
        ]
      case 'airbnb':
        return [
          { label: 'Nightly Rate', value: formatCurrency(analysis.nightlyRate) },
          { label: 'Monthly Revenue', value: formatCurrency(analysis.monthlyRevenue) },
          { label: 'Occupancy Rate', value: formatPercentage(analysis.occupancyRate) }
        ]
      default:
        return []
    }
  }
  
  const metrics = getMetrics()
  
  return (
    <Card className="bg-black border-green-500 hover:border-green-400 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-green-500 text-lg">{analysis.propertyAddress}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="bg-green-900 text-green-400 border-green-500">
                {analysis.type.charAt(0).toUpperCase() + analysis.type.slice(1)}
              </Badge>
              {analysis.tags && analysis.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {analysis.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-gray-800 text-gray-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          {onSelect && (
            <Checkbox 
              checked={isSelected} 
              onCheckedChange={handleSelect}
              className="border-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-black"
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-3 gap-2">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <p className="text-xs text-gray-400">{metric.label}</p>
              <p className="text-sm font-medium text-green-400">{metric.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleView}
            className="bg-black text-green-500 border-green-500 hover:bg-green-900 hover:text-green-400"
          >
            View
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-black text-red-500 border-red-500 hover:bg-red-900 hover:text-red-400"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
        <ExportMenu analyses={[analysis]} />
      </CardFooter>
    </Card>
  )
} 