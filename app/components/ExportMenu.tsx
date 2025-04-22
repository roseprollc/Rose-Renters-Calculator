import { useState } from 'react';
import { useTier } from '@/app/contextEngine/tier';
import { Analysis } from '@/app/types/analysis';
import { generatePDF, generateCSV, generateCombinedPDF, generateCombinedCSV } from '@/app/lib/exportUtils';
import { Button } from '@/app/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/app/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface ExportMenuProps {
  analyses: Analysis[];
  selectedAnalyses?: Analysis[];
  onExportStart?: () => void;
  onExportComplete?: () => void;
}

export function ExportMenu({ 
  analyses, 
  selectedAnalyses = [], 
  onExportStart,
  onExportComplete 
}: ExportMenuProps) {
  const { tier } = useTier();
  const [isExporting, setIsExporting] = useState(false);
  
  // Determine if we're doing a bulk export
  const isBulkExport = selectedAnalyses.length > 0;
  const analysesToExport = isBulkExport ? selectedAnalyses : analyses;
  
  // Check if bulk export is allowed based on tier
  const canBulkExport = tier === 'pro' ? analysesToExport.length <= 5 : tier === 'elite';
  
  const handleExport = async (format: 'pdf' | 'csv') => {
    // Check if bulk export is allowed
    if (isBulkExport && !canBulkExport) {
      toast.error('Upgrade to Pro to export multiple analyses at once');
      return;
    }
    
    try {
      setIsExporting(true);
      onExportStart?.();
      
      let blob: Blob | string;
      let filename: string;
      
      if (format === 'pdf') {
        blob = isBulkExport 
          ? await generateCombinedPDF(analysesToExport)
          : await generatePDF(analysesToExport[0]);
        filename = `analysis${isBulkExport ? '-bulk' : ''}.pdf`;
      } else {
        blob = isBulkExport
          ? generateCombinedCSV(analysesToExport)
          : generateCSV(analysesToExport[0]);
        filename = `analysis${isBulkExport ? '-bulk' : ''}.csv`;
      }
      
      // Create download link
      const url = typeof blob === 'string' 
        ? `data:text/csv;charset=utf-8,${encodeURIComponent(blob)}`
        : URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      if (typeof blob !== 'string') {
        URL.revokeObjectURL(url);
      }
      
      toast.success(`Successfully exported ${isBulkExport ? 'analyses' : 'analysis'} as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Failed to export as ${format.toUpperCase()}`);
    } finally {
      setIsExporting(false);
      onExportComplete?.();
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          disabled={isExporting}
          className="bg-black text-green-500 border-green-500 hover:bg-green-900 hover:text-green-400"
        >
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-black border-green-500">
        <DropdownMenuItem 
          onClick={() => handleExport('pdf')}
          className="text-green-500 hover:bg-green-900 hover:text-green-400 cursor-pointer"
        >
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleExport('csv')}
          className="text-green-500 hover:bg-green-900 hover:text-green-400 cursor-pointer"
        >
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 