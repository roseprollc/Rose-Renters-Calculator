import { useState, useEffect } from 'react';
import { useTier } from '@/app/contextEngine/tier';
import { useAnalytics } from '@/app/hooks/useAnalytics';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { toast } from 'sonner';

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  recentTags?: string[];
  maxTags?: number;
}

export function TagSelector({ 
  selectedTags, 
  onTagsChange, 
  recentTags = [], 
  maxTags 
}: TagSelectorProps) {
  const { tier } = useTier();
  const { trackCompareAttempt } = useAnalytics();
  const [newTag, setNewTag] = useState('');
  const [showInput, setShowInput] = useState(false);

  const tierLimits = {
    free: 3,
    pro: 10,
    elite: Infinity
  };

  const limit = maxTags || tierLimits[tier];

  const handleAddTag = (tag: string) => {
    if (!tag.trim()) return;
    
    if (selectedTags.length >= limit) {
      trackCompareAttempt(selectedTags.length + 1);
      toast.error(`Free tier users can only add up to ${limit} tags`);
      return;
    }
    
    if (selectedTags.includes(tag)) {
      toast.error('Tag already added');
      return;
    }
    
    onTagsChange([...selectedTags, tag.trim()]);
    setNewTag('');
    setShowInput(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedTags.map(tag => (
          <Badge 
            key={tag}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="ml-1 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </Badge>
        ))}
        
        {selectedTags.length < limit && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInput(true)}
          >
            + Add Tag
          </Button>
        )}
      </div>

      {showInput && (
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Enter new tag"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddTag(newTag);
              }
            }}
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleAddTag(newTag)}
          >
            Add
          </Button>
        </div>
      )}

      {recentTags.length > 0 && (
        <div className="mt-2">
          <p className="text-sm text-gray-500 mb-1">Recent Tags:</p>
          <div className="flex flex-wrap gap-2">
            {recentTags
              .filter(tag => !selectedTags.includes(tag))
              .map(tag => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleAddTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
          </div>
        </div>
      )}

      {tier === 'free' && selectedTags.length >= limit && (
        <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
          <p>Upgrade to Pro for unlimited tags</p>
          <Button
            variant="link"
            className="p-0 h-auto text-blue-700"
            onClick={() => window.location.href = '/pricing'}
          >
            View Pricing
          </Button>
        </div>
      )}
    </div>
  );
} 