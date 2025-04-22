"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import ProtectedRoute from "@/components/auth/protected-route"
import { ArrowLeft, Building2, DollarSign, PieChart, Tag } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"

// Types for our analysis data
interface AnalysisData {
  id: string
  title: string
  description: string
  createdAt: string
  propertyAddress: string
  propertyUrl?: string
  propertyType?: string
  source?: string
  monthlyRent: number
  downPayment: number
  loanTermYears: number
  interestRate: number
  expenses: {
    [key: string]: number
  }
  notes?: string
  tags?: string[]
  results: {
    cashFlow: number
    roi: number
    capRate: number
  }
}

export default function AnalysisPage() {
  const params = useParams()
  const router = useRouter()
  const { theme } = useTheme()
  const [data, setData] = useState<AnalysisData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await fetch(`/api/analysis/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch analysis")
        }
        const analysisData = await response.json()
        setData(analysisData)
      } catch (err) {
        console.error("Error fetching analysis:", err)
        setError("Failed to load analysis data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchAnalysis()
    }
  }, [params.id])

  const handleEdit = () => {
    if (data) {
      localStorage.setItem("editData", JSON.stringify(data))
      router.push(`/analysis/${params.id}/edit`)
    }
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="flex items-center gap-3">
            <svg
              className="animate-spin h-8 w-8 text-[#2ecc71]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-[#2ecc71] text-xl font-medium">Loading Analysis...</span>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-black p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-neutral-900 p-8 rounded-lg border border-[#2ecc71]/30">
              <h1 className="text-[#2ecc71] text-2xl font-bold mb-4">Error Loading Analysis</h1>
              <p className="text-gray-300 mb-6">{error}</p>
              <Link 
                href="/dashboard"
                className="inline-flex items-center gap-2 text-[#2ecc71] hover:text-[#27ae60] transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!data) {
    return null
  }

  const totalExpenses = Object.values(data.expenses).reduce((sum, expense) => sum + expense, 0)
  const expensePercentage = (totalExpenses / data.monthlyRent) * 100
  const incomePercentage = 100 - expensePercentage

  const socialIcons = [
    { name: 'Twitter', icon: '𝕏', url: `https://twitter.com/intent/tweet?text=Check out this analysis: ${data.title}` },
    { name: 'LinkedIn', icon: '💼', url: `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}` },
    { name: 'Email', icon: '📧', url: `mailto:?subject=${data.title}&body=Check out this analysis: ${window.location.href}` }
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/dashboard"
              className="inline-flex items-center gap-2 text-[#2ecc71] hover:text-[#27ae60] transition-colors mb-4"
            >
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-4xl font-bold text-[#2ecc71] mb-2">{data.title}</h1>
            <h2 className="text-2xl text-gray-300">{data.propertyAddress}</h2>
          </div>

          {/* Property Details Card */}
          <div className="bg-neutral-900 p-6 rounded-lg border border-[#2ecc71]/30 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="text-[#2ecc71]" size={24} />
              <h3 className="text-xl font-bold text-[#2ecc71]">Property Details</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-300">
                  <span className="font-medium">Property Type:</span>{" "}
                  {data.propertyType || "Not specified"}
                </p>
                <p className="text-gray-300">
                  <span className="font-medium">Source:</span>{" "}
                  {data.source || "Manual Entry"}
                </p>
              </div>
              {data.propertyUrl && (
                <div>
                  <p className="text-gray-300">
                    <span className="font-medium">Listing URL:</span>{" "}
                    <a 
                      href={data.propertyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2ecc71] hover:text-[#27ae60] transition-colors"
                    >
                      View Original Listing
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Input Summary Card */}
          <div className="bg-neutral-900 p-6 rounded-lg border border-[#2ecc71]/30 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="text-[#2ecc71]" size={24} />
              <h3 className="text-xl font-bold text-[#2ecc71]">Input Summary</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-300 mb-2">Income & Financing</h4>
                <div className="space-y-2">
                  <p className="text-gray-300">
                    <span className="font-medium">Monthly Rent:</span>{" "}
                    ${data.monthlyRent.toLocaleString()}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-medium">Down Payment:</span>{" "}
                    ${data.downPayment.toLocaleString()}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-medium">Loan Term:</span>{" "}
                    {data.loanTermYears} years
                  </p>
                  <p className="text-gray-300">
                    <span className="font-medium">Interest Rate:</span>{" "}
                    {data.interestRate}%
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-300 mb-2">Monthly Expenses</h4>
                <div className="space-y-2">
                  {Object.entries(data.expenses).map(([expense, amount]) => (
                    <p key={expense} className="text-gray-300">
                      <span className="font-medium">{expense}:</span>{" "}
                      ${amount.toLocaleString()}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            {(data.notes || (data.tags && data.tags.length > 0)) && (
              <div className="mt-6 pt-6 border-t border-[#2ecc71]/10">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="text-[#2ecc71]" size={20} />
                  <h4 className="font-medium text-gray-300">Notes & Tags</h4>
                </div>
                {data.notes && (
                  <p className="text-gray-300 mb-3">{data.notes}</p>
                )}
                {data.tags && data.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {data.tags.map(tag => (
                      <span 
                        key={tag}
                        className="px-3 py-1 bg-[#2ecc71]/10 text-[#2ecc71] rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results Summary Card */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-neutral-900 p-6 rounded-lg border border-[#2ecc71]/30">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="text-[#2ecc71]" size={24} />
                <h3 className="text-xl font-bold text-[#2ecc71]">Results Summary</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-300 mb-1">Monthly Cash Flow</p>
                  <p className="text-3xl font-bold text-[#2ecc71]">
                    ${data.results.cashFlow.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-300 mb-1">Return on Investment</p>
                  <p className="text-3xl font-bold text-[#2ecc71]">
                    {data.results.roi.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-300 mb-1">Cap Rate</p>
                  <p className="text-3xl font-bold text-[#2ecc71]">
                    {data.results.capRate.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-900 p-6 rounded-lg border border-[#2ecc71]/30">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="text-[#2ecc71]" size={24} />
                <h3 className="text-xl font-bold text-[#2ecc71]">Income vs Expenses</h3>
              </div>
              <div className="flex items-center justify-center h-[200px]">
                {/* TODO: Add pie chart component here */}
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#2ecc71] mb-2">
                    {incomePercentage.toFixed(1)}%
                  </p>
                  <p className="text-gray-300">Net Income</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <p className="font-semibold text-[#2ecc71] mb-4">
              🔗 Share this analysis:
            </p>
            <div className="flex gap-4 flex-wrap items-center">
              {socialIcons.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl hover:text-[#2ecc71] transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <button
            onClick={handleEdit}
            className="mt-8 bg-[#2ecc71] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#27ae60] transition-colors duration-300"
          >
            ✏️ Edit This Analysis
          </button>
        </div>
      </div>
    </ProtectedRoute>
  )
} 