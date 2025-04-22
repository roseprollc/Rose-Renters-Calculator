"use client"

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calculator, DollarSign, Percent } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import GPTInsight from '../components/GPTInsight'
import { extractAddressFromUrl } from '../../utils/url'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function AirbnbCalculator() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [propertyUrl, setPropertyUrl] = useState("")
  const [propertyPrice, setPropertyPrice] = useState(400000)
  const [downPaymentPercent, setDownPaymentPercent] = useState(20)
  const [downPayment, setDownPayment] = useState(80000)
  const [interestRate, setInterestRate] = useState(7.5)
  const [monthlyPayment, setMonthlyPayment] = useState(2500)
  const [nightlyRate, setNightlyRate] = useState(250)
  const [occupancyRate, setOccupancyRate] = useState(75)
  const [propertyData, setPropertyData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isCalculating, setIsCalculating] = useState(false)
  const [maintenanceCosts, setMaintenanceCosts] = useState(200)
  const [cleaningFee, setCleaningFee] = useState(100)
  const [utilities, setUtilities] = useState(150)
  const [showResults, setShowResults] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState("")

  useEffect(() => {
    // Update authentication state when session changes
    if (status === 'authenticated' && session) {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
  }, [session, status])

  const handleDownPaymentPercentChange = (value: number) => {
    setDownPaymentPercent(value)
    setDownPayment((propertyPrice * value) / 100)
  }

  const handleDownPaymentChange = (value: number) => {
    setDownPayment(value)
    setDownPaymentPercent((value / propertyPrice) * 100)
  }

  const metrics = useMemo(() => {
    const principal = propertyPrice - downPayment
    const monthlyRate = interestRate / 100 / 12
    const numberOfPayments = 30 * 12

    const calculatedMonthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

    // Calculate potential revenue
    const daysPerMonth = 30
    const occupiedDays = Math.floor((occupancyRate / 100) * daysPerMonth)
    const monthlyRevenue = (occupiedDays * nightlyRate) + (occupiedDays * cleaningFee)
    
    // Calculate monthly expenses
    const monthlyExpenses = calculatedMonthlyPayment + maintenanceCosts + utilities
    const monthlyProfit = monthlyRevenue - monthlyExpenses
    
    // Calculate annual metrics
    const annualRevenue = monthlyRevenue * 12
    const annualExpenses = monthlyExpenses * 12
    const annualProfit = monthlyProfit * 12
    
    // Calculate ROI and cap rate
    const totalInvestment = downPayment + (maintenanceCosts * 12)
    const roi = (annualProfit / totalInvestment) * 100
    const capRate = (annualProfit / propertyPrice) * 100

    return {
      monthlyPayment: calculatedMonthlyPayment,
      monthlyRevenue,
      monthlyExpenses,
      monthlyProfit,
      annualRevenue,
      annualExpenses,
      annualProfit,
      roi,
      capRate,
      occupiedDays,
      vacancyDays: daysPerMonth - occupiedDays
    }
  }, [propertyPrice, downPayment, interestRate, nightlyRate, occupancyRate, maintenanceCosts, cleaningFee, utilities])

  const handleCalculate = () => {
    setIsCalculating(true)
    setShowResults(true)
    setTimeout(() => {
      setIsCalculating(false)
      document.querySelector('#results')?.scrollIntoView({ behavior: 'smooth' })
    }, 500)
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
      setInterestRate(7.5) // Default to current market rate
      setNightlyRate(Math.round(data.price * 0.001)) // Default to 0.1% of property price
      setOccupancyRate(75) // Default to 75% occupancy
      setMaintenanceCosts(200) // Default maintenance costs
      setCleaningFee(100) // Default cleaning fee
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

  const handleSaveAnalysis = async () => {
    if (!session) {
      router.push('/login?redirect=/airbnb')
      return
    }

    try {
      setSaveError("")
      setIsLoading(true)
      
      const response = await fetch('/api/save-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'airbnb',
          propertyAddress: propertyUrl || 'Manual Entry',
          propertyPrice,
          downPayment,
          downPaymentPercent,
          interestRate,
          nightlyRate,
          occupancyRate,
          maintenanceCosts,
          cleaningFee,
          utilities,
          monthlyRevenue: metrics.monthlyRevenue,
          monthlyExpenses: metrics.monthlyExpenses,
          monthlyProfit: metrics.monthlyProfit,
          monthlyPayment: metrics.monthlyPayment,
          annualRevenue: metrics.annualRevenue,
          annualExpenses: metrics.annualExpenses,
          annualProfit: metrics.annualProfit,
          roi: metrics.roi,
          capRate: metrics.capRate,
          occupiedDays: metrics.occupiedDays,
          vacancyDays: metrics.vacancyDays,
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
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="min-h-screen bg-black text-white">
            <h1 className="text-3xl font-bold mb-8 text-[#2ecc71]">Airbnb Calculator</h1>
            
            {/* Property Details Form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                {/* Navigation */}
                <div className="flex items-center gap-4 mb-12">
                  <Link 
                    href="/" 
                    className="flex items-center gap-2 text-[#2ecc71] hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-6 h-6" />
                    <span className="font-mono">Back Home</span>
                  </Link>
                </div>
                
                {/* Smart Import */}
                <div className="mb-12 bg-black/50 p-6 border border-[#2ecc71]/20">
                  <h3 className="text-2xl font-mono mb-4">Smart Import</h3>
                  <div className="flex gap-4 mb-2">
                    <input
                      type="text"
                      value={propertyUrl}
                      onChange={(e) => setPropertyUrl(e.target.value)}
                      placeholder="Paste Zillow, Redfin, or MLS link here"
                      className="flex-1 bg-black border border-[#2ecc71] px-4 py-3 font-mono text-white placeholder-gray-500 focus:outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71]"
                    />
                    <button
                      onClick={handleSmartImport}
                      disabled={isLoading}
                      className="px-8 py-3 bg-[#2ecc71] text-black font-mono font-bold hover:bg-[#27ae60] disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                      {isLoading ? 'Importing...' : (
                        <>
                          <Calculator className="w-5 h-5" />
                          <span>Smart Import</span>
                        </>
                      )}
                    </button>
                  </div>
                  {error && <p className="text-red-500 font-mono mt-2">{error}</p>}
                </div>

                {/* Calculator Form */}
                <div className="space-y-8 mb-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Property Details */}
                    <div className="space-y-6">
                      <h3 className="text-2xl font-mono mb-4">Property Details</h3>
                      
                      <div>
                        <label className="block text-xl font-mono mb-2">Property Price</label>
                        <div className="relative">
                          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" />
                          <input
                            type="number"
                            value={propertyPrice}
                            onChange={(e) => setPropertyPrice(Number(e.target.value))}
                            className="w-full bg-black border border-[#2ecc71] px-12 py-3 text-xl font-mono focus:outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71]"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xl font-mono mb-2">Down Payment</label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="relative">
                            <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" />
                            <input
                              type="number"
                              value={downPaymentPercent}
                              onChange={(e) => handleDownPaymentPercentChange(Number(e.target.value))}
                              className="w-full bg-black border border-[#2ecc71] px-12 py-3 text-xl font-mono focus:outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71]"
                            />
                          </div>
                          <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" />
                            <input
                              type="number"
                              value={downPayment}
                              onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                              className="w-full bg-black border border-[#2ecc71] px-12 py-3 text-xl font-mono focus:outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71]"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xl font-mono mb-2">Interest Rate</label>
                        <div className="relative">
                          <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" />
                          <input
                            type="number"
                            value={interestRate}
                            onChange={(e) => setInterestRate(Number(e.target.value))}
                            className="w-full bg-black border border-[#2ecc71] px-12 py-3 text-xl font-mono focus:outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71]"
                            step="0.1"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Airbnb Details */}
                    <div className="space-y-6">
                      <h3 className="text-2xl font-mono mb-4">Airbnb Details</h3>
                      
                      <div>
                        <label className="block text-xl font-mono mb-2">Nightly Rate</label>
                        <div className="relative">
                          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" />
                          <input
                            type="number"
                            value={nightlyRate}
                            onChange={(e) => setNightlyRate(Number(e.target.value))}
                            className="w-full bg-black border border-[#2ecc71] px-12 py-3 text-xl font-mono focus:outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71]"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xl font-mono mb-2">Occupancy Rate</label>
                        <div className="relative">
                          <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" />
                          <input
                            type="number"
                            value={occupancyRate}
                            onChange={(e) => setOccupancyRate(Number(e.target.value))}
                            className="w-full bg-black border border-[#2ecc71] px-12 py-3 text-xl font-mono focus:outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71]"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xl font-mono mb-2">Cleaning Fee (per stay)</label>
                        <div className="relative">
                          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" />
                          <input
                            type="number"
                            value={cleaningFee}
                            onChange={(e) => setCleaningFee(Number(e.target.value))}
                            className="w-full bg-black border border-[#2ecc71] px-12 py-3 text-xl font-mono focus:outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71]"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Monthly Expenses */}
                    <div>
                      <h3 className="text-2xl font-mono mb-4">Monthly Expenses</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-xl font-mono mb-2">Maintenance</label>
                          <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" />
                            <input
                              type="number"
                              value={maintenanceCosts}
                              onChange={(e) => setMaintenanceCosts(Number(e.target.value))}
                              className="w-full bg-black border border-[#2ecc71] px-12 py-3 text-xl font-mono focus:outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71]"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-xl font-mono mb-2">Utilities</label>
                          <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" />
                            <input
                              type="number"
                              value={utilities}
                              onChange={(e) => setUtilities(Number(e.target.value))}
                              className="w-full bg-black border border-[#2ecc71] px-12 py-3 text-xl font-mono focus:outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Calculate Button */}
                <div className="mb-12">
                  <button
                    onClick={handleCalculate}
                    disabled={isCalculating}
                    className="w-full bg-[#2ecc71] text-black font-mono text-xl py-4 hover:bg-[#27ae60] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Calculator className="w-6 h-6" />
                    {isCalculating ? 'Calculating...' : 'Calculate Returns'}
                  </button>
                </div>
              </div>
              
              <div className="space-y-8">
                {/* Results Section */}
                {showResults && (
                  <>
                    <div className="bg-[#111111]/40 backdrop-blur-md border border-[#2ecc71]/20 rounded-lg p-8 shadow-xl">
                      <h3 className="text-3xl font-mono mb-8 flex items-center gap-3">
                        Investment Analysis
                        <div className="h-1 flex-1 bg-gradient-to-r from-[#2ecc71]/20 to-transparent" />
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Monthly Metrics */}
                        <div className="bg-black/30 backdrop-blur-sm p-6 border border-[#2ecc71]/20 rounded-lg hover:border-[#2ecc71]/40 transition-all duration-300">
                          <h4 className="text-2xl font-mono mb-6 text-[#2ecc71]">Monthly Metrics</h4>
                          <div className="space-y-6">
                            <div className="group hover:bg-black/20 p-4 rounded-lg transition-all duration-300">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-mono text-gray-400">Revenue</span>
                                <span className="font-mono text-2xl text-[#2ecc71]">
                                  ${metrics.monthlyRevenue.toFixed(2)}
                                </span>
                              </div>
                              <div className="h-1 bg-[#111] rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-[#2ecc71] to-[#27ae60] group-hover:shadow-[0_0_20px_rgba(46,204,113,0.3)] transition-all duration-500"
                                  style={{ width: '100%' }}
                                />
                              </div>
                            </div>
                            
                            <div className="group hover:bg-black/20 p-4 rounded-lg transition-all duration-300">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-mono text-gray-400">Expenses</span>
                                <span className="font-mono text-2xl text-[#e74c3c]">
                                  ${metrics.monthlyExpenses.toFixed(2)}
                                </span>
                              </div>
                              <div className="h-1 bg-[#111] rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-[#e74c3c] to-[#c0392b] group-hover:shadow-[0_0_20px_rgba(231,76,60,0.3)] transition-all duration-500"
                                  style={{ width: `${(metrics.monthlyExpenses / metrics.monthlyRevenue) * 100}%` }}
                                />
                              </div>
                            </div>
                            
                            <div className="group hover:bg-black/20 p-4 rounded-lg transition-all duration-300">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-mono text-gray-400">Net Profit</span>
                                <span className="font-mono text-2xl text-[#2ecc71]">
                                  ${metrics.monthlyProfit.toFixed(2)}
                                </span>
                              </div>
                              <div className="h-1 bg-[#111] rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-[#2ecc71] to-[#27ae60] group-hover:shadow-[0_0_20px_rgba(46,204,113,0.3)] transition-all duration-500"
                                  style={{ width: `${(metrics.monthlyProfit / metrics.monthlyRevenue) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Annual Metrics */}
                        <div className="bg-black/30 backdrop-blur-sm p-6 border border-[#2ecc71]/20 rounded-lg hover:border-[#2ecc71]/40 transition-all duration-300">
                          <h4 className="text-2xl font-mono mb-6 text-[#2ecc71]">Annual Metrics</h4>
                          <div className="space-y-6">
                            <div className="group hover:bg-black/20 p-4 rounded-lg transition-all duration-300">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-mono text-gray-400">Revenue</span>
                                <span className="font-mono text-2xl text-[#2ecc71]">
                                  ${metrics.annualRevenue.toFixed(2)}
                                </span>
                              </div>
                              <div className="h-1 bg-[#111] rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-[#2ecc71] to-[#27ae60] group-hover:shadow-[0_0_20px_rgba(46,204,113,0.3)] transition-all duration-500"
                                  style={{ width: '100%' }}
                                />
                              </div>
                            </div>
                            
                            <div className="group hover:bg-black/20 p-4 rounded-lg transition-all duration-300">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-mono text-gray-400">Expenses</span>
                                <span className="font-mono text-2xl text-[#e74c3c]">
                                  ${metrics.annualExpenses.toFixed(2)}
                                </span>
                              </div>
                              <div className="h-1 bg-[#111] rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-[#e74c3c] to-[#c0392b] group-hover:shadow-[0_0_20px_rgba(231,76,60,0.3)] transition-all duration-500"
                                  style={{ width: `${(metrics.annualExpenses / metrics.annualRevenue) * 100}%` }}
                                />
                              </div>
                            </div>
                            
                            <div className="group hover:bg-black/20 p-4 rounded-lg transition-all duration-300">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-mono text-gray-400">Net Profit</span>
                                <span className="font-mono text-2xl text-[#2ecc71]">
                                  ${metrics.annualProfit.toFixed(2)}
                                </span>
                              </div>
                              <div className="h-1 bg-[#111] rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-[#2ecc71] to-[#27ae60] group-hover:shadow-[0_0_20px_rgba(46,204,113,0.3)] transition-all duration-500"
                                  style={{ width: `${(metrics.annualProfit / metrics.annualRevenue) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Investment Returns */}
                      <div className="mt-8 bg-black/30 backdrop-blur-sm p-6 border border-[#2ecc71]/20 rounded-lg hover:border-[#2ecc71]/40 transition-all duration-300">
                        <h4 className="text-2xl font-mono mb-6 text-[#2ecc71]">Investment Returns</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <div className="group hover:bg-black/20 p-4 rounded-lg transition-all duration-300">
                            <span className="block font-mono text-gray-400 mb-3">Return on Investment</span>
                            <div className="relative h-24 flex items-center justify-center mb-2">
                              <div className="absolute inset-0 bg-[#111] rounded-full" />
                              <div 
                                className="absolute inset-0 bg-gradient-to-r from-[#2ecc71] to-[#27ae60] rounded-full transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(46,204,113,0.3)]"
                                style={{ 
                                  clipPath: `polygon(0 0, ${Math.min(metrics.roi, 100)}% 0, ${Math.min(metrics.roi, 100)}% 100%, 0 100%)` 
                                }}
                              />
                              <div className="relative bg-black/80 px-4 py-2 rounded-full">
                                <span className="text-4xl font-mono text-white">{metrics.roi.toFixed(1)}%</span>
                              </div>
                            </div>
                            <div className="text-center font-mono text-sm text-gray-500">
                              {metrics.roi > 15 ? 'Excellent Returns' : metrics.roi > 10 ? 'Good Returns' : 'Moderate Returns'}
                            </div>
                          </div>

                          <div className="group hover:bg-black/20 p-4 rounded-lg transition-all duration-300">
                            <span className="block font-mono text-gray-400 mb-3">Cap Rate</span>
                            <div className="relative h-24 flex items-center justify-center mb-2">
                              <div className="absolute inset-0 bg-[#111] rounded-full" />
                              <div 
                                className="absolute inset-0 bg-gradient-to-r from-[#2ecc71] to-[#27ae60] rounded-full transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(46,204,113,0.3)]"
                                style={{ 
                                  clipPath: `polygon(0 0, ${Math.min(metrics.capRate * 2, 100)}% 0, ${Math.min(metrics.capRate * 2, 100)}% 100%, 0 100%)` 
                                }}
                              />
                              <div className="relative bg-black/80 px-4 py-2 rounded-full">
                                <span className="text-4xl font-mono text-white">{metrics.capRate.toFixed(1)}%</span>
                              </div>
                            </div>
                            <div className="text-center font-mono text-sm text-gray-500">
                              {metrics.capRate > 8 ? 'Excellent Cap Rate' : metrics.capRate > 6 ? 'Good Cap Rate' : 'Moderate Cap Rate'}
                            </div>
                          </div>

                          <div className="group hover:bg-black/20 p-4 rounded-lg transition-all duration-300">
                            <span className="block font-mono text-gray-400 mb-3">Occupancy</span>
                            <div className="relative h-24 flex items-center justify-center mb-2">
                              <div className="absolute inset-0 bg-[#111] rounded-full" />
                              <div 
                                className="absolute inset-0 bg-gradient-to-r from-[#2ecc71] to-[#27ae60] rounded-full transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(46,204,113,0.3)]"
                                style={{ 
                                  clipPath: `polygon(0 0, ${metrics.occupiedDays / 30 * 100}% 0, ${metrics.occupiedDays / 30 * 100}% 100%, 0 100%)` 
                                }}
                              />
                              <div className="relative bg-black/80 px-4 py-2 rounded-full">
                                <span className="text-4xl font-mono text-white">{metrics.occupiedDays}</span>
                              </div>
                            </div>
                            <div className="text-center font-mono text-sm text-gray-500">
                              days/mo ({(metrics.occupiedDays / 30 * 100).toFixed(0)}% occupancy)
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* GPT Insights */}
                    <GPTInsight
                      calculatorType="airbnb"
                      formData={{
                        propertyPrice,
                        downPayment,
                        interestRate,
                        nightlyRate,
                        occupancyRate,
                        maintenanceCosts,
                        cleaningFee,
                        utilities,
                        metrics
                      }}
                      autoRun={false}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Save Analysis Button */}
            <div className="mt-8">
              <button
                onClick={handleSaveAnalysis}
                disabled={isLoading || !session}
                className={`w-full py-4 font-mono text-xl transition-all duration-300 ${
                  session 
                    ? 'border border-[#2ecc71] hover:bg-[#2ecc71] hover:text-black text-[#2ecc71]' 
                    : 'border border-gray-600 text-gray-600 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </span>
                ) : session ? (
                  'Save Report'
                ) : (
                  'Login to Save Report'
                )}
              </button>
              
              {saveSuccess && (
                <div className="mt-2 text-center text-[#2ecc71] font-mono animate-fade-in">
                  Report saved successfully!
                </div>
              )}
              
              {saveError && (
                <div className="mt-2 text-center text-red-500 font-mono animate-fade-in">
                  {saveError}
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-4 gap-4 mt-12">
            <Link
              href="/calculator"
              className="py-4 border border-[#2ecc71] text-2xl font-mono text-center hover:bg-[#2ecc71] hover:text-black transition-colors"
            >
              Mortgage
            </Link>
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

          {/* Analytical Charts */}
          {showResults && (
            <div className="mt-12 space-y-8">
              <h3 className="text-3xl font-mono mb-6">Revenue Analysis</h3>
              
              {/* Bar Chart */}
              <div className="bg-black/50 p-6 border border-[#2ecc71]/20">
                <div className="flex flex-col space-y-12">
                  {/* Main Metrics Bar Chart */}
                  <div className="h-96 flex items-end justify-around gap-24 pt-12">
                    {/* Monthly Revenue Bar */}
                    <div className="flex flex-col items-center gap-4">
                      <div 
                        className="w-32 bg-[#2ecc71] transition-all duration-500" 
                        style={{ 
                          height: `${(metrics.monthlyRevenue / Math.max(metrics.monthlyRevenue, metrics.monthlyExpenses, metrics.monthlyProfit)) * 100}%`,
                        }}
                      />
                      <div className="text-center">
                        <div className="font-mono text-xl mb-2">Revenue</div>
                        <div className="font-mono text-3xl text-[#2ecc71]">${metrics.monthlyRevenue.toFixed(0)}</div>
                      </div>
                    </div>
                    
                    {/* Monthly Expenses Bar */}
                    <div className="flex flex-col items-center gap-4">
                      <div 
                        className="w-32 bg-[#2ecc71] transition-all duration-500" 
                        style={{ 
                          height: `${(metrics.monthlyExpenses / Math.max(metrics.monthlyRevenue, metrics.monthlyExpenses, metrics.monthlyProfit)) * 100}%`,
                        }}
                      />
                      <div className="text-center">
                        <div className="font-mono text-xl mb-2">Expenses</div>
                        <div className="font-mono text-3xl text-[#2ecc71]">${metrics.monthlyExpenses.toFixed(0)}</div>
                      </div>
                    </div>
                    
                    {/* Monthly Profit Bar */}
                    <div className="flex flex-col items-center gap-4">
                      <div 
                        className="w-32 bg-[#2ecc71] transition-all duration-500" 
                        style={{ 
                          height: `${(metrics.monthlyProfit / Math.max(metrics.monthlyRevenue, metrics.monthlyExpenses, metrics.monthlyProfit)) * 100}%`,
                        }}
                      />
                      <div className="text-center">
                        <div className="font-mono text-xl mb-2">Profit</div>
                        <div className="font-mono text-3xl text-[#2ecc71]">${metrics.monthlyProfit.toFixed(0)}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Revenue Breakdown */}
                  <div className="space-y-4">
                    <h4 className="text-xl font-mono">Revenue Breakdown</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Nightly Revenue */}
                      <div className="bg-black/30 p-4 border border-[#2ecc71]/10">
                        <span className="block font-mono text-sm mb-2">Nightly Revenue</span>
                        <div className="h-2 bg-[#111] mb-2">
                          <div 
                            className="h-full bg-[#2ecc71] transition-all duration-500"
                            style={{ width: `${(metrics.occupiedDays * nightlyRate / metrics.monthlyRevenue) * 100}%` }}
                          />
                        </div>
                        <span className="font-mono text-lg">${(metrics.occupiedDays * nightlyRate).toFixed(0)}</span>
                      </div>

                      {/* Cleaning Revenue */}
                      <div className="bg-black/30 p-4 border border-[#2ecc71]/10">
                        <span className="block font-mono text-sm mb-2">Cleaning Revenue</span>
                        <div className="h-2 bg-[#111] mb-2">
                          <div 
                            className="h-full bg-[#2ecc71] transition-all duration-500"
                            style={{ width: `${(metrics.occupiedDays * cleaningFee / metrics.monthlyRevenue) * 100}%` }}
                          />
                        </div>
                        <span className="font-mono text-lg">${(metrics.occupiedDays * cleaningFee).toFixed(0)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expense Breakdown */}
                  <div className="space-y-4">
                    <h4 className="text-xl font-mono">Expense Breakdown</h4>
                    <div className="space-y-3">
                      {/* Mortgage Payment */}
                      <div>
                        <div className="flex justify-between font-mono text-sm mb-1">
                          <span>Mortgage</span>
                          <span>${metrics.monthlyPayment.toFixed(0)}</span>
                        </div>
                        <div className="h-2 bg-[#111]">
                          <div 
                            className="h-full bg-[#e74c3c] transition-all duration-500"
                            style={{ width: `${(metrics.monthlyPayment / metrics.monthlyExpenses) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Maintenance */}
                      <div>
                        <div className="flex justify-between font-mono text-sm mb-1">
                          <span>Maintenance</span>
                          <span>${maintenanceCosts}</span>
                        </div>
                        <div className="h-2 bg-[#111]">
                          <div 
                            className="h-full bg-[#e74c3c] transition-all duration-500"
                            style={{ width: `${(maintenanceCosts / metrics.monthlyExpenses) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Utilities */}
                      <div>
                        <div className="flex justify-between font-mono text-sm mb-1">
                          <span>Utilities</span>
                          <span>${utilities}</span>
                        </div>
                        <div className="h-2 bg-[#111]">
                          <div 
                            className="h-full bg-[#e74c3c] transition-all duration-500"
                            style={{ width: `${(utilities / metrics.monthlyExpenses) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Occupancy Analysis */}
              <div className="bg-black/50 p-6 border border-[#2ecc71]/20">
                <h4 className="text-2xl font-mono mb-4">Occupancy Distribution</h4>
                <div className="h-8 w-full bg-[#111] relative">
                  <div 
                    className="h-full bg-[#2ecc71] absolute left-0 top-0 transition-all duration-500"
                    style={{ width: `${occupancyRate}%` }}
                  />
                  <div className="absolute top-full mt-2 left-0 font-mono text-sm">
                    Occupied: {metrics.occupiedDays} days
                  </div>
                  <div className="absolute top-full mt-2 right-0 font-mono text-sm">
                    Vacant: {metrics.vacancyDays} days
                  </div>
                </div>
              </div>

              {/* Key Performance Indicators */}
              <div className="bg-black/50 p-6 border border-[#2ecc71]/20">
                <h4 className="text-2xl font-mono mb-4">Performance Indicators</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* ROI Indicator */}
                  <div className="relative pt-2">
                    <div className="h-2 w-full bg-[#111]">
                      <div 
                        className="h-full bg-[#2ecc71] transition-all duration-500"
                        style={{ width: `${Math.min(metrics.roi, 100)}%` }}
                      />
                    </div>
                    <div className="mt-2">
                      <span className="block font-mono text-sm">ROI</span>
                      <span className="font-mono text-2xl">{metrics.roi.toFixed(1)}%</span>
                    </div>
                  </div>
                  
                  {/* Cap Rate Indicator */}
                  <div className="relative pt-2">
                    <div className="h-2 w-full bg-[#111]">
                      <div 
                        className="h-full bg-[#2ecc71] transition-all duration-500"
                        style={{ width: `${Math.min(metrics.capRate, 100)}%` }}
                      />
                    </div>
                    <div className="mt-2">
                      <span className="block font-mono text-sm">Cap Rate</span>
                      <span className="font-mono text-2xl">{metrics.capRate.toFixed(1)}%</span>
                    </div>
                  </div>
                  
                  {/* Revenue per Day */}
                  <div className="relative pt-2">
                    <div className="h-2 w-full bg-[#111]">
                      <div 
                        className="h-full bg-[#2ecc71] transition-all duration-500"
                        style={{ width: `${(metrics.monthlyRevenue / 30 / nightlyRate) * 100}%` }}
                      />
                    </div>
                    <div className="mt-2">
                      <span className="block font-mono text-sm">Avg. Daily Revenue</span>
                      <span className="font-mono text-2xl">${(metrics.monthlyRevenue / 30).toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
} 