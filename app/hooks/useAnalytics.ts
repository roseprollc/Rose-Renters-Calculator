import { useCallback } from 'react';
import { useTier } from '@/app/contextEngine/tier';

export function useAnalytics() {
  const { tier } = useTier();

  const trackCompareAttempt = useCallback((selectedCount: number) => {
    const maxComparisons = {
      free: 2,
      pro: 5,
      elite: Infinity
    }[tier];

    if (selectedCount > maxComparisons) {
      // Track the attempt to compare more than allowed
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'attempt_compare_exceeds_limit', {
          event_category: 'Compare',
          event_label: tier,
          value: selectedCount,
          max_allowed: maxComparisons
        });
      }
    }
  }, [tier]);

  return {
    trackCompareAttempt
  };
} 