'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

export function HeroSection() {
  const [selectedMode, setSelectedMode] = useState('airbnb');

  return (
    <div className="flex flex-col items-center px-4 pt-20 pb-16">
      <h1 className="text-4xl md:text-6xl font-mono font-bold mb-6 text-center text-[#2ecc71] [text-shadow:_0_0_30px_rgba(46,204,113,0.3)]">
        AI-powered Real Estate Strategy Starts Here
      </h1>
      <p className="text-lg font-mono text-gray-400 text-center mb-12">
        Analyze LTR, STR, and Wholesale deals instantly with Smart Import.
      </p>

      {/* Mode Tabs */}
      <div className="flex justify-center gap-2 mb-8">
        {['mortgage', 'renters', 'airbnb', 'wholesale'].map((mode) => (
          <button
            key={mode}
            onClick={() => setSelectedMode(mode)}
            className={`px-6 py-2 font-mono text-base transition-all duration-300
              ${selectedMode === mode
                ? 'bg-[#2ecc71] text-black'
                : 'border border-[#2ecc71] text-[#2ecc71]'
              }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {/* Smart Import Form */}
      <form className="w-full max-w-2xl flex gap-2 mb-16">
        <input
          type="text"
          name="url"
          placeholder="Add a property link to analyze (e.g., https://www.redfin.com/...)"
          className="flex-1 px-4 py-3 bg-[#111111] font-mono text-white placeholder-gray-500
            focus:outline-none focus:ring-1 focus:ring-[#2ecc71]"
        />
        <button
          type="submit"
          className="px-4 py-3 bg-[#2ecc71] text-black font-mono font-bold
            hover:bg-[#27ae60] transition-colors flex items-center gap-2"
        >
          <Search size={18} />
          Smart Import
        </button>
      </form>
    </div>
  );
} 