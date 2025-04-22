'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Analysis {
  calculatorType: string;
  version: number;
  data: any;
  pdfUrl: string;
  csvUrl: string | null;
  createdAt: string;
}

export default function SharedAnalysisPage() {
  const params = useParams();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalysis();
  }, [params.id]);

  const fetchAnalysis = async () => {
    try {
      const response = await fetch(`/api/analysis/shared/${params.id}`);
      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      toast.error('Failed to load analysis');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-[#2ecc71] p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-black text-[#2ecc71] p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-mono mb-4">Analysis Not Found</h1>
            <p className="mb-8">This analysis may have been deleted or is no longer available.</p>
            <Link href="/" className="text-[#2ecc71] hover:text-white transition-colors">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#2ecc71] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <Link href="/" className="text-[#2ecc71] hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-4xl font-mono">
              {analysis.calculatorType.charAt(0).toUpperCase() + analysis.calculatorType.slice(1)} Analysis
            </h1>
            <p className="text-sm opacity-75">Version {analysis.version}</p>
          </div>
        </div>

        {/* Analysis Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Results Section */}
            <div className="border border-[#2ecc71] p-6">
              <h2 className="text-2xl font-mono mb-6">Results</h2>
              <div className="space-y-4">
                {Object.entries(analysis.data).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-700">
                    <span className="font-mono">{key}</span>
                    <span className="font-mono">
                      {typeof value === 'number' 
                        ? value.toLocaleString() 
                        : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Download Options */}
            <div className="border border-[#2ecc71] p-6">
              <h3 className="text-xl font-mono mb-4">Download</h3>
              <div className="space-y-4">
                <a
                  href={analysis.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm hover:text-white transition-colors"
                >
                  <Download className="w-4 h-4" />
                  PDF Report
                </a>
                {analysis.csvUrl && (
                  <a
                    href={analysis.csvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-white transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    CSV Data
                  </a>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="border border-[#2ecc71] p-6">
              <h3 className="text-xl font-mono mb-4">Information</h3>
              <div className="space-y-2 text-sm">
                <p>Created: {new Date(analysis.createdAt).toLocaleDateString()}</p>
                <p>Calculator: {analysis.calculatorType}</p>
                <p>Version: {analysis.version}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 