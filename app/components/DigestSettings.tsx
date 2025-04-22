import { useState } from 'react';
import { useTier } from '@/app/contextEngine/tier';
import { Button } from '@/app/components/ui/button';
import { Switch } from '@/app/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Checkbox } from '@/app/components/ui/checkbox';
import { AnalysisType } from '@/app/types/analysis';
import { toast } from 'sonner';

interface DigestSettingsProps {
  initialPreferences?: {
    enabled: boolean;
    deliveryDay: 'monday' | 'wednesday' | 'friday';
    analysisTypes: AnalysisType[];
  };
  onSave: (preferences: {
    enabled: boolean;
    deliveryDay: 'monday' | 'wednesday' | 'friday';
    analysisTypes: AnalysisType[];
  }) => void;
}

export function DigestSettings({ initialPreferences, onSave }: DigestSettingsProps) {
  const { tier } = useTier();
  const [enabled, setEnabled] = useState(initialPreferences?.enabled || false);
  const [deliveryDay, setDeliveryDay] = useState(initialPreferences?.deliveryDay || 'monday');
  const [selectedTypes, setSelectedTypes] = useState<AnalysisType[]>(
    initialPreferences?.analysisTypes || []
  );

  const handleSave = () => {
    if (tier === 'free' && enabled) {
      toast.error('Email digests are only available for Pro and Elite users');
      return;
    }

    onSave({
      enabled,
      deliveryDay,
      analysisTypes: selectedTypes
    });

    toast.success('Digest settings updated');
  };

  const handleTypeToggle = (type: AnalysisType) => {
    setSelectedTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Weekly Email Digest</h3>
          <p className="text-sm text-gray-500">
            Get a weekly summary of your saved analyses
          </p>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={setEnabled}
          disabled={tier === 'free'}
        />
      </div>

      {enabled && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">Delivery Day</label>
            <Select value={deliveryDay} onValueChange={(value: 'monday' | 'wednesday' | 'friday') => setDeliveryDay(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monday">Monday</SelectItem>
                <SelectItem value="wednesday">Wednesday</SelectItem>
                <SelectItem value="friday">Friday</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Analysis Types</label>
            <div className="space-y-2">
              {(['mortgage', 'rental', 'wholesale', 'airbnb'] as AnalysisType[]).map(type => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={selectedTypes.includes(type)}
                    onCheckedChange={() => handleTypeToggle(type)}
                  />
                  <label
                    htmlFor={type}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tier === 'free' && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Upgrade to Pro to receive weekly email digests with your saved analyses
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

      <Button onClick={handleSave}>
        Save Settings
      </Button>
    </div>
  );
} 