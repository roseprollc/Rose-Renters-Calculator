"use client"

import { useState, useEffect } from 'react'
import { 
  FileText, 
  Download, 
  Trash2, 
  MapPin, 
  Filter, 
  Search, 
  BarChart2, 
  PieChart, 
  Calendar, 
  DollarSign, 
  Home, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Plus, 
  Edit2, 
  Share2, 
  Star, 
  Clock, 
  Tag
} from 'lucide-react'
import PageLayout from '../components/PageLayout'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

// Force dynamic rendering to prevent static generation
export const dynamic = 'force-dynamic'

interface Analysis {
  _id: string
  userId: string
  calculatorType: string
  data: {
    propertyPrice: number
    downPayment: number
    interestRate: number
    loanTerm: number
    analytics: {
      loanSummary: {
        totalLoanAmount: number
        totalInterest: number
        totalPayments: number
      }
      paymentBreakdown: {
        principal: number
        interest: number
        propertyTax: number
        insurance: number
        pmi: number
      }
      riskAnalysis: {
        debtToIncomeRatio: number
        loanToValueRatio: number
        frontEndRatio: number
        backEndRatio: number
        housingExpenseRatio: number
      }
    }
  }
  version: number
  pdfUrl?: string
  csvUrl?: string
  createdAt: string
  updatedAt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    fetchAnalyses()
  }, [])

  const fetchAnalyses = async () => {
    try {
      const response = await fetch('/api/analysis')
      const data = await response.json()

      if (response.ok) {
        setAnalyses(data.analyses || [])
      } else {
        if (response.status === 401) {
          router.push('/login')
        }
      }
    } catch (error) {
      console.error('Error fetching analyses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadPDF = async (analysis: Analysis) => {
    const content = `
Property Analysis Report
-----------------------
Type: ${analysis.calculatorType}
Price: $${analysis.data.propertyPrice.toLocaleString()}
Down Payment: $${analysis.data.downPayment.toLocaleString()}
Interest Rate: ${analysis.data.interestRate}%
Loan Term: ${analysis.data.loanTerm} years

Loan Summary:
Total Loan Amount: $${analysis.data.analytics.loanSummary.totalLoanAmount.toLocaleString()}
Total Interest: $${analysis.data.analytics.loanSummary.totalInterest.toLocaleString()}
Total Payments: $${analysis.data.analytics.loanSummary.totalPayments.toLocaleString()}

Payment Breakdown:
Principal: $${analysis.data.analytics.paymentBreakdown.principal.toLocaleString()}
Interest: $${analysis.data.analytics.paymentBreakdown.interest.toLocaleString()}
Property Tax: $${analysis.data.analytics.paymentBreakdown.propertyTax.toLocaleString()}
Insurance: $${analysis.data.analytics.paymentBreakdown.insurance.toLocaleString()}
PMI: $${analysis.data.analytics.paymentBreakdown.pmi.toLocaleString()}

Risk Analysis:
DTI Ratio: ${analysis.data.analytics.riskAnalysis.debtToIncomeRatio}%
LTV Ratio: ${analysis.data.analytics.riskAnalysis.loanToValueRatio}%
Front-end Ratio: ${analysis.data.analytics.riskAnalysis.frontEndRatio}%
Back-end Ratio: ${analysis.data.analytics.riskAnalysis.backEndRatio}%
Housing Expense Ratio: ${analysis.data.analytics.riskAnalysis.housingExpenseRatio}%

Generated: ${new Date(analysis.createdAt).toLocaleDateString()}
    `.trim()

    const blob = new Blob([content], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analysis-${analysis._id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const handleDeleteAnalysis = async (id: string) => {
    try {
      const response = await fetch(`/api/analysis/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setAnalyses(analyses.filter(a => a._id !== id))
      }
    } catch (error) {
      console.error('Error deleting analysis:', error)
    }
  }

  const filteredAnalyses = analyses
    .filter(analysis => {
      // Filter by search query
      if (searchQuery && !analysis.calculatorType.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      
      // Filter by type
      if (filterType !== 'all' && analysis.calculatorType !== filterType) {
        return false
      }
      
      return true
    })
    .sort((a, b) => {
      // Sort by selected criteria
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'price-high':
          return b.data.propertyPrice - a.data.propertyPrice
        case 'price-low':
          return a.data.propertyPrice - b.data.propertyPrice
        case 'revenue-high':
          return b.data.analytics.loanSummary.totalPayments - a.data.analytics.loanSummary.totalPayments
        case 'revenue-low':
          return a.data.analytics.loanSummary.totalPayments - b.data.analytics.loanSummary.totalPayments
        default:
          return 0
      }
    })

  const getTotalProperties = () => analyses.length
  const getAveragePrice = () => {
    if (analyses.length === 0) return 0
    const total = analyses.reduce((sum, a) => sum + a.data.propertyPrice, 0)
    return Math.round(total / analyses.length)
  }
  const getTotalRevenue = () => {
    return analyses.reduce((sum, a) => sum + a.data.analytics.loanSummary.totalPayments, 0)
  }
  const getPropertyTypes = () => {
    const types = analyses.map(a => a.calculatorType)
    return Array.from(new Set(types))
  }

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-black border border-[#2ecc71] p-4 rounded-lg">
        <h3 className="text-lg font-mono mb-2">Total Properties</h3>
        <p className="text-2xl font-mono">{getTotalProperties()}</p>
      </div>
      <div className="bg-black border border-[#2ecc71] p-4 rounded-lg">
        <h3 className="text-lg font-mono mb-2">Average Price</h3>
        <p className="text-2xl font-mono">${getAveragePrice().toLocaleString()}</p>
      </div>
      <div className="bg-black border border-[#2ecc71] p-4 rounded-lg">
        <h3 className="text-lg font-mono mb-2">Total Revenue</h3>
        <p className="text-2xl font-mono">${getTotalRevenue().toLocaleString()}</p>
      </div>
      <div className="bg-black border border-[#2ecc71] p-4 rounded-lg">
        <h3 className="text-lg font-mono mb-2">Property Types</h3>
        <p className="text-2xl font-mono">{getPropertyTypes().join(', ')}</p>
      </div>
    </div>
  )

  const renderAnalyses = () => (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#111111] border border-[#2ecc71]/20 rounded px-4 py-2 text-white focus:outline-none focus:border-[#2ecc71]"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-[#111111] border border-[#2ecc71]/20 rounded px-4 py-2 text-white focus:outline-none focus:border-[#2ecc71]"
            >
              <option value="all">All Types</option>
              <option value="airbnb">Airbnb</option>
              <option value="renters">Renters</option>
              <option value="mortgage">Mortgage</option>
              <option value="wholesale">Wholesale</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#111111] border border-[#2ecc71]/20 rounded px-4 py-2 text-white focus:outline-none focus:border-[#2ecc71]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-high">Price (High to Low)</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="revenue-high">Revenue (High to Low)</option>
              <option value="revenue-low">Revenue (Low to High)</option>
            </select>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">Loading analyses...</div>
      ) : filteredAnalyses.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No saved analyses found. Try adjusting your filters or start by analyzing a property!
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnalyses.map((analysis) => (
            <div key={analysis._id} className="bg-black border border-[#2ecc71] p-4 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-mono mb-2">{analysis.calculatorType}</h3>
                  <p className="text-sm font-mono text-gray-400">
                    Created: {new Date(analysis.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownloadPDF(analysis)}
                    className="p-2 hover:bg-[#2ecc71] hover:text-black rounded"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteAnalysis(analysis._id)}
                    className="p-2 hover:bg-red-500 hover:text-white rounded"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-mono text-gray-400">Price</p>
                  <p className="font-mono">${analysis.data.propertyPrice.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-mono text-gray-400">Down Payment</p>
                  <p className="font-mono">${analysis.data.downPayment.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-mono text-gray-400">Interest Rate</p>
                  <p className="font-mono">{analysis.data.interestRate}%</p>
                </div>
                <div>
                  <p className="text-sm font-mono text-gray-400">Loan Term</p>
                  <p className="font-mono">{analysis.data.loanTerm} years</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderMap = () => (
    <div className="bg-[#111111] border border-[#2ecc71]/20 p-6 rounded-lg h-[500px] flex items-center justify-center">
      <div className="text-center text-gray-400">
        <MapPin className="w-12 h-12 mx-auto mb-4 text-[#2ecc71]" />
        <p className="text-lg mb-2">Property Map Coming Soon</p>
        <p className="text-sm">This feature will display all your analyzed properties on an interactive map.</p>
      </div>
    </div>
  )

  const renderComparison = () => (
    <div className="bg-[#111111] border border-[#2ecc71]/20 p-6 rounded-lg">
      <div className="text-center text-gray-400">
        <BarChart2 className="w-12 h-12 mx-auto mb-4 text-[#2ecc71]" />
        <p className="text-lg mb-2">Property Comparison Tool Coming Soon</p>
        <p className="text-sm">This feature will allow you to compare multiple properties side by side.</p>
      </div>
    </div>
  )

  const renderReports = () => (
    <div className="bg-[#111111] border border-[#2ecc71]/20 p-6 rounded-lg">
      <div className="text-center text-gray-400">
        <FileText className="w-12 h-12 mx-auto mb-4 text-[#2ecc71]" />
        <p className="text-lg mb-2">Reports Generator Coming Soon</p>
        <p className="text-sm">This feature will allow you to generate detailed reports for your properties.</p>
      </div>
    </div>
  )

  return (
    <PageLayout>
      <div className="container mx-auto px-6 py-8">
        <div className="bg-black min-h-screen rounded-lg border border-[#2ecc71]/20 p-6">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h1 className="text-3xl font-bold text-white">
                Dashboard
              </h1>

            <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/')}
                  className="flex items-center gap-2 px-4 py-2 bg-[#2ecc71] text-black font-bold rounded
                    hover:bg-[#27ae60] transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                  New Analysis
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="flex items-center gap-2 px-4 py-2 border border-[#2ecc71]/20 text-[#2ecc71] rounded
                    hover:bg-[#2ecc71]/10 transition-all duration-300"
                >
                  <Home className="w-4 h-4" />
                  Back to Calculators
                </button>

                <div className="relative">
                  <button className="flex items-center gap-2 px-4 py-2 border border-[#2ecc71]/20 text-[#2ecc71] rounded
                    hover:bg-[#2ecc71]/10 transition-all duration-300">
                    <span>{session?.user?.name || 'User'}</span>
                    <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-64 bg-[#111111] border border-[#2ecc71]/20 rounded-lg p-4">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex items-center gap-2 w-full px-4 py-2 rounded ${
                      activeTab === 'overview'
                        ? 'bg-[#2ecc71] text-black'
                        : 'text-gray-400 hover:bg-[#2ecc71]/10 hover:text-[#2ecc71]'
                    }`}
                  >
                    <BarChart2 className="w-5 h-5" />
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('analyses')}
                    className={`flex items-center gap-2 w-full px-4 py-2 rounded ${
                      activeTab === 'analyses'
                        ? 'bg-[#2ecc71] text-black'
                        : 'text-gray-400 hover:bg-[#2ecc71]/10 hover:text-[#2ecc71]'
                    }`}
                  >
                    <Home className="w-5 h-5" />
                    Saved Analyses
                  </button>
                  <button
                    onClick={() => setActiveTab('map')}
                    className={`flex items-center gap-2 w-full px-4 py-2 rounded ${
                      activeTab === 'map'
                        ? 'bg-[#2ecc71] text-black'
                        : 'text-gray-400 hover:bg-[#2ecc71]/10 hover:text-[#2ecc71]'
                    }`}
                  >
                    <MapPin className="w-5 h-5" />
                    Property Map
                  </button>
                  <button
                    onClick={() => setActiveTab('comparison')}
                    className={`flex items-center gap-2 w-full px-4 py-2 rounded ${
                      activeTab === 'comparison'
                        ? 'bg-[#2ecc71] text-black'
                        : 'text-gray-400 hover:bg-[#2ecc71]/10 hover:text-[#2ecc71]'
                    }`}
                  >
                    <PieChart className="w-5 h-5" />
                    Comparison
                  </button>
                  <button
                    onClick={() => setActiveTab('reports')}
                    className={`flex items-center gap-2 w-full px-4 py-2 rounded ${
                      activeTab === 'reports'
                        ? 'bg-[#2ecc71] text-black'
                        : 'text-gray-400 hover:bg-[#2ecc71]/10 hover:text-[#2ecc71]'
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                    Reports
                  </button>
                  <div className="border-t border-[#2ecc71]/20 my-4"></div>
                  <button
                    onClick={() => router.push('/settings')}
                    className={`flex items-center gap-2 w-full px-4 py-2 rounded ${
                      activeTab === 'settings'
                        ? 'bg-[#2ecc71] text-black'
                        : 'text-gray-400 hover:bg-[#2ecc71]/10 hover:text-[#2ecc71]'
                    }`}
                  >
                    <Settings className="w-5 h-5" />
                    Settings
                  </button>
                  <button
                    onClick={() => router.push('/api/auth/signout')}
                    className="flex items-center gap-2 w-full px-4 py-2 rounded text-gray-400 hover:bg-red-500/10 hover:text-red-500"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
            </nav>
              </div>
              
              <div className="flex-1 overflow-auto">
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'analyses' && renderAnalyses()}
                {activeTab === 'map' && renderMap()}
                {activeTab === 'comparison' && renderComparison()}
                {activeTab === 'reports' && renderReports()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
