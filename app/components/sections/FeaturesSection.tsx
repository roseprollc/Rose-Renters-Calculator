'use client';

import { Star, Calculator, FileText } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: <Star className="w-12 h-12" />,
      title: "Smart Import",
      description: "Instantly analyze properties from major listing sites"
    },
    {
      icon: <Calculator className="w-12 h-12" />,
      title: "AI Analysis",
      description: "Get intelligent insights and recommendations"
    },
    {
      icon: <FileText className="w-12 h-12" />,
      title: "Detailed Reports",
      description: "Export professional investment analysis PDFs"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <div
          key={index}
          className="bg-[#0a0a0a] p-8 text-center"
        >
          <div className="text-[#2ecc71] mb-6">
            {feature.icon}
          </div>
          <h3 className="text-xl font-mono font-bold mb-3 text-[#2ecc71]">{feature.title}</h3>
          <p className="text-gray-400 font-mono text-sm">{feature.description}</p>
        </div>
      ))}
    </div>
  );
} 