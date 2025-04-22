'use client';

import { useState } from 'react';
import { MapPin, X } from 'lucide-react';

export function CalculatorSection() {
  const [showPreview, setShowPreview] = useState(false);
  const [address, setAddress] = useState('');

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {showPreview ? (
        <div className="bg-[#111111] border border-[#2ecc71]/20 rounded-lg p-6 mb-12
          shadow-[0_0_30px_rgba(46,204,113,0.1)]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#2ecc71] mb-2 flex items-center gap-2">
                <MapPin size={24} />
                {address || "Property Analysis"}
              </h2>
              <div className="flex items-center gap-4 text-gray-400">
                {address ? (
                  <span>Powered by RoseIntel AI</span>
                ) : (
                  <span>Add a property link to get started</span>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowPreview(false)}
              className="text-gray-400 hover:text-[#2ecc71] transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl bg-[#111111] border border-[#2ecc71]/20 rounded-lg p-6 mb-12
          shadow-[0_0_30px_rgba(46,204,113,0.1)] flex flex-col items-center justify-center text-gray-400">
          <p className="text-lg mb-2">Add a property link to start your analysis</p>
          <p className="text-sm">Paste a link from Redfin, Zillow, or Realtor.com to automatically import property details</p>
        </div>
      )}
    </div>
  );
} 