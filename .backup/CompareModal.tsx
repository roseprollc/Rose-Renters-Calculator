import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Analysis } from '@/app/types/analysis';
import { formatCurrency, formatDate } from '@/app/lib/utils';
import { useTier } from '@/app/contextEngine/tier';
import { toast } from 'sonner';
import { ErrorBoundary } from './ErrorBoundary';

interface CompareModalProps {
  analyses: Analysis[];
  onClose?: () => void;
}

export function CompareModal({ analyses, onClose }: CompareModalProps) {
  const { tier } = useTier();
  const [open, setOpen] = useState(true);

  const maxComparisons = {
    free: 2,
    pro: 5,
    elite: Infinity
  }[tier];

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  const getKeyMetrics = (analysis: Analysis) => {
    switch (analysis.type) {
      case 'mortgage':
        return [
          { label: 'Monthly Payment', value: analysis.monthlyPayment },
          { label: 'Total Cost', value: analysis.totalCost },
          { label: 'ROI', value: analysis.roi }
        ];
      case 'rental':
        return [
          { label: 'Monthly Cash Flow', value: analysis.monthlyCashFlow },
          { label: 'Cap Rate', value: analysis.capRate },
          { label: 'Annual Cash Flow', value: analysis.annualCashFlow }
        ];
      case 'wholesale':
        return [
          { label: 'ARV', value: analysis.arv },
          { label: 'Potential Profit', value: analysis.potentialProfit },
          { label: 'Total Investment', value: analysis.totalInvestment }
        ];
      case 'airbnb':
        return [
          { label: 'Monthly Revenue', value: analysis.monthlyRevenue },
          { label: 'Monthly Profit', value: analysis.monthlyProfit },
          { label: 'Nightly Rate', value: analysis.nightlyRate }
        ];
      default:
        return [];
    }
  };

  const findBestValue = (analyses: Analysis[], metric: string) => {
    return analyses.reduce((best, current) => {
      const currentValue = current[metric as keyof Analysis];
      const bestValue = best[metric as keyof Analysis];
      
      if (typeof currentValue === 'number' && typeof bestValue === 'number') {
        return currentValue > bestValue ? current : best;
      }
      return best;
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Compare Analyses</DialogTitle>
        </DialogHeader>
        
        <div className="h-[calc(90vh-8rem)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {analyses.map((analysis) => {
              const metrics = getKeyMetrics(analysis);
              const bestAnalysis = findBestValue(analyses, metrics[0]?.label.toLowerCase() || '');
              
              return (
                <div 
                  key={analysis.id}
                  className={`p-4 rounded-lg border ${
                    analysis.id === bestAnalysis.id ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold">{analysis.propertyAddress}</h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(analysis.createdAt)}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      {metrics.map((metric) => (
                        <div key={metric.label} className="flex justify-between">
                          <span className="text-sm font-medium">{metric.label}:</span>
                          <span className="text-sm">
                            {typeof metric.value === 'number' 
                              ? formatCurrency(metric.value)
                              : metric.value}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {analysis.notes && (
                      <div className="text-sm">
                        <span className="font-medium">Notes:</span> {analysis.notes}
                      </div>
                    )}
                    
                    {analysis.aiInsights && (
                      <div className="text-sm">
                        <span className="font-medium">AI Insights:</span> {analysis.aiInsights}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {tier === 'free' && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-sm text-blue-700">
              Upgrade to Pro to compare more than 2 deals at once
            </p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => window.location.href = '/pricing'}
            >
              View Pricing
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 