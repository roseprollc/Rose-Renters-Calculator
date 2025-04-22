"use client"

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calculator, DollarSign, Percent } from 'lucide-react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import PageLayout from '../components/PageLayout'
import GPTInsight from '../components/GPTInsight'
import { extractAddressFromUrl } from '../../utils/url'
import { toast } from 'react-hot-toast'

ChartJS.register(ArcElement, Tooltip, Legend);

// Force dynamic rendering to prevent static generation
export const dynamic = 'force-dynamic'

export default function MortgageCalculatorPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [propertyUrl, setPropertyUrl] = useState("")
  const [propertyPrice, setPropertyPrice] = useState(400000)
  const [downPaymentPercent, setDownPaymentPercent] = useState(20)
  const [downPayment, setDownPayment] = useState(80000)
  const [interestRate, setInterestRate] = useState(6.5)
  const [loanTerm, setLoanTerm] = useState(30)
  const [propertyTaxes, setPropertyTaxes] = useState(4800) // Annual
  const [insurance, setInsurance] = useState(1200) // Annual
  const [hoaFees, setHoaFees] = useState(0)
  const [monthlyIncome, setMonthlyIncome] = useState(10000)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [propertyData, setPropertyData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isCalculating, setIsCalculating] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [pmiAmount, setPmiAmount] = useState(0)

  useEffect(() => {
    setIsAuthenticated(!!session)
  }, [session])

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Handle down payment percentage changes
  const handleDownPaymentPercentChange = (percent: number) => {
    setDownPaymentPercent(percent)
    setDownPayment((percent / 100) * propertyPrice)
  }

  // Handle down payment amount changes
  const handleDownPaymentChange = (amount: number) => {
    setDownPayment(amount)
    setDownPaymentPercent((amount / propertyPrice) * 100)
  }

  // Handle property price changes
  const handlePropertyPriceChange = (value: number) => {
    setPropertyPrice(value)
    setDownPayment((downPaymentPercent / 100) * value)
  }

  const analytics = useMemo(() => {
    const principal = propertyPrice - downPayment
    const monthlyRate = (interestRate / 100) / 12
    const numberOfPayments = loanTerm * 12

    // Calculate monthly mortgage payment using the standard amortization formula
    const calculatedMonthlyPayment = 
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

    // Monthly expenses
    const monthlyTaxes = propertyTaxes / 12
    const monthlyInsurance = insurance / 12
    const monthlyPMI = pmiAmount

    const totalMonthlyPayment = 
      calculatedMonthlyPayment + 
      monthlyPMI + 
      monthlyTaxes + 
      monthlyInsurance

    // Calculate the first month's principal and interest portions
    // For the first payment, interest = principal * monthlyRate
    // Principal portion = monthly payment - interest portion
    const firstMonthInterest = principal * monthlyRate
    const firstMonthPrincipal = calculatedMonthlyPayment - firstMonthInterest

    // Payment breakdown
    const paymentBreakdown = {
      principal: firstMonthPrincipal,
      interest: firstMonthInterest,
      taxes: monthlyTaxes,
      insurance: monthlyInsurance,
      pmi: monthlyPMI
    }

    // Loan summary
    const totalLoanAmount = principal
    const totalInterest = (calculatedMonthlyPayment * numberOfPayments) - principal
    const totalPayments = calculatedMonthlyPayment * numberOfPayments

    // Risk analysis
    const debtToIncomeRatio = (totalMonthlyPayment / monthlyIncome) * 100
    const loanToValueRatio = (principal / propertyPrice) * 100
    const frontEndRatio = (totalMonthlyPayment / monthlyIncome) * 100

    return {
      monthlyPayment: calculatedMonthlyPayment,
      totalMonthlyPayment,
      paymentBreakdown,
      loanSummary: {
        totalLoanAmount,
        totalInterest,
        totalPayments
      },
      riskAnalysis: {
        debtToIncomeRatio,
        loanToValueRatio,
        frontEndRatio
      }
    }
  }, [
    propertyPrice,
    downPayment,
    downPaymentPercent,
    interestRate,
    loanTerm,
    propertyTaxes,
    insurance,
    monthlyIncome,
    pmiAmount
  ])

  const handleCalculate = () => {
    setIsCalculating(true)
    setShowResults(true)
    
    // Simulate calculation time
    setTimeout(() => {
      setIsCalculating(false)
      // Scroll to results
      document.querySelector('#results')?.scrollIntoView({ behavior: 'smooth' })
    }, 500)
  }

  const handleSaveAnalysis = async () => {
    if (!session) {
      router.push('/login?redirect=/calculator')
      return
    }

    try {
      const response = await fetch('/api/save-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'mortgage',
          propertyAddress: propertyUrl || 'Manual Entry',
          propertyPrice,
          downPayment,
          downPaymentPercent,
          interestRate,
          loanTerm,
          propertyTaxes,
          insurance,
          monthlyIncome,
          pmiAmount,
          monthlyPayment: analytics.monthlyPayment,
          totalMonthlyPayment: analytics.totalMonthlyPayment,
          paymentBreakdown: analytics.paymentBreakdown,
          loanSummary: analytics.loanSummary,
          riskAnalysis: analytics.riskAnalysis,
          notes: '',
          createdAt: new Date().toISOString()
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        if (data.code === 'LIMIT_REACHED') {
          window.location.href = '/pricing'
          return
        }
        throw new Error(data.error || 'Failed to save analysis')
      }

      toast.success('Analysis saved successfully')
      window.location.href = '/saved'
    } catch (error) {
      console.error('Error saving analysis:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save analysis')
    }
  }

  const handleSmartImport = async () => {
    if (!propertyUrl) {
      setError("Please enter a property URL")
      return
    }

    // Check if URL is from a supported site
    if (!propertyUrl.includes('redfin.com') && !propertyUrl.includes('realtor.com')) {
      setError('Please use Redfin or Realtor.com links. Other sites are not supported.')
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: propertyUrl })
      })

      const data = await response.json()
      
      if (!response.ok) {
        if (data.unsupported) {
          throw new Error(data.error)
        }
        throw new Error(data.error || 'Failed to fetch property data')
      }

      // Validate required data
      if (!data.price || !data.address) {
        throw new Error('Missing required property data')
      }

      // Store the imported data in localStorage with averages if available
      localStorage.setItem('importedProperty', JSON.stringify({
        price: data.price,
        address: data.address,
        beds: data.beds,
        baths: data.baths,
        sqft: data.sqft,
        averages: data.averages,
        importedAt: new Date().toISOString()
      }))

      // Update form fields with scraped data
      setPropertyPrice(data.price)
      setDownPaymentPercent(20) // Default to 20%
      setDownPayment(data.price * 0.2)
      setInterestRate(6.5) // Default to current market rate
      
      // Calculate property taxes based on local average or default to 1.2%
      const propertyTaxRate = data.averages?.propertyTaxRate || 0.012
      setPropertyTaxes(Math.round(data.price * propertyTaxRate))
      
      // Set insurance based on local average or default
      const insuranceAmount = data.averages?.insuranceAmount || 1200
      setInsurance(insuranceAmount)
      
      setHoaFees(0) // Default to no HOA
      
      // Show success message with property details
      toast.success(`Successfully imported ${data.address}`)
      
      // Trigger calculation after importing data
      setTimeout(() => {
        handleCalculate()
      }, 100) // Small delay to ensure state updates are processed
      
    } catch (err) {
      console.error("Import error:", err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to import property data'
      setError(errorMessage)
      toast.error(errorMessage)
      
      // If we have a Redfin URL, try to extract address from URL as fallback
      if (propertyUrl.includes('redfin.com')) {
        try {
          const extractedAddress = extractAddressFromUrl(propertyUrl)
          if (extractedAddress) {
            setError('Address extracted from URL. Please enter property price manually.')
            toast('Address extracted from URL. Please enter property price manually.')
          }
        } catch (urlError) {
          console.error('URL parsing error:', urlError)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-[#2ecc71] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Logo and Title */}
        <div className="flex items-center gap-4 mb-12">
          <Link href="/" className="text-[#2ecc71]">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-4xl font-mono">RoseIntel</h1>
        </div>

        <h2 className="text-5xl font-mono mb-12">Mortgage Calculator</h2>

        {/* Smart Import */}
        <div className="mb-12">
          <div className="flex gap-4 mb-2">
            <input
              type="text"
              value={propertyUrl}
              onChange={(e) => setPropertyUrl(e.target.value)}
              placeholder="Paste Zillow, Redfin, or MLS link here"
              className="flex-1 bg-black border border-[#2ecc71] px-4 py-3 font-mono text-white placeholder-gray-500"
            />
            <button
              onClick={handleSmartImport}
              disabled={isLoading}
              className="px-8 py-3 bg-[#2ecc71] text-black font-mono font-bold hover:bg-[#27ae60] disabled:opacity-50"
            >
              {isLoading ? 'Importing...' : 'Smart Import'}
            </button>
          </div>
          {error && <p className="text-red-500 font-mono">{error}</p>}
        </div>

        {/* Calculator Form */}
        <div className="space-y-8 mb-12">
          <div>
            <label className="block text-3xl font-mono mb-4">Property price</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">$</span>
              <input
                type="number"
                value={propertyPrice}
                onChange={(e) => handlePropertyPriceChange(Number(e.target.value))}
                className="w-full bg-black border border-[#2ecc71] px-12 py-4 text-2xl font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-3xl font-mono mb-4">Down payment</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">%</span>
                <input
                  type="number"
                  value={downPaymentPercent}
                  onChange={(e) => handleDownPaymentPercentChange(Number(e.target.value))}
                  className="w-full bg-black border border-[#2ecc71] px-12 py-4 text-2xl font-mono"
                />
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">$</span>
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                  className="w-full bg-black border border-[#2ecc71] px-12 py-4 text-2xl font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-3xl font-mono mb-4">Interest rate</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">%</span>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full bg-black border border-[#2ecc71] px-12 py-4 text-2xl font-mono"
                step="0.1"
              />
            </div>
          </div>

          <div>
            <label className="block text-3xl font-mono mb-4">Loan term</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-[#2ecc71]">yrs</span>
              <input
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="w-full bg-black border border-[#2ecc71] pl-16 pr-4 py-4 text-2xl font-mono"
                step="5"
                min="10"
                max="30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xl font-mono mb-4">Property taxes (annual)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">$</span>
                <input
                  type="number"
                  value={propertyTaxes}
                  onChange={(e) => setPropertyTaxes(Number(e.target.value))}
                  className="w-full bg-black border border-[#2ecc71] px-12 py-4 text-2xl font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-xl font-mono mb-4">Insurance (annual)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">$</span>
                <input
                  type="number"
                  value={insurance}
                  onChange={(e) => setInsurance(Number(e.target.value))}
                  className="w-full bg-black border border-[#2ecc71] px-12 py-4 text-2xl font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xl font-mono mb-4">Monthly household income</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">$</span>
              <input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                className="w-full bg-black border border-[#2ecc71] px-12 py-4 text-2xl font-mono"
              />
            </div>
          </div>

          {/* PMI Field */}
          <div>
            <label className="block text-xl font-mono mb-4">PMI (monthly)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">$</span>
              <input
                type="number"
                value={pmiAmount}
                onChange={(e) => setPmiAmount(Number(e.target.value))}
                className="w-full bg-black border border-[#2ecc71] px-12 py-4 text-2xl font-mono"
                step="1"
                placeholder="Monthly PMI payment"
              />
            </div>
            {downPaymentPercent < 20 && (
              <p className="text-sm font-mono mt-2 text-gray-400">
                PMI is typically required when down payment is less than 20%. Contact your lender for exact amount.
              </p>
            )}
          </div>

          <button
            onClick={handleCalculate}
            disabled={isCalculating}
            className="w-48 py-4 border border-[#2ecc71] text-2xl font-mono hover:bg-[#2ecc71] hover:text-black transition-colors disabled:opacity-50"
          >
            {isCalculating ? 'Calculating...' : 'Calculate'}
          </button>
        </div>

        {/* Results */}
        <div id="results" className={`mb-12 transition-opacity duration-500 ${showResults ? 'opacity-100' : 'opacity-0'}`}>
          <h3 className="text-3xl font-mono mb-4">Monthly Payment</h3>
          <div className="text-6xl font-mono">${analytics.totalMonthlyPayment.toFixed(2)}</div>
          
          {/* Payment Breakdown with Pie Chart */}
          <div className="mt-8">
            <h4 className="text-2xl font-mono mb-4">Payment Breakdown</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pie Chart */}
              <div className="bg-[#111111] border border-[#2ecc71]/20 p-6 flex flex-col items-center">
                <div className="w-full max-w-md">
                  <Pie
                    data={{
                      labels: ['Principal', 'Interest', 'Taxes', 'Insurance', 'PMI'],
                      datasets: [
                        {
                          data: [
                            analytics.paymentBreakdown.principal,
                            analytics.paymentBreakdown.interest,
                            analytics.paymentBreakdown.taxes,
                            analytics.paymentBreakdown.insurance,
                            analytics.paymentBreakdown.pmi || 0
                          ],
                          backgroundColor: [
                            '#2ecc71',
                            '#27ae60',
                            '#1abc9c',
                            '#16a085',
                            '#3498db'
                          ],
                          borderColor: '#000',
                          borderWidth: 2,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            color: '#2ecc71',
                            font: {
                              size: 14,
                            },
                          },
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context: { label: string; raw: unknown }) {
                              const value = context.raw as number;
                              return `${context.label}: $${value.toLocaleString()}`;
                            },
                          },
                        },
                      },
                      responsive: true,
                      maintainAspectRatio: true
                    }}
                  />
                </div>
              </div>
              
              {/* Payment Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#111111] border border-[#2ecc71]/20 p-6">
                  <h5 className="text-lg font-mono mb-2">Principal</h5>
                  <p className="text-2xl font-mono truncate">${analytics.paymentBreakdown.principal.toFixed(2)}</p>
                  <p className="text-sm font-mono mt-2 text-gray-400">
                    {((analytics.paymentBreakdown.principal / analytics.totalMonthlyPayment) * 100).toFixed(1)}% of payment
                  </p>
                </div>
                <div className="bg-[#111111] border border-[#2ecc71]/20 p-6">
                  <h5 className="text-lg font-mono mb-2">Interest</h5>
                  <p className="text-2xl font-mono truncate">${analytics.paymentBreakdown.interest.toFixed(2)}</p>
                  <p className="text-sm font-mono mt-2 text-gray-400">
                    {((analytics.paymentBreakdown.interest / analytics.totalMonthlyPayment) * 100).toFixed(1)}% of payment
                  </p>
                </div>
                <div className="bg-[#111111] border border-[#2ecc71]/20 p-6">
                  <h5 className="text-lg font-mono mb-2">Taxes</h5>
                  <p className="text-2xl font-mono truncate">${analytics.paymentBreakdown.taxes.toFixed(2)}</p>
                  <p className="text-sm font-mono mt-2 text-gray-400">
                    {((analytics.paymentBreakdown.taxes / analytics.totalMonthlyPayment) * 100).toFixed(1)}% of payment
                  </p>
                </div>
                <div className="bg-[#111111] border border-[#2ecc71]/20 p-6">
                  <h5 className="text-lg font-mono mb-2">Insurance</h5>
                  <p className="text-2xl font-mono truncate">${analytics.paymentBreakdown.insurance.toFixed(2)}</p>
                  <p className="text-sm font-mono mt-2 text-gray-400">
                    {((analytics.paymentBreakdown.insurance / analytics.totalMonthlyPayment) * 100).toFixed(1)}% of payment
                  </p>
                </div>
                {analytics.paymentBreakdown.pmi > 0 && (
                  <div className="bg-[#111111] border border-[#2ecc71]/20 p-6">
                    <h5 className="text-lg font-mono mb-2">PMI</h5>
                    <p className="text-2xl font-mono truncate">${analytics.paymentBreakdown.pmi.toFixed(2)}</p>
                    <p className="text-sm font-mono mt-2 text-gray-400">
                      {((analytics.paymentBreakdown.pmi / analytics.totalMonthlyPayment) * 100).toFixed(1)}% of payment
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Loan Summary */}
          <div className="mt-8">
            <h4 className="text-2xl font-mono mb-4">Loan Summary</h4>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-[#111111] border border-[#2ecc71]/20 p-6">
                <h5 className="text-lg font-mono mb-2">Loan Amount</h5>
                <p className="text-2xl font-mono truncate">${analytics.loanSummary.totalLoanAmount.toFixed(2)}</p>
              </div>
              <div className="bg-[#111111] border border-[#2ecc71]/20 p-6">
                <h5 className="text-lg font-mono mb-2">Total Interest</h5>
                <p className="text-2xl font-mono truncate">${analytics.loanSummary.totalInterest.toFixed(2)}</p>
              </div>
              <div className="bg-[#111111] border border-[#2ecc71]/20 p-6">
                <h5 className="text-lg font-mono mb-2">Total Payments</h5>
                <p className="text-2xl font-mono truncate">${analytics.loanSummary.totalPayments.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Risk Analysis */}
          <div className="mt-8">
            <h4 className="text-2xl font-mono mb-4">Risk Analysis</h4>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-[#111111] border border-[#2ecc71]/20 p-6">
                <h5 className="text-lg font-mono mb-2">DTI Ratio</h5>
                <p className="text-2xl font-mono truncate">{analytics.riskAnalysis.debtToIncomeRatio.toFixed(1)}%</p>
                <p className="text-sm font-mono mt-2 text-gray-400">
                  {analytics.riskAnalysis.debtToIncomeRatio <= 43 ? 'Within acceptable range' : 'Above recommended 43%'}
                </p>
              </div>
              <div className="bg-[#111111] border border-[#2ecc71]/20 p-6">
                <h5 className="text-lg font-mono mb-2">LTV Ratio</h5>
                <p className="text-2xl font-mono truncate">{analytics.riskAnalysis.loanToValueRatio.toFixed(1)}%</p>
                <p className="text-sm font-mono mt-2 text-gray-400">
                  {analytics.riskAnalysis.loanToValueRatio <= 80 ? 'No PMI required' : 'PMI may be required'}
                </p>
              </div>
              <div className="bg-[#111111] border border-[#2ecc71]/20 p-6">
                <h5 className="text-lg font-mono mb-2">Front-end Ratio</h5>
                <p className="text-2xl font-mono truncate">{analytics.riskAnalysis.frontEndRatio.toFixed(1)}%</p>
                <p className="text-sm font-mono mt-2 text-gray-400">
                  {analytics.riskAnalysis.frontEndRatio <= 28 ? 'Within acceptable range' : 'Above recommended 28%'}
                </p>
              </div>
            </div>
          </div>

          {/* GPT Insights */}
          <div className="mt-8">
            <GPTInsight
              calculatorType="mortgage"
              formData={{
                propertyPrice,
                downPayment,
                downPaymentPercent,
                interestRate,
                loanTerm,
                propertyTaxes,
                insurance,
                monthlyIncome,
                pmiAmount,
                analytics: {
                  monthlyPayment: analytics.monthlyPayment,
                  totalMonthlyPayment: analytics.totalMonthlyPayment,
                  paymentBreakdown: analytics.paymentBreakdown,
                  loanSummary: analytics.loanSummary,
                  riskAnalysis: analytics.riskAnalysis
                }
              }}
              autoRun={false}
            />
          </div>

          {/* Save Analysis Button */}
          <div className="mt-8">
            <button
              onClick={handleSaveAnalysis}
              disabled={!session || isLoading}
              className="w-full bg-[#2ecc71] text-black py-3 px-6 rounded-lg font-semibold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {session ? "Save Analysis" : "Log in to Save"}
            </button>
          </div>
        </div>

        {/* Property Preview */}
        <div className="mb-12">
          <h3 className="text-3xl font-mono mb-6">Property Preview</h3>
          <div className="bg-[#111111] rounded-lg overflow-hidden">
            <div className="aspect-video relative bg-[#111111]">
              {propertyData?.image ? (
                <img
                  src={propertyData.image}
                  alt="Property"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                  Import a property to view preview
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-3 gap-4">
          <Link
            href="/renters"
            className="py-4 border border-[#2ecc71] text-2xl font-mono text-center hover:bg-[#2ecc71] hover:text-black transition-colors"
          >
            Rental
          </Link>
          <Link
            href="/airbnb"
            className="py-4 border border-[#2ecc71] text-2xl font-mono text-center hover:bg-[#2ecc71] hover:text-black transition-colors"
          >
            Airbnb
          </Link>
          <Link
            href="/wholesale"
            className="py-4 border border-[#2ecc71] text-2xl font-mono text-center hover:bg-[#2ecc71] hover:text-black transition-colors"
          >
            Wholesale
          </Link>
        </div>
      </div>
    </div>
  )
} 