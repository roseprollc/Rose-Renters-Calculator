'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Share2, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Report {
  _id: string;
  calculatorType: string;
  version: number;
  notes: string;
  tags: string[];
  pdfUrl: string;
  csvUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ReportsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
        
        if (data.authenticated) {
          fetchReports();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const fetchReports = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedType) params.append('calculatorType', selectedType);
      if (selectedTags.length) params.append('tags', selectedTags.join(','));

      const response = await fetch(`/api/reports?${params}`);
      const data = await response.json();
      setReports(data.reports);
    } catch (error) {
      toast.error('Failed to fetch reports');
    }
  };

  const handleShare = async (reportId: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/share`, {
        method: 'POST',
      });
      const { publicUrl } = await response.json();
      await navigator.clipboard.writeText(publicUrl);
      toast.success('Share link copied to clipboard');
    } catch (error) {
      toast.error('Failed to generate share link');
    }
  };

  const handleDelete = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;

    try {
      await fetch(`/api/reports/${reportId}`, {
        method: 'DELETE',
      });
      setReports(reports.filter(r => r._id !== reportId));
      toast.success('Report deleted');
    } catch (error) {
      toast.error('Failed to delete report');
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-[#2ecc71] p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-mono mb-8">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-[#2ecc71] p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-mono mb-8">Please sign in to view your reports</h1>
          <Link href="/login" className="text-[#2ecc71] hover:text-white transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#2ecc71] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <Link href="/dashboard" className="text-[#2ecc71] hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-4xl font-mono">Saved Reports</h1>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-black border border-[#2ecc71] px-4 py-2 font-mono"
          />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-black border border-[#2ecc71] px-4 py-2 font-mono"
          >
            <option value="">All Calculators</option>
            <option value="mortgage">Mortgage</option>
            <option value="rental">Rental</option>
            <option value="airbnb">Airbnb</option>
            <option value="wholesale">Wholesale</option>
          </select>
          <div className="flex gap-2">
            {['investment', 'residential', 'commercial'].map(tag => (
              <button
                key={tag}
                onClick={() => {
                  setSelectedTags(prev =>
                    prev.includes(tag)
                      ? prev.filter(t => t !== tag)
                      : [...prev, tag]
                  );
                }}
                className={`px-4 py-2 border ${
                  selectedTags.includes(tag)
                    ? 'bg-[#2ecc71] text-black'
                    : 'border-[#2ecc71]'
                } font-mono`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Reports Grid */}
        {reports.length === 0 ? (
          <div className="text-center">No reports found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map(report => (
              <div
                key={report._id}
                className="border border-[#2ecc71] p-6 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-mono">
                      {report.calculatorType.charAt(0).toUpperCase() + report.calculatorType.slice(1)}
                    </h3>
                    <p className="text-sm opacity-75">
                      Version {report.version}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleShare(report._id)}
                      className="p-2 hover:bg-[#2ecc71] hover:text-black transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(report._id)}
                      className="p-2 hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="font-mono text-sm">{report.notes}</p>

                <div className="flex flex-wrap gap-2">
                  {report.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-[#2ecc71]/10 text-sm font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 pt-4 border-t border-[#2ecc71]/20">
                  <a
                    href={report.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-white transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </a>
                  {report.csvUrl && (
                    <a
                      href={report.csvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm hover:text-white transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download CSV
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 