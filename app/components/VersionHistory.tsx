import { useState } from 'react';
import { format } from 'date-fns';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { History, RotateCcw } from 'lucide-react';
import { Analysis, AnalysisVersion } from '@/app/types/analysis';
import { toast } from 'sonner';
import { useTier } from '@/app/contextEngine/tier';

interface VersionHistoryProps {
  analysis: Analysis;
  onVersionRestored?: () => void;
}

export function VersionHistory({ analysis, onVersionRestored }: VersionHistoryProps) {
  const { isProOrElite } = useTier();
  const [versions, setVersions] = useState<AnalysisVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('timeline');

  const maxVersionsToShow = isProOrElite ? versions.length : Math.min(2, versions.length);

  const handleRestoreVersion = async (versionId: string) => {
    if (!isProOrElite) {
      toast.error('This feature requires a Pro or Elite subscription');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/analyses/restore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysisId: analysis.id,
          versionIndex: versions.findIndex(v => v.id === versionId),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to restore version');
      }

      toast.success('Version restored successfully');
      if (onVersionRestored) {
        onVersionRestored();
      }
      setOpen(false);
    } catch (error) {
      console.error('Error restoring version:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to restore version');
    } finally {
      setLoading(false);
    }
  };

  const renderVersionDetails = (version: AnalysisVersion) => {
    const data = version.data || {};
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {format(new Date(version.createdAt), 'MMM d, yyyy h:mm a')}
          </span>
          {isProOrElite && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRestoreVersion(version.id)}
              disabled={loading}
              className="flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              Restore
            </Button>
          )}
        </div>
        
        {version.notes && (
          <div className="text-sm">
            <span className="font-medium">Notes:</span> {version.notes}
          </div>
        )}
        
        {version.aiInsights && (
          <div className="text-sm">
            <span className="font-medium">AI Insights:</span> {version.aiInsights}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="font-medium">{key}:</span>
              <span>{typeof value === 'number' ? value.toLocaleString() : String(value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <History className="h-4 w-4" />
          History
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Version History</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="compare">Compare</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timeline" className="mt-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : versions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No version history available
              </div>
            ) : (
              <div className="space-y-6">
                {versions.slice(0, maxVersionsToShow).map((version, index) => (
                  <div 
                    key={version.id} 
                    className={`p-4 rounded-lg border ${
                      index === 0 ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    {index === 0 && (
                      <Badge className="mb-2">Current Version</Badge>
                    )}
                    {renderVersionDetails(version)}
                  </div>
                ))}
                
                {!isProOrElite && versions.length > 2 && (
                  <div className="text-center text-sm text-gray-500">
                    Upgrade to Pro or Elite to view full version history
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="compare" className="mt-4">
            {isProOrElite ? (
              <div className="text-center py-8 text-gray-500">
                Compare feature coming soon
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Upgrade to Pro or Elite to compare versions
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 