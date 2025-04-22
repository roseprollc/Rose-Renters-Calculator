import { useState } from 'react';
import { Analysis } from '@/app/types/analysis';
import { AnalysisCard } from '@/app/components/AnalysisCard';
import { ExportMenu } from '@/app/components/ExportMenu';
import { Button } from '@/app/components/ui/button';
import { toast } from 'sonner';

interface AnalysisListProps {
  analyses: Analysis[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDownload?: (id: string) => void;
  onView?: (id: string) => void;
  showBulkActions?: boolean;
}

export function AnalysisList({
  analyses,
  onEdit,
  onDelete,
  onDownload,
  onView,
  showBulkActions = false
}: AnalysisListProps) {
  const [selectedAnalyses, setSelectedAnalyses] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  
  const handleSelect = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedAnalyses(prev => [...prev, id]);
    } else {
      setSelectedAnalyses(prev => prev.filter(analysisId => analysisId !== id));
    }
  };
  
  const handleSelectAll = () => {
    if (selectedAnalyses.length === analyses.length) {
      setSelectedAnalyses([]);
    } else {
      setSelectedAnalyses(analyses.map(analysis => analysis.id));
    }
  };
  
  const handleBulkDelete = async () => {
    if (!onDelete) return;
    
    try {
      await Promise.all(selectedAnalyses.map(id => onDelete(id)));
      setSelectedAnalyses([]);
      toast.success(`Successfully deleted ${selectedAnalyses.length} analyses`);
    } catch (error) {
      console.error('Error deleting analyses:', error);
      toast.error('Failed to delete analyses');
    }
  };
  
  const selectedAnalysisObjects = analyses.filter(analysis => 
    selectedAnalyses.includes(analysis.id)
  );
  
  return (
    <div className="space-y-4">
      {showBulkActions && analyses.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="bg-black text-green-500 border-green-500 hover:bg-green-900 hover:text-green-400"
            >
              {selectedAnalyses.length === analyses.length ? 'Deselect All' : 'Select All'}
            </Button>
            {selectedAnalyses.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="bg-black text-red-500 border-red-500 hover:bg-red-900 hover:text-red-400"
                >
                  Delete Selected
                </Button>
                <ExportMenu 
                  analyses={analyses.filter(a => selectedAnalyses.includes(a.id))}
                  selectedAnalyses={selectedAnalysisObjects}
                  onExportStart={() => setIsExporting(true)}
                  onExportComplete={() => setIsExporting(false)}
                />
              </>
            )}
          </div>
          <p className="text-sm text-gray-400">
            {selectedAnalyses.length} of {analyses.length} selected
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {analyses.map(analysis => (
          <AnalysisCard 
            key={analysis.id} 
            analysis={analysis} 
            onEdit={onEdit || (() => {})}
            onDelete={onDelete || (() => {})}
            onDownload={onDownload || (() => {})}
            isSelected={selectedAnalyses.includes(analysis.id)}
            onSelect={handleSelect}
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