"use client"

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calculator, DollarSign, Percent } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import GPTInsight from '../components/GPTInsight'
import { extractAddressFromUrl } from '../../utils/url'
import { toast } from 'react-hot-toast'

export default function RentalCalculatorPage() {
  const [propertyUrl, setPropertyUrl] = useState("")
  const [propertyPrice, setPropertyPrice] = useState(400000)
  const [downPaymentPercent, setDownPaymentPercent] = useState(20)
  const [downPayment, setDownPayment] = useState(80000)
  const [interestRate, setInterestRate] = useState(6.5)
  const [monthlyPayment, setMonthlyPayment] = useState(2018.77)
  const [propertyData, setPropertyData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isCalculating, setIsCalculating] = useState(false)
  const [showResults, setShowResults] = useState(false)
  
  // Additional inputs for comprehensive analysis
  const [propertyTaxes, setPropertyTaxes] = useState(4800) // Annual
  const [insurance, setInsurance] = useState(1200) // Annual
  const [hoaFees, setHoaFees] = useState(0) // Monthly
  const [maintenance, setMaintenance] = useState(200) // Monthly
  const [utilities, setUtilities] = useState(0) // Monthly
  const [propertyManagement, setPropertyManagement] = useState(100) // Monthly
  const [monthlyRent, setMonthlyRent] = useState(3000)
  const [isAuthenticated, setIsAuthenticated] = useState(false) // TODO: Replace with actual auth check
  const [pmiAmount, setPmiAmount] = useState(0)

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
    const numberOfPayments = 30 * 12

    const calculatedMonthlyPayment = 
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

    // Use direct PMI amount instead of calculating from rate
    const monthlyPMI = pmiAmount

    // Monthly expenses
    const monthlyTaxes = propertyTaxes / 12
    const monthlyInsurance = insurance / 12
    const totalMonthlyExpenses = 
      calculatedMonthlyPayment + 
      monthlyPMI + 
      monthlyTaxes + 
      monthlyInsurance + 
      hoaFees + 
      maintenance + 
      utilities + 
      propertyManagement

    // Cash flow calculations
    const monthlyCashFlow = monthlyRent - totalMonthlyExpenses
    const annualCashFlow = monthlyCashFlow * 12

    // Cap rate calculation
    const netOperatingIncome = (monthlyRent * 12) - (
      propertyTaxes + 
      insurance + 
      (hoaFees * 12) + 
      (maintenance * 12) + 
      utilities * 12 + 
      propertyManagement * 12 +
      monthlyPMI * 12
    )
    const capRate = (netOperatingIncome / propertyPrice) * 100

    // Cash-on-cash return calculation
    const totalInvestment = downPayment + (propertyTaxes / 12) + insurance // First year costs
    const cashOnCashReturn = (annualCashFlow / totalInvestment) * 100

    // Break-even rent calculation
    const breakEvenRent = totalMonthlyExpenses

    // Expense breakdown for table
    const expenseBreakdown = {
      mortgage: calculatedMonthlyPayment,
      pmi: monthlyPMI,
      taxes: monthlyTaxes,
      insurance: monthlyInsurance,
      hoa: hoaFees,
      maintenance: maintenance,
      utilities: utilities,
      propertyManagement: propertyManagement,
      grossIncome: monthlyRent,
      netProfit: monthlyCashFlow
    }

    return {
      monthlyPayment: calculatedMonthlyPayment,
      monthlyCashFlow,
      annualCashFlow,
      capRate,
      cashOnCashReturn,
      breakEvenRent,
      expenseBreakdown
    }
  }, [
    propertyPrice,
    downPayment,
    downPaymentPercent,
    interestRate,
    propertyTaxes,
    insurance,
    hoaFees,
    maintenance,
    utilities,
    propertyManagement,
    monthlyRent,
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
    if (!isAuthenticated) {
      window.location.href = '/login'
      return
    }

    try {
      const response = await fetch('/api/save-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'rental',
          propertyAddress: propertyUrl || 'Manual Entry',
          propertyPrice,
          downPayment,
          downPaymentPercent,
          interestRate,
          monthlyRent,
          propertyTaxes,
          insurance,
          maintenance,
          hoaFees,
          utilities,
          monthlyPayment: analytics.monthlyPayment,
          monthlyCashFlow: analytics.monthlyCashFlow,
          annualCashFlow: analytics.annualCashFlow,
          capRate: analytics.capRate,
          cashOnCashReturn: analytics.cashOnCashReturn,
          breakEvenRent: analytics.breakEvenRent,
          expenseBreakdown: analytics.expenseBreakdown,
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

    // Check if it's a Zillow URL and show a message
    if (propertyUrl.includes('zillow.com')) {
      setError('Zillow links are currently not supported. Please use Redfin or Realtor.com links instead.')
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

      // Store the imported data in localStorage
      localStorage.setItem('importedProperty', JSON.stringify({
        price: data.price,
        address: data.address,
        beds: data.beds,
        baths: data.baths,
        sqft: data.sqft,
        importedAt: new Date().toISOString()
      }))

      // Update form fields with scraped data
      setPropertyPrice(data.price)
      setDownPaymentPercent(20) // Default to 20%
      setDownPayment(data.price * 0.2)
      setInterestRate(6.5) // Default to current market rate
      setMonthlyRent(Math.round(data.price * 0.008)) // Default to 0.8% of property price
      setPropertyTaxes(Math.round(data.price * 0.012)) // Default to 1.2% of property price
      setInsurance(1200) // Default annual insurance
      setMaintenance(200) // Default monthly maintenance
      setHoaFees(0) // Default to no HOA
      setUtilities(150) // Default utilities cost

      // Trigger calculation after importing data
      setTimeout(() => {
        handleCalculate()
      }, 100) // Small delay to ensure state updates are processed
      
    } catch (err) {
      console.error("Import error:", err)
      setError(err instanceof Error ? err.message : 'Failed to import property data')
      
      // If we have a Redfin URL, try to extract address from URL as fallback
      if (propertyUrl.includes('redfin.com')) {
        try {
          const extractedAddress = extractAddressFromUrl(propertyUrl)
          if (extractedAddress) {
            setError('Address extracted from URL. Please enter property price manually.')
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

        <h2 className="text-5xl font-mono mb-12">Rental Property Analyzer</h2>

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
            <label className="block text-3xl font-mono mb-4">Monthly rent</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">$</span>
              <input
                type="number"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(Number(e.target.value))}
                className="w-full bg-black border border-[#2ecc71] px-12 py-4 text-2xl font-mono"
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

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xl font-mono mb-4">HOA (monthly)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">$</span>
                <input
                  type="number"
                  value={hoaFees}
                  onChange={(e) => setHoaFees(Number(e.target.value))}
                  className="w-full bg-black border border-[#2ecc71] px-12 py-4 text-2xl font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-xl font-mono mb-4">Maintenance</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">$</span>
                <input
                  type="number"
                  value={maintenance}
                  onChange={(e) => setMaintenance(Number(e.target.value))}
                  className="w-full bg-black border border-[#2ecc71] px-12 py-4 text-2xl font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-xl font-mono mb-4">Property Mgmt</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">$</span>
                <input
                  type="number"
                  value={propertyManagement}
                  onChange={(e) => setPropertyManagement(Number(e.target.value))}
                  className="w-full bg-black border border-[#2ecc71] px-12 py-4 text-2xl font-mono"
                />
              </div>
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
          <div className="text-6xl font-mono">${analytics.monthlyPayment.toFixed(2)}</div>
          
          {/* Analytics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-[#111111] border border-[#2ecc71]/20 p-6">
              <h4 className="text-lg font-mono mb-2">Monthly Cash Flow</h4>
              <p className="text-2xl font-mono truncate">${analytics.monthlyCashFlow.toFixed(2)}</p>
            </div>
            <div className="bg-[#111111] border border-[#2ecc71]/20 p-6">
              <h4 className="text-lg font-mono mb-2">Annual Cash Flow</h4>
              <p className="text-2xl font-mono truncate">${analytics.annualCashFlow.toFixed(2)}</p>
            </div>
            <div className="bg-[#111111] border border-[#2ecc71]/20 p-6">
              <h4 className="text-lg font-mono mb-2">Cap Rate</h4>
              <p className="text-2xl font-mono truncate">{analytics.capRate.toFixed(2)}%</p>
            </div>
            <div className="bg-[#111111] border border-[#2ecc71]/20 p-6">
              <h4 className="text-lg font-mono mb-2">Cash-on-Cash</h4>
              <p className="text-2xl font-mono truncate">{analytics.cashOnCashReturn.toFixed(2)}%</p>
            </div>
          </div>

          {/* Analytics Table */}
          <div className="mt-8 bg-[#111111] border border-[#2ecc71]/20 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#2ecc71]/10">
                <tr>
                  <th className="text-left p-4 font-mono">Type</th>
                  <th className="text-right p-4 font-mono">Monthly</th>
                  <th className="text-right p-4 font-mono">Annual</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-[#2ecc71]/10">
                  <td className="p-4 font-mono">Mortgage</td>
                  <td className="p-4 font-mono text-right">${analytics.expenseBreakdown.mortgage.toFixed(2)}</td>
                  <td className="p-4 font-mono text-right">${(analytics.expenseBreakdown.mortgage * 12).toFixed(2)}</td>
                </tr>
                {analytics.expenseBreakdown.pmi > 0 && (
                  <tr className="border-t border-[#2ecc71]/10">
                    <td className="p-4 font-mono">PMI</td>
                    <td className="p-4 font-mono text-right">${analytics.expenseBreakdown.pmi.toFixed(2)}</td>
                    <td className="p-4 font-mono text-right">${(analytics.expenseBreakdown.pmi * 12).toFixed(2)}</td>
                  </tr>
                )}
                <tr className="border-t border-[#2ecc71]/10">
                  <td className="p-4 font-mono">Property Taxes</td>
                  <td className="p-4 font-mono text-right">${analytics.expenseBreakdown.taxes.toFixed(2)}</td>
                  <td className="p-4 font-mono text-right">${(analytics.expenseBreakdown.taxes * 12).toFixed(2)}</td>
                </tr>
                <tr className="border-t border-[#2ecc71]/10">
                  <td className="p-4 font-mono">Insurance</td>
                  <td className="p-4 font-mono text-right">${analytics.expenseBreakdown.insurance.toFixed(2)}</td>
                  <td className="p-4 font-mono text-right">${(analytics.expenseBreakdown.insurance * 12).toFixed(2)}</td>
                </tr>
                {hoaFees > 0 && (
                  <tr className="border-t border-[#2ecc71]/10">
                    <td className="p-4 font-mono">HOA</td>
                    <td className="p-4 font-mono text-right">${analytics.expenseBreakdown.hoa.toFixed(2)}</td>
                    <td className="p-4 font-mono text-right">${(analytics.expenseBreakdown.hoa * 12).toFixed(2)}</td>
                  </tr>
                )}
                <tr className="border-t border-[#2ecc71]/10">
                  <td className="p-4 font-mono">Maintenance</td>
                  <td className="p-4 font-mono text-right">${analytics.expenseBreakdown.maintenance.toFixed(2)}</td>
                  <td className="p-4 font-mono text-right">${(analytics.expenseBreakdown.maintenance * 12).toFixed(2)}</td>
                </tr>
                {propertyManagement > 0 && (
                  <tr className="border-t border-[#2ecc71]/10">
                    <td className="p-4 font-mono">Property Management</td>
                    <td className="p-4 font-mono text-right">${analytics.expenseBreakdown.propertyManagement.toFixed(2)}</td>
                    <td className="p-4 font-mono text-right">${(analytics.expenseBreakdown.propertyManagement * 12).toFixed(2)}</td>
                  </tr>
                )}
                <tr className="border-t border-[#2ecc71]/10 bg-[#2ecc71]/5">
                  <td className="p-4 font-mono font-bold">Gross Income</td>
                  <td className="p-4 font-mono text-right font-bold">${analytics.expenseBreakdown.grossIncome.toFixed(2)}</td>
                  <td className="p-4 font-mono text-right font-bold">${(analytics.expenseBreakdown.grossIncome * 12).toFixed(2)}</td>
                </tr>
                <tr className="border-t border-[#2ecc71]/10 bg-[#2ecc71]/10">
                  <td className="p-4 font-mono font-bold">Net Profit</td>
                  <td className="p-4 font-mono text-right font-bold">${analytics.expenseBreakdown.netProfit.toFixed(2)}</td>
                  <td className="p-4 font-mono text-right font-bold">${(analytics.expenseBreakdown.netProfit * 12).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* GPT Insights */}
          <div className="mt-8">
            <GPTInsight
              calculatorType="rental"
              formData={{
                propertyPrice,
                downPayment,
                downPaymentPercent,
                interestRate,
                monthlyRent,
                propertyTaxes,
                insurance,
                hoaFees,
                maintenance,
                utilities,
                propertyManagement,
                pmiAmount,
                analytics: {
                  monthlyPayment: analytics.monthlyPayment,
                  monthlyCashFlow: analytics.monthlyCashFlow,
                  annualCashFlow: analytics.annualCashFlow,
                  capRate: analytics.capRate,
                  cashOnCashReturn: analytics.cashOnCashReturn,
                  breakEvenRent: analytics.breakEvenRent,
                  expenseBreakdown: analytics.expenseBreakdown
                }
              }}
              autoRun={false}
            />
          </div>

          {/* Break-even Analysis */}
          <div className="mt-8 bg-[#111111] border border-[#2ecc71]/20 p-6 rounded-lg">
            <h4 className="text-xl font-mono mb-2">Break-even Rent</h4>
            <p className="text-4xl font-mono">${analytics.breakEvenRent.toFixed(2)}/month</p>
            <p className="text-sm font-mono mt-2 text-gray-400">
              This is the minimum monthly rent needed to cover all expenses
            </p>
          </div>

          {/* Save Analysis Button */}
          <div className="mt-8">
            <button
              onClick={handleSaveAnalysis}
              disabled={!isAuthenticated}
              className="w-full py-4 border border-[#2ecc71] text-xl font-mono hover:bg-[#2ecc71] hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAuthenticated ? 'Save Analysis' : 'Login to Save Analysis'}
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
            href="/calculator"
            className="py-4 border border-[#2ecc71] text-2xl font-mono text-center hover:bg-[#2ecc71] hover:text-black transition-colors"
          >
            Mortgage
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