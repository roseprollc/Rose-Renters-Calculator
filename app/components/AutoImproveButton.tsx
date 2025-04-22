import { useState } from 'react';
import { useTier } from '@/app/contextEngine/tier';
import { Button } from '@/app/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/app/components/ui/collapsible';
import { Analysis, AutoImproveSuggestion } from '@/app/types/analysis';
import { toast } from 'sonner';

interface AutoImproveButtonProps {
  analysis: Analysis;
  onSuggestionsUpdate: (suggestions: AutoImproveSuggestion[]) => void;
}

export function AutoImproveButton({ analysis, onSuggestionsUpdate }: AutoImproveButtonProps) {
  const { tier } = useTier();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const maxSuggestions = {
    free: 1,
    pro: 3,
    elite: 5
  }[tier];

  const handleImprove = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/ai/autoImprove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysisId: analysis.id,
          type: analysis.type,
          data: analysis
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get suggestions');
      }

      const { suggestions } = await response.json();
      
      // Limit suggestions based on tier
      const limitedSuggestions = suggestions.slice(0, maxSuggestions);
      onSuggestionsUpdate(limitedSuggestions);
      
      if (suggestions.length > maxSuggestions) {
        toast.info(`Upgrade to ${tier === 'free' ? 'Pro' : 'Elite'} for more suggestions`);
      }
    } catch (error) {
      toast.error('Failed to get improvement suggestions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleImprove}
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Analyzing...' : 'Get AI Suggestions'}
      </Button>

      {analysis.autoImproveSuggestions && analysis.autoImproveSuggestions.length > 0 && (
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full">
              {open ? 'Hide Suggestions' : 'Show Suggestions'}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            {analysis.autoImproveSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="p-4 rounded-lg border border-gray-200"
              >
                <p className="font-medium">{suggestion.suggestion}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Potential Impact: {suggestion.impact}
                </p>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}

      {tier === 'free' && (
        <div className="p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-sm text-blue-700">
            Upgrade to Pro for more detailed improvement suggestions
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
    </div>
  );
} 