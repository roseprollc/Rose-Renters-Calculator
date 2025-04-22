"use client"

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calculator, DollarSign, Percent } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import GPTInsight from '../components/GPTInsight'
import { extractAddressFromUrl } from '../../utils/url'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'

export default function WholesaleCalculatorPage() {
  const { data: session } = useSession()
  const [propertyUrl, setPropertyUrl] = useState("")
  const [propertyPrice, setPropertyPrice] = useState(400000)
  const [repairCosts, setRepairCosts] = useState(50000)
  const [arv, setArv] = useState(550000)
  const [offerPrice, setOfferPrice] = useState(300000)
  const [closingCosts, setClosingCosts] = useState(3000)
  const [holdingCosts, setHoldingCosts] = useState(1000)
  const [wholesaleFee, setWholesaleFee] = useState(15000)
  const [propertyData, setPropertyData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)

  const calculateDeal = () => {
    // Comprehensive wholesale deal calculations
    const potentialProfit = offerPrice - propertyPrice
    const maxAllowableOffer = arv * 0.70 - repairCosts // 70% Rule
    const equityAfterRepair = arv - (propertyPrice + repairCosts)
    const roi = (potentialProfit / propertyPrice) * 100
    const arvToOfferRatio = (offerPrice / arv) * 100
    
    // Risk metrics
    const riskLevel = arvToOfferRatio > 80 ? "High" : arvToOfferRatio > 65 ? "Medium" : "Low"
    const profitMargin = (potentialProfit / offerPrice) * 100
    const repairRatio = (repairCosts / arv) * 100

    // Additional wholesale metrics
    const totalInvestmentRequired = propertyPrice + closingCosts + holdingCosts
    const netProfit = potentialProfit - closingCosts - holdingCosts
    const cashOnCash = (netProfit / totalInvestmentRequired) * 100
    const buyerPotentialProfit = arv - (offerPrice + repairCosts + closingCosts)
    const buyerROI = (buyerPotentialProfit / (offerPrice + repairCosts + closingCosts)) * 100
    const wholesaleSpread = offerPrice - propertyPrice
    const assignmentFeeRatio = (wholesaleFee / offerPrice) * 100
    
    return {
      potentialProfit,
      maxAllowableOffer,
      equityAfterRepair,
      roi,
      arvToOfferRatio,
      riskLevel,
      profitMargin,
      repairRatio,
      totalInvestmentRequired,
      netProfit,
      cashOnCash,
      buyerPotentialProfit,
      buyerROI,
      wholesaleSpread,
      assignmentFeeRatio
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
      setRepairCosts(Math.round(data.price * 0.15)) // Default to 15% of property price
      setArv(data.price + Math.round(data.price * 0.15)) // ARV = Purchase Price + Repair Costs
      setOfferPrice(Math.round(data.price * 0.7)) // Default to 70% of property price
      setClosingCosts(5000) // Default closing costs
      setHoldingCosts(2000) // Default monthly holding costs
      setWholesaleFee(10000) // Default wholesale fee

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

  const handleCalculate = () => {
    setIsCalculating(true)
    setShowResults(true)
    setTimeout(() => {
      setIsCalculating(false)
      document.querySelector('#results')?.scrollIntoView({ behavior: 'smooth' })
    }, 500)
  }

  const handleSaveAnalysis = async () => {
    if (!session) {
      window.location.href = '/login'
      return
    }

    try {
      const dealMetrics = calculateDeal()
      const response = await fetch('/api/save-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'wholesale',
          propertyAddress: propertyUrl || 'Manual Entry',
          propertyPrice,
          repairCosts,
          arv,
          offerPrice,
          closingCosts,
          holdingCosts,
          wholesaleFee,
          potentialProfit: dealMetrics.potentialProfit,
          roi: dealMetrics.roi,
          totalInvestmentRequired: dealMetrics.totalInvestmentRequired,
          maxAllowableOffer: dealMetrics.maxAllowableOffer,
          equityAfterRepair: dealMetrics.equityAfterRepair,
          arvToOfferRatio: dealMetrics.arvToOfferRatio,
          riskLevel: dealMetrics.riskLevel,
          profitMargin: dealMetrics.profitMargin,
          repairRatio: dealMetrics.repairRatio,
          assignmentFeeRatio: dealMetrics.assignmentFeeRatio,
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

      const data = await response.json()
      toast.success('Analysis saved successfully')
      window.location.href = '/saved'
    } catch (error) {
      console.error('Error saving analysis:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save analysis')
    }
  }

  const dealMetrics = calculateDeal()

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

        <h2 className="text-5xl font-mono mb-12">Wholesale Deal Analyzer</h2>

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
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                className="w-full bg-black border border-[#2ecc71] px-12 py-4 text-2xl font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-3xl font-mono mb-4">Repair costs</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">$</span>
              <input
                type="number"
                value={repairCosts}
                onChange={(e) => setRepairCosts(Number(e.target.value))}
                className="w-full bg-black border border-[#2ecc71] px-12 py-4 text-2xl font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-3xl font-mono mb-4">After Repair Value (ARV)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">$</span>
              <input
                type="number"
                value={arv}
                onChange={(e) => setArv(Number(e.target.value))}
                className="w-full bg-black border border-[#2ecc71] px-12 py-4 text-2xl font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-3xl font-mono mb-4">Offer price</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">$</span>
              <input
                type="number"
                value={offerPrice}
                onChange={(e) => setOfferPrice(Number(e.target.value))}
                className="w-full bg-black border border-[#2ecc71] px-12 py-4 text-2xl font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-3xl font-mono mb-4">Closing Costs</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">$</span>
                <input
                  type="number"
                  value={closingCosts}
                  onChange={(e) => setClosingCosts(Number(e.target.value))}
                  className="w-full bg-black border border-[#2ecc71] px-12 py-4 text-2xl font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-3xl font-mono mb-4">Holding Costs</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">$</span>
                <input
                  type="number"
                  value={holdingCosts}
                  onChange={(e) => setHoldingCosts(Number(e.target.value))}
                  className="w-full bg-black border border-[#2ecc71] px-12 py-4 text-2xl font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-3xl font-mono mb-4">Wholesale Fee</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">$</span>
              <input
                type="number"
                value={wholesaleFee}
                onChange={(e) => setWholesaleFee(Number(e.target.value))}
                className="w-full bg-black border border-[#2ecc71] px-12 py-4 text-2xl font-mono"
              />
            </div>
          </div>

          <button
            onClick={handleCalculate}
            disabled={isCalculating}
            className="w-full bg-[#2ecc71] text-black font-mono text-xl py-4 hover:bg-[#27ae60] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {isCalculating ? 'Analyzing Deal...' : 'Analyze Deal'}
          </button>
        </div>

        {/* Enhanced Results Section */}
        <div id="results" className={`space-y-8 mb-12 transition-opacity duration-500 ${showResults ? 'opacity-100' : 'opacity-0'}`}>
          <h3 className="text-3xl font-mono mb-6">Deal Analysis</h3>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black/50 p-6 border border-[#2ecc71]/20">
              <h4 className="text-xl font-mono mb-2">Potential Profit</h4>
              <div className="text-4xl font-mono text-[#2ecc71]">
                ${dealMetrics.potentialProfit.toLocaleString()}
              </div>
            </div>
            <div className="bg-black/50 p-6 border border-[#2ecc71]/20">
              <h4 className="text-xl font-mono mb-2">ROI</h4>
              <div className="text-4xl font-mono text-[#2ecc71]">
                {dealMetrics.roi.toFixed(1)}%
              </div>
            </div>
            <div className="bg-black/50 p-6 border border-[#2ecc71]/20">
              <h4 className="text-xl font-mono mb-2">Risk Level</h4>
              <div className="text-4xl font-mono text-[#2ecc71]">
                {dealMetrics.riskLevel}
              </div>
            </div>
          </div>

          {/* Deal Metrics */}
          <div className="bg-black/50 p-6 border border-[#2ecc71]/20">
            <h4 className="text-2xl font-mono mb-4">Deal Metrics</h4>
            <div className="space-y-6">
              {/* MAO Analysis */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono">Maximum Allowable Offer (70% Rule)</span>
                  <span className="font-mono text-xl">${dealMetrics.maxAllowableOffer.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-[#111] w-full">
                  <div 
                    className="h-full bg-[#111] w-full"
                  />
                </div>
                <div className="text-sm font-mono mt-1 text-gray-400">
                  Your offer is {offerPrice > dealMetrics.maxAllowableOffer ? 'above' : 'below'} MAO
                </div>
              </div>

              {/* Equity Position */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono">Equity After Repair</span>
                  <span className="font-mono text-xl">${dealMetrics.equityAfterRepair.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-[#111] w-full">
                  <div 
                    className="h-full bg-[#2ecc71] transition-all duration-500"
                    style={{ width: `${(dealMetrics.equityAfterRepair / arv) * 100}%` }}
                  />
                </div>
              </div>

              {/* Profit Margin */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono">Profit Margin</span>
                  <span className="font-mono text-xl">{dealMetrics.profitMargin.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-[#111] w-full">
                  <div 
                    className="h-full bg-[#2ecc71] transition-all duration-500"
                    style={{ width: `${dealMetrics.profitMargin}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-black/50 p-6 border border-[#2ecc71]/20">
            <h4 className="text-2xl font-mono mb-4">Cost Breakdown</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="font-mono text-sm mb-1">Purchase Price</div>
                  <div className="font-mono text-2xl">${propertyPrice.toLocaleString()}</div>
                </div>
                <div>
                  <div className="font-mono text-sm mb-1">Repair Costs</div>
                  <div className="font-mono text-2xl">${repairCosts.toLocaleString()}</div>
                </div>
                <div>
                  <div className="font-mono text-sm mb-1">ARV</div>
                  <div className="font-mono text-2xl">${arv.toLocaleString()}</div>
                </div>
              </div>
              
              {/* Cost Stack Visualization */}
              <div className="h-8 bg-[#111] w-full flex">
                <div 
                  className="h-full bg-[#2ecc71] transition-all duration-500"
                  style={{ width: `${(propertyPrice / arv) * 100}%` }}
                />
                <div 
                  className="h-full bg-[#e74c3c] transition-all duration-500"
                  style={{ width: `${(repairCosts / arv) * 100}%` }}
                />
                <div 
                  className="h-full bg-[#f1c40f] transition-all duration-500"
                  style={{ width: `${(dealMetrics.potentialProfit / arv) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-sm font-mono">
                <span>Purchase</span>
                <span>Repairs</span>
                <span>Profit</span>
              </div>
            </div>
          </div>

          {/* Risk Analysis */}
          <div className="bg-black/50 p-6 border border-[#2ecc71]/20">
            <h4 className="text-2xl font-mono mb-4">Risk Analysis</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono">ARV to Offer Ratio</span>
                  <span className="font-mono text-xl">{dealMetrics.arvToOfferRatio.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-[#111] w-full">
                  <div 
                    className="h-full transition-all duration-500"
                    style={{ 
                      width: `${dealMetrics.arvToOfferRatio}%`,
                      backgroundColor: dealMetrics.riskLevel === "High" ? '#e74c3c' : dealMetrics.riskLevel === "Medium" ? '#f1c40f' : '#2ecc71'
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono">Repair Ratio</span>
                  <span className="font-mono text-xl">{dealMetrics.repairRatio.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-[#111] w-full">
                  <div 
                    className="h-full transition-all duration-500"
                    style={{ 
                      width: `${dealMetrics.repairRatio}%`,
                      backgroundColor: dealMetrics.repairRatio > 30 ? '#e74c3c' : dealMetrics.repairRatio > 15 ? '#f1c40f' : '#2ecc71'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Wholesale Specific Metrics */}
          <div className="bg-black/50 p-6 border border-[#2ecc71]/20">
            <h4 className="text-2xl font-mono mb-4">Wholesale Analysis</h4>
            <div className="space-y-6">
              {/* Wholesale Spread */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono">Wholesale Spread</span>
                  <span className="font-mono text-xl">${dealMetrics.wholesaleSpread.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-[#111] w-full">
                  <div 
                    className="h-full bg-[#2ecc71] transition-all duration-500"
                    style={{ width: `${(dealMetrics.wholesaleSpread / arv) * 100}%` }}
                  />
                </div>
              </div>

              {/* Assignment Fee Analysis */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono">Assignment Fee Ratio</span>
                  <span className="font-mono text-xl">{dealMetrics.assignmentFeeRatio.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-[#111] w-full">
                  <div 
                    className="h-full transition-all duration-500"
                    style={{ 
                      width: `${dealMetrics.assignmentFeeRatio}%`,
                      backgroundColor: dealMetrics.assignmentFeeRatio > 8 ? '#e74c3c' : dealMetrics.assignmentFeeRatio > 5 ? '#f1c40f' : '#2ecc71'
                    }}
                  />
                </div>
              </div>

              {/* Net Profit After Costs */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono">Net Profit (After Costs)</span>
                  <span className="font-mono text-xl">${dealMetrics.netProfit.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-[#111] w-full">
                  <div 
                    className="h-full bg-[#2ecc71] transition-all duration-500"
                    style={{ width: `${(dealMetrics.netProfit / dealMetrics.potentialProfit) * 100}%` }}
                  />
                </div>
              </div>

              {/* Cash on Cash Return */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono">Cash on Cash Return</span>
                  <span className="font-mono text-xl">{dealMetrics.cashOnCash.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-[#111] w-full">
                  <div 
                    className="h-full bg-[#2ecc71] transition-all duration-500"
                    style={{ width: `${Math.min(dealMetrics.cashOnCash, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Buyer Analysis */}
          <div className="bg-black/50 p-6 border border-[#2ecc71]/20">
            <h4 className="text-2xl font-mono mb-4">Buyer's Perspective</h4>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="font-mono text-sm mb-1">Buyer's Potential Profit</div>
                  <div className="font-mono text-2xl text-[#2ecc71]">
                    ${dealMetrics.buyerPotentialProfit.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-sm mb-1">Buyer's ROI</div>
                  <div className="font-mono text-2xl text-[#2ecc71]">
                    {dealMetrics.buyerROI.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Total Investment Required */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono">Total Investment Required</span>
                  <span className="font-mono text-xl">${dealMetrics.totalInvestmentRequired.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-[#111] w-full">
                  <div 
                    className="h-full bg-[#2ecc71] transition-all duration-500"
                    style={{ width: `${(dealMetrics.totalInvestmentRequired / arv) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* GPT Insights */}
          <div className="mt-8">
            <GPTInsight
              calculatorType="wholesale"
              formData={{
                propertyPrice,
                repairCosts,
                arv,
                offerPrice,
                closingCosts,
                holdingCosts,
                wholesaleFee,
                analytics: {
                  potentialProfit: dealMetrics.potentialProfit,
                  maxAllowableOffer: dealMetrics.maxAllowableOffer,
                  equityAfterRepair: dealMetrics.equityAfterRepair,
                  roi: dealMetrics.roi,
                  arvToOfferRatio: dealMetrics.arvToOfferRatio,
                  riskLevel: dealMetrics.riskLevel,
                  profitMargin: dealMetrics.profitMargin,
                  repairRatio: dealMetrics.repairRatio,
                  totalInvestmentRequired: dealMetrics.totalInvestmentRequired,
                  netProfit: dealMetrics.netProfit,
                  cashOnCash: dealMetrics.cashOnCash,
                  buyerPotentialProfit: dealMetrics.buyerPotentialProfit,
                  buyerROI: dealMetrics.buyerROI,
                  wholesaleSpread: dealMetrics.wholesaleSpread,
                  assignmentFeeRatio: dealMetrics.assignmentFeeRatio
                }
              }}
              autoRun={false}
            />
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
          <button 
            onClick={handleSaveAnalysis}
            className="mt-4 w-full py-4 border border-[#2ecc71] text-xl font-mono hover:bg-[#2ecc71] hover:text-black transition-colors"
          >
            {session ? 'Save Report' : 'Login to Save Report'}
          </button>
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
      </div>
    </div>
  )
} 