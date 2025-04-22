'use client';

import { useState, useEffect } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { HeroSection } from './sections/HeroSection';
import { CalculatorSection } from './sections/CalculatorSection';
import { FeaturesSection } from './sections/FeaturesSection';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black">
        <HeroSection />
        <CalculatorSection />
        <FeaturesSection />
      </div>
    </ErrorBoundary>
  );
} 