import { useState } from 'react';
import { Analysis } from '@/app/types/analysis';
import { AnalysisCard } from '@/app/components/AnalysisCard';
import { ExportMenu } from '@/app/components/ExportMenu';
import { Button } from '@/app/components/ui/button';
import { toast } from 'sonner';

interface AnalysisListProps {
  analyses: Analysis[];
  onDelete?: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
  onView?: (id: string) => void;
}

export function AnalysisList({ 
  analyses, 
  onDelete, 
  onBulkDelete,
  onView 
}: AnalysisListProps) {
  const [selectedAnalyses, setSelectedAnalyses] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  
  const handleSelect = (id: string, selected: boolean) => {
    setSelectedAnalyses(prev => 
      selected 
        ? [...prev, id] 
        : prev.filter(analysisId => analysisId !== id)
    );
  };
  
  const handleBulkDelete = async () => {
    if (!onBulkDelete || selectedAnalyses.length === 0) return;
    
    try {
      await onBulkDelete(selectedAnalyses);
      setSelectedAnalyses([]);
      toast.success(`Successfully deleted ${selectedAnalyses.length} analyses`);
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast.error('Failed to delete analyses');
    }
  };
  
  const selectedAnalysisObjects = analyses.filter(analysis => 
    selectedAnalyses.includes(analysis.id)
  );
  
  return (
    <div className="space-y-4">
      {selectedAnalyses.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-green-900/20 border border-green-500 rounded-md">
          <div className="flex items-center gap-2">
            <span className="text-green-400">
              {selectedAnalyses.length} {selectedAnalyses.length === 1 ? 'analysis' : 'analyses'} selected
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedAnalyses([])}
              className="bg-black text-green-500 border-green-500 hover:bg-green-900 hover:text-green-400"
            >
              Clear
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <ExportMenu 
              analyses={analyses} 
              selectedAnalyses={selectedAnalysisObjects}
              onExportStart={() => setIsExporting(true)}
              onExportComplete={() => setIsExporting(false)}
            />
            {onBulkDelete && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBulkDelete}
                disabled={isExporting}
                className="bg-black text-red-500 border-red-500 hover:bg-red-900 hover:text-red-400"
              >
                Delete Selected
              </Button>
            )}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {analyses.map(analysis => (
          <AnalysisCard 
            key={analysis.id} 
            analysis={analysis} 
            isSelected={selectedAnalyses.includes(analysis.id)}
            onSelect={handleSelect}
            onDelete={onDelete}
            onView={onView}
          />
        ))}
      </div>
      
      {analyses.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No analyses found</p>
        </div>
      )}
    </div>
  );
} 