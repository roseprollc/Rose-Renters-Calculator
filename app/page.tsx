"use client"

import { useState, useEffect, useCallback } from 'react'
import { Search, MapPin, Camera, Edit2, Printer, Share2, X, Star, Calculator, FileText, Mail, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import PageLayout from './components/PageLayout'
import { toast } from 'react-hot-toast'

// Force dynamic rendering to prevent static generation
export const dynamic = 'force-dynamic'

const formatAddress = (parts: string[]): string => {
  // Remove any empty strings and clean up the parts
  const cleanParts = parts.filter(part => part && part !== 'home' && !part.match(/^\d+$/))
  
  // Process each part to ensure proper capitalization and formatting
  const formattedParts = cleanParts.map(part => {
    // Split by both hyphens and underscores
    return part
      .split(/[-_]/)
      .map(word => {
        // Handle state abbreviations
        if (word.length === 2 && word.toUpperCase() === word) {
          return word.toUpperCase()
        }
        // Handle zip codes
        if (word.match(/^\d{5}$/)) {
          return word
        }
        // Handle street numbers
        if (word.match(/^\d+$/)) {
          return word
        }
        // Capitalize other words
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      })
      .join(' ')
  })

  // Join all parts with spaces
  return formattedParts.join(' ')
}

const extractAddressFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url)
    
    // Handle Redfin URLs
    if (urlObj.hostname.includes('redfin.com')) {
      const parts = urlObj.pathname.split('/')
      // Extract state, city, and address parts
      const state = parts[1] || ''
      const city = parts[2] || ''
      const addressParts = parts.slice(3).filter(part => part && part !== 'home' && !part.match(/^\d+$/))
      
      // Extract zip code if present
      const zipCode = addressParts.find(part => part.match(/^\d{5}$/)) || ''
      
      // Remove zip code from address parts
      const streetAddressParts = addressParts.filter(part => part !== zipCode)
      
      // Format the street address
      const formattedAddress = streetAddressParts
        .map(part => part
          .split('-')
          .map(word => {
            // Handle street numbers
            if (word.match(/^\d+$/)) {
              return word
            }
            // Capitalize other words
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          })
          .join(' ')
        )
        .join(' ')
      
      // Return in the format "Street Address City STATE ZIPCODE"
      return `${formattedAddress} ${city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()} ${state.toUpperCase()} ${zipCode}`
    }
    
    // Handle Zillow URLs
    if (urlObj.hostname.includes('zillow.com')) {
      const parts = urlObj.pathname.split('/')
      const addressPart = parts.find(part => part.includes('-'))
      if (addressPart) {
        // Format Zillow address to match the desired format
        const addressComponents = addressPart.split('-')
        const zipCode = addressComponents.find(part => part.match(/^\d{5}$/)) || ''
        const state = addressComponents.find(part => part.length === 2 && part.toUpperCase() === part) || ''
        const city = addressComponents[addressComponents.length - 2] || ''
        
        // Remove zip code, state, and city from the address components
        const streetAddress = addressComponents
          .filter(part => part !== zipCode && part !== state && part !== city)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
        
        // Return in the format "Street Address City STATE ZIPCODE"
        return `${streetAddress} ${city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()} ${state.toUpperCase()} ${zipCode}`
      }
    }
    
    // Handle Realtor.com URLs
    if (urlObj.hostname.includes('realtor.com')) {
      const parts = urlObj.pathname.split('/')
      const addressPart = parts.find(part => part.includes('_'))
      if (addressPart) {
        // Format Realtor.com address to match the desired format
        const addressComponents = addressPart.split('_')
        const zipCode = addressComponents.find(part => part.match(/^\d{5}$/)) || ''
        const state = addressComponents.find(part => part.length === 2 && part.toUpperCase() === part) || ''
        const city = addressComponents[addressComponents.length - 2] || ''
        
        // Remove zip code, state, and city from the address components
        const streetAddress = addressComponents
          .filter(part => part !== zipCode && part !== state && part !== city)
          .map(word => {
            return word
              .split('-')
              .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
              .join(' ')
          })
          .join(' ')
        
        // Return in the format "Street Address City STATE ZIPCODE"
        return `${streetAddress} ${city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()} ${state.toUpperCase()} ${zipCode}`
      }
    }
    
    // If no pattern matches, return the original URL
    return url
  } catch (error) {
    // If URL parsing fails, return the original input
    return url
  }
}

// Helper function to format any address string to the standard format
const formatAddressToStandard = (address: string): string => {
  // If it's already a URL, extract the address first
  if (address.startsWith('http')) {
    address = extractAddressFromUrl(address)
  }
  
  // Split the address into parts
  const parts = address.split(/\s+/).filter(part => part.length > 0)
  
  // Find the zip code (5 digits)
  const zipCodeIndex = parts.findIndex(part => /^\d{5}$/.test(part))
  const zipCode = zipCodeIndex !== -1 ? parts[zipCodeIndex] : ''
  
  // Find the state (2 letter abbreviation)
  const stateIndex = parts.findIndex((part, index) => {
    const upperPart = part.toUpperCase()
    // Check if this is "ST" meaning "Street"
    if (upperPart === 'ST') {
      // Look at previous part to see if it's a number (indicating street address)
      const prevPart = parts[index - 1]
      if (prevPart && /^\d+$/.test(prevPart)) {
        return false // This "ST" is part of street address
      }
    }
    // Otherwise check if it's a valid state abbreviation
    return /^[A-Z]{2}$/.test(upperPart)
  })
  const state = stateIndex !== -1 ? parts[stateIndex].toUpperCase() : ''
  
  // Find the city (usually before the state)
  const cityIndex = stateIndex !== -1 ? stateIndex - 1 : -1
  const city = cityIndex !== -1 ? parts[cityIndex] : ''
  
  // Get all parts before the city as the street address
  const streetParts = parts.slice(0, cityIndex !== -1 ? cityIndex : parts.length)
    .filter(part => part !== zipCode)
  
  // Format street address
  const formattedStreetAddress = streetParts
    .map(word => {
      // Handle street numbers
      if (/^\d+$/.test(word)) {
        return word
      }
      // Handle 'ST' abbreviation for Street
      if (word.toUpperCase() === 'ST') {
        return 'Street'
      }
      // Capitalize other words
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
  
  const formattedCity = city
    ? city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()
    : ''
  
  // Return in the format "Street Address City STATE ZIPCODE"
  return `${formattedStreetAddress} ${formattedCity} ${state} ${zipCode}`.trim()
}

export default function Home() {
  const router = useRouter()
  const [selectedMode, setSelectedMode] = useState('airbnb')
  const [address, setAddress] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  // Airbnb specific states
  const [occupancyRate, setOccupancyRate] = useState(65)
  const [avgDailyRate, setAvgDailyRate] = useState(292)
  const [cleaningFee, setCleaningFee] = useState(150) // per stay
  const [airbnbMaintenanceExpense, setAirbnbMaintenanceExpense] = useState(3600) // annual
  const [airbnbInsurance, setAirbnbInsurance] = useState(2400) // annual
  const [airbnbPropertyTax, setAirbnbPropertyTax] = useState(7500) // annual
  const [platformFeePercent, setPlatformFeePercent] = useState(3) // % of booking
  // Mortgage specific states
  const [downPayment, setDownPayment] = useState(20)
  const [interestRate, setInterestRate] = useState(7.5)
  // Rental specific states
  const [monthlyRent, setMonthlyRent] = useState(2500)
  const [vacancyRate, setVacancyRate] = useState(5)
  const [propertyManagementFee, setPropertyManagementFee] = useState(8) // % of rent
  const [maintenanceExpense, setMaintenanceExpense] = useState(2400) // annual
  const [rentalInsurance, setRentalInsurance] = useState(1200) // annual
  const [rentalPropertyTax, setRentalPropertyTax] = useState(7500) // annual
  // Wholesale specific states
  const [repairCosts, setRepairCosts] = useState(25000)
  const [arv, setArv] = useState(850000)
  const [holdingCosts, setHoldingCosts] = useState(3000) // monthly holding costs
  const [holdingPeriod, setHoldingPeriod] = useState(3) // months
  const [sellerClosingCosts, setSellerClosingCosts] = useState(2) // % of purchase price
  const [buyerClosingCosts, setBuyerClosingCosts] = useState(2) // % of ARV
  const [marketingCosts, setMarketingCosts] = useState(2500) // fixed amount
  const [wholesaleFee, setWholesaleFee] = useState(15000) // fixed amount

  // Common states
  const [propertyPrice, setPropertyPrice] = useState(750000)

  // Additional mortgage specific states
  const [propertyTax, setPropertyTax] = useState(7500) // Annual property tax in dollars
  const [insurance, setInsurance] = useState(1200) // Annual insurance
  const [pmi, setPmi] = useState(0.5) // PMI rate

  // Add new state for map URL
  const [mapUrl, setMapUrl] = useState<string | null>(null)

  // Add new state for authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Add new state for share modal
  const [showShareModal, setShowShareModal] = useState(false)

  // Add new state for map loading and error
  const [isMapLoading, setIsMapLoading] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)

  // Add new state for loading
  const [isLoading, setIsLoading] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)

  // Add new state for Smart Import
  const [isImporting, setIsImporting] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)

  // Load saved address from localStorage on mount
  useEffect(() => {
    const savedAddress = localStorage.getItem('propertyAddress')
    if (savedAddress) {
      setAddress(savedAddress)
      setShowPreview(true)
    }
  }, [])

  // Check authentication status on mount
  useEffect(() => {
    // This should be replaced with your actual auth check
    const checkAuth = async () => {
      // Placeholder: Replace with your actual auth check
      const token = localStorage.getItem('authToken')
      setIsAuthenticated(!!token)
    }
    checkAuth()
  }, [])

  const handleSmartImport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const url = formData.get('url')?.toString() || ''

    if (!url) {
      toast.error('Please enter a valid property URL')
      return
    }

    // Check if it's a Zillow URL and show a message
    if (url.includes('zillow.com')) {
      toast.error('Zillow links are currently not supported. Please use Redfin or Realtor.com links instead.')
      return
    }

    setIsImporting(true)
    setImportError(null)
    setIsMapLoading(true)
    setMapError(null)

    try {
      // For testing purposes, use a test URL
      const testUrl = url.includes('test') ? url : url;
      
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: testUrl })
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

      setPropertyPrice(data.price)
      const formattedAddress = formatAddressToStandard(data.address)
      setAddress(formattedAddress)
      
      // Load map after address is set
      try {
        const mapsResponse = await fetch('/api/maps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: formattedAddress })
        })

        if (!mapsResponse.ok) {
          throw new Error('Failed to load map')
        }

        const mapData = await mapsResponse.json()
        setMapUrl(mapData.mapUrl)
        setIsMapLoading(false)
      } catch (mapError) {
        console.error('Map loading error:', mapError)
        setMapError('Failed to load map. You can still continue with the analysis.')
        setIsMapLoading(false)
        // Don't throw here, we still have the property data
      }

      toast.success('Property data imported successfully!')
      setIsImporting(false)
    } catch (error) {
      console.error('Import error:', error)
      setImportError(error instanceof Error ? error.message : 'Failed to import property data')
      setIsImporting(false)
      setIsMapLoading(false)
      
      // If we have a Redfin URL, try to extract address from URL as fallback
      if (url.includes('redfin.com')) {
        try {
          const extractedAddress = extractAddressFromUrl(url)
          if (extractedAddress) {
            setAddress(extractedAddress)
            toast.success('Address extracted from URL. Please enter property price manually.')
          }
        } catch (urlError) {
          console.error('URL parsing error:', urlError)
        }
      }
    }
  }

  const handleClear = () => {
    setAddress('')
    setShowPreview(false)
    localStorage.removeItem('propertyAddress')
  }

  // Handle map click
  const handleMapClick = () => {
    if (address) {
      const confirmed = window.confirm('Would you like to view this location in Google Maps?')
      if (confirmed) {
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank')
      }
    }
  }

  // Handle edit click
  const handleEditClick = () => {
    switch(selectedMode) {
      case 'mortgage':
        router.push('/calculator')
        break
      case 'renters':
        router.push('/renters')
        break
      case 'airbnb':
        router.push('/airbnb')
        break
      case 'wholesale':
        router.push('/wholesale')
        break
    }
  }

  // Handle continue click
  const handleContinue = () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    router.push('/reports')
  }

  // Handle print click
  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  // Handle share click
  const handleShare = () => {
    setShowShareModal(true)
  }

  // Handle share via email
  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Property Analysis: ${address}`)
    const body = encodeURIComponent(`Check out this property analysis:\n\nAddress: ${address}\nPrice: $${propertyPrice.toLocaleString()}\nEstimated ${getRevenueLabel()}: $${calculateRevenue()}`)
    window.open(`mailto:?subject=${subject}&body=${body}`)
    setShowShareModal(false)
  }

  // Handle share via text
  const handleTextShare = () => {
    const message = encodeURIComponent(`Check out this property analysis:\n\nAddress: ${address}\nPrice: $${propertyPrice.toLocaleString()}\nEstimated ${getRevenueLabel()}: $${calculateRevenue()}`)
    window.open(`sms:?&body=${message}`)
    setShowShareModal(false)
  }

  // Calculate estimated revenue based on mode
  const calculateRevenue = () => {
    switch(selectedMode) {
      case 'airbnb': {
        const daysBooked = 365 * (occupancyRate / 100)
        const baseRevenue = daysBooked * avgDailyRate
        const cleaningRevenue = (daysBooked / 3) * cleaningFee // Assume average 3-night stays
        const totalRevenue = baseRevenue + cleaningRevenue
        const platformFees = totalRevenue * (platformFeePercent / 100)
        const totalExpenses = airbnbMaintenanceExpense + airbnbInsurance + airbnbPropertyTax + platformFees
        return (totalRevenue - totalExpenses).toFixed(0)
      }
      case 'renters': {
        const annualRent = monthlyRent * 12
        const effectiveRent = annualRent * ((100 - vacancyRate) / 100)
        const managementFee = effectiveRent * (propertyManagementFee / 100)
        const totalExpenses = maintenanceExpense + rentalInsurance + rentalPropertyTax + managementFee
        return (effectiveRent - totalExpenses).toFixed(0)
      }
      case 'mortgage': {
        // Calculate base monthly mortgage payment
        const monthlyPayment = (propertyPrice * (1 - downPayment/100) * (interestRate/1200)) / (1 - Math.pow(1 + interestRate/1200, -360))
        
        // Calculate monthly property tax
        const monthlyPropertyTax = propertyTax / 12
        
        // Calculate monthly insurance
        const monthlyInsurance = insurance / 12
        
        // Calculate PMI if down payment is less than 20%
        const monthlyPMI = downPayment < 20 ? 
          ((propertyPrice * (1 - downPayment/100)) * (pmi / 100)) / 12 : 0

        // Return total monthly payment
        return (monthlyPayment + monthlyPropertyTax + monthlyInsurance + monthlyPMI).toFixed(0)
      }
      case 'wholesale': {
        const totalHoldingCosts = holdingCosts * holdingPeriod
        const sellerClosingCostsAmount = propertyPrice * (sellerClosingCosts / 100)
        const buyerClosingCostsAmount = arv * (buyerClosingCosts / 100)
        const totalCosts = repairCosts + totalHoldingCosts + sellerClosingCostsAmount + 
          buyerClosingCostsAmount + marketingCosts + wholesaleFee
        return (arv - propertyPrice - totalCosts).toFixed(0)
      }
      default:
        return '0'
    }
  }

  const renderCalculatorInputs = () => {
    switch(selectedMode) {
      case 'airbnb':
        return (
          <>
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Occupancy Rate ({occupancyRate}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={occupancyRate}
                onChange={(e) => setOccupancyRate(parseInt(e.target.value))}
                className="w-full appearance-none bg-[#2ecc71]/20 h-2 rounded-full
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2ecc71]
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(46,204,113,0.5)]"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Average Daily Rate (${avgDailyRate})</label>
              <input
                type="range"
                min={Math.max(30, Math.round(propertyPrice * 0.0002))}
                max={Math.max(200, Math.round(propertyPrice * 0.001))}
                step={5}
                value={avgDailyRate}
                onChange={(e) => setAvgDailyRate(parseInt(e.target.value))}
                className="w-full appearance-none bg-[#2ecc71]/20 h-2 rounded-full
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2ecc71]
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(46,204,113,0.5)]"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Cleaning Fee per Stay (${cleaningFee})</label>
              <input
                type="range"
                min={Math.max(50, Math.round(propertyPrice * 0.0005))}
                max={Math.max(150, Math.round(propertyPrice * 0.002))}
                step={5}
                value={cleaningFee}
                onChange={(e) => setCleaningFee(parseInt(e.target.value))}
                className="w-full appearance-none bg-[#2ecc71]/20 h-2 rounded-full
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2ecc71]
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(46,204,113,0.5)]"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Platform Fee ({platformFeePercent}%)</label>
              <input
                type="range"
                min="0"
                max="20"
                step="0.5"
                value={platformFeePercent}
                onChange={(e) => setPlatformFeePercent(parseFloat(e.target.value))}
                className="w-full appearance-none bg-[#2ecc71]/20 h-2 rounded-full
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2ecc71]
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(46,204,113,0.5)]"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Annual Maintenance & Repairs (${airbnbMaintenanceExpense.toLocaleString()})</label>
              <input
                type="range"
                min="0"
                max={Math.max(15000, propertyPrice * 0.03)}
                step="100"
                value={airbnbMaintenanceExpense}
                onChange={(e) => setAirbnbMaintenanceExpense(parseInt(e.target.value))}
                className="w-full appearance-none bg-[#2ecc71]/20 h-2 rounded-full
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2ecc71]
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(46,204,113,0.5)]"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Annual Insurance (${airbnbInsurance.toLocaleString()})</label>
              <input
                type="range"
                min="0"
                max={Math.max(25000, propertyPrice * 0.02)}
                step="100"
                value={airbnbInsurance}
                onChange={(e) => setAirbnbInsurance(parseInt(e.target.value))}
                className="w-full appearance-none bg-[#2ecc71]/20 h-2 rounded-full
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2ecc71]
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(46,204,113,0.5)]"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Annual Property Tax (${airbnbPropertyTax.toLocaleString()})</label>
              <input
                type="range"
                min="0"
                max={Math.max(50000, propertyPrice * 0.05)}
                step="500"
                value={airbnbPropertyTax}
                onChange={(e) => setAirbnbPropertyTax(parseInt(e.target.value))}
                className="w-full appearance-none bg-[#2ecc71]/20 h-2 rounded-full
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2ecc71]
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(46,204,113,0.5)]"
              />
            </div>
          </>
        )
      case 'mortgage':
        return (
          <>
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Down Payment ({downPayment}%)</label>
              <input
                type="range"
                min="3"
                max="100"
                value={downPayment}
                onChange={(e) => setDownPayment(parseInt(e.target.value))}
                className="w-full appearance-none bg-[#2ecc71]/20 h-2 rounded-full
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2ecc71]
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(46,204,113,0.5)]"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Interest Rate ({interestRate}%)</label>
              <input
                type="range"
                min="1"
                max="15"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                className="w-full appearance-none bg-[#2ecc71]/20 h-2 rounded-full
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2ecc71]
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(46,204,113,0.5)]"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Annual Property Tax (${propertyTax.toLocaleString()})</label>
              <input
                type="range"
                min="0"
                max={Math.max(50000, propertyPrice * 0.05)}
                step="500"
                value={propertyTax}
                onChange={(e) => setPropertyTax(parseInt(e.target.value))}
                className="w-full appearance-none bg-[#2ecc71]/20 h-2 rounded-full
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2ecc71]
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(46,204,113,0.5)]"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Annual Insurance (${insurance.toLocaleString()})</label>
              <input
                type="range"
                min="0"
                max={Math.max(25000, propertyPrice * 0.02)}
                step="100"
                value={insurance}
                onChange={(e) => setInsurance(parseInt(e.target.value))}
                className="w-full appearance-none bg-[#2ecc71]/20 h-2 rounded-full
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2ecc71]
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(46,204,113,0.5)]"
              />
            </div>
            {downPayment < 20 && (
              <div className="mb-6">
                <label className="block text-gray-400 mb-2">PMI Rate ({pmi}%/year)</label>
                <input
                  type="range"
                  min="0.3"
                  max="2"
                  step="0.1"
                  value={pmi}
                  onChange={(e) => setPmi(parseFloat(e.target.value))}
                  className="w-full appearance-none bg-[#2ecc71]/20 h-2 rounded-full
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2ecc71]
                    [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(46,204,113,0.5)]"
                />
              </div>
            )}
          </>
        )
      case 'renters':
        return (
          <>
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Monthly Rent (${monthlyRent})</label>
              <input
                type="range"
                min="500"
                max="10000"
                step="100"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(parseInt(e.target.value))}
                className="w-full appearance-none bg-[#2ecc71]/20 h-2 rounded-full
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2ecc71]
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(46,204,113,0.5)]"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Vacancy Rate ({vacancyRate}%)</label>
              <input
                type="range"
                min="0"
                max="20"
                value={vacancyRate}
                onChange={(e) => setVacancyRate(parseInt(e.target.value))}
                className="w-full appearance-none bg-[#2ecc71]/20 h-2 rounded-full
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2ecc71]
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(46,204,113,0.5)]"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Property Management Fee ({propertyManagementFee}%)</label>
              <input
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={propertyManagementFee}
                onChange={(e) => setPropertyManagementFee(parseFloat(e.target.value))}
                className="w-full appearance-none bg-[#2ecc71]/20 h-2 rounded-full
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2ecc71]
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(46,204,113,0.5)]"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Annual Maintenance & Repairs (${maintenanceExpense.toLocaleString()})</label>
              <input
                type="range"
                min="0"
                max={Math.max(10000, propertyPrice * 0.02)}
                step="100"
                value={maintenanceExpense}
                onChange={(e) => setMaintenanceExpense(parseInt(e.target.value))}
                className="w-full appearance-none bg-[#2ecc71]/20 h-2 rounded-full
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2ecc71]
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(46,204,113,0.5)]"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Annual Insurance (${rentalInsurance.toLocaleString()})</label>
              <input
                type="range"
                min="0"
                max={Math.max(25000, propertyPrice * 0.02)}
                step="100"
                value={rentalInsurance}
                onChange={(e) => setRentalInsurance(parseInt(e.target.value))}
                className="w-full appearance-none bg-[#2ecc71]/20 h-2 rounded-full
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2ecc71]
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(46,204,113,0.5)]"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Annual Property Tax (${rentalPropertyTax.toLocaleString()})</label>
              <input
                type="range"
                min="0"
                max={Math.max(50000, propertyPrice * 0.05)}
                step="500"
                value={rentalPropertyTax}
                onChange={(e) => setRentalPropertyTax(parseInt(e.target.value))}
                className="w-full appearance-none bg-[#2ecc71]/20 h-2 rounded-full
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2ecc71]
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(46,204,113,0.5)]"
              />
            </div>
          </>
        )
      case 'wholesale':
        return (
          <>
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Repair Costs (${repairCosts.toLocaleString()})</label>
              <input
                type="range"
                min="0"
                max="200000"
                step="1000"
                value={repairCosts}
                onChange={(e) => setRepairCosts(parseInt(e.target.value))}
                className="w-full appearance-none bg-[#2ecc71]/20 h-2 rounded-full
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2ecc71]
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(46,204,113,0.5)]"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">After Repair Value (${arv.toLocaleString()})</label>
              <input
                type="range"
                min={propertyPrice}
                max={Math.min(propertyPrice * 2, propertyPrice * 1.5)}
                step={1000}
                value={arv}
                onChange={(e) => setArv(parseInt(e.target.value))}
                className="w-full appearance-none bg-[#2ecc71]/20 h-2 rounded-full
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2ecc71]
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(46,204,113,0.5)]"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Monthly Holding Costs (${holdingCosts.toLocaleString()})</label>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={holdingCosts}
                onChange={(e) => setHoldingCosts(parseInt(e.target.value))}
                className="w-full appearance-none bg-[#2ecc71]/20 h-2 rounded-full
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2ecc71]
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(46,204,113,0.5)]"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Holding Period ({holdingPeriod} months)</label>
              <input
                type="range"
                min="1"
                max="12"
                value={holdingPeriod}
                onChange={(e) => setHoldingPeriod(parseInt(e.target.value))}
                className="w-full appearance-none bg-[#2ecc71]/20 h-2 rounded-full
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2ecc71]
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(46,204,113,0.5)]"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Seller Closing Costs ({sellerClosingCosts}% of Purchase)</label>
              <input
                type="range"
                min="0"
                max="6"
                step="0.5"
                value={sellerClosingCosts}
                onChange={(e) => setSellerClosingCosts(parseFloat(e.target.value))}
                className="w-full appearance-none bg-[#2ecc71]/20 h-2 rounded-full
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2ecc71]
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(46,204,113,0.5)]"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Buyer Closing Costs ({buyerClosingCosts}% of ARV)</label>
              <input
                type="range"
                min="0"
                max="6"
                step="0.5"
                value={buyerClosingCosts}
                onChange={(e) => setBuyerClosingCosts(parseFloat(e.target.value))}
                className="w-full appearance-none bg-[#2ecc71]/20 h-2 rounded-full
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2ecc71]
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(46,204,113,0.5)]"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Marketing Costs (${marketingCosts.toLocaleString()})</label>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={marketingCosts}
                onChange={(e) => setMarketingCosts(parseInt(e.target.value))}
                className="w-full appearance-none bg-[#2ecc71]/20 h-2 rounded-full
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2ecc71]
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(46,204,113,0.5)]"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Wholesale Fee (${wholesaleFee.toLocaleString()})</label>
              <input
                type="range"
                min="5000"
                max="50000"
                step="1000"
                value={wholesaleFee}
                onChange={(e) => setWholesaleFee(parseInt(e.target.value))}
                className="w-full appearance-none bg-[#2ecc71]/20 h-2 rounded-full
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2ecc71]
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(46,204,113,0.5)]"
              />
            </div>
          </>
        )
    }
  }

  const getRevenueLabel = () => {
    switch(selectedMode) {
      case 'airbnb':
        return 'Estimated Annual Revenue'
      case 'renters':
        return 'Annual Rental Income'
      case 'mortgage':
        return 'Monthly Mortgage Payment'
      case 'wholesale':
        return 'Potential Profit'
      default:
        return 'Estimated Value'
    }
  }

  const handleSaveAnalysis = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyAddress: address || 'Unknown Address',
          analysis: {
            propertyPrice,
            revenue: calculateRevenue(),
            // Add any other analysis data you want to save
          },
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Analysis saved successfully!');
        router.push('/dashboard');
      } else {
        if (response.status === 401) {
          // If unauthorized, redirect to login
          router.push('/login');
        } else {
          throw new Error(data.error || 'Failed to save analysis');
        }
      }
    } catch (error) {
      console.error('Error saving analysis:', error);
      toast.error('Failed to save analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <div className="flex flex-col items-center px-4 pt-20 pb-16">
          <h1 className="text-4xl md:text-6xl font-mono font-bold mb-6 text-center text-[#2ecc71] [text-shadow:_0_0_30px_rgba(46,204,113,0.3)]">
            AI-powered Real Estate Strategy Starts Here
          </h1>
          <p className="text-lg font-mono text-gray-400 text-center mb-12">
            Analyze LTR, STR, and Wholesale deals instantly with Smart Import.
          </p>

          {/* Mode Tabs */}
          <div className="flex justify-center gap-2 mb-8">
            <button
              onClick={() => setSelectedMode('mortgage')}
              className={`px-6 py-2 font-mono text-base transition-all duration-300
                ${selectedMode === 'mortgage'
                  ? 'bg-[#2ecc71] text-black'
                  : 'border border-[#2ecc71] text-[#2ecc71]'
                }`}
            >
              Mortgage
            </button>
            <button
              onClick={() => setSelectedMode('renters')}
              className={`px-6 py-2 font-mono text-base transition-all duration-300
                ${selectedMode === 'renters'
                  ? 'bg-[#2ecc71] text-black'
                  : 'border border-[#2ecc71] text-[#2ecc71]'
                }`}
            >
              Renters
            </button>
            <button
              onClick={() => setSelectedMode('airbnb')}
              className={`px-6 py-2 font-mono text-base transition-all duration-300
                ${selectedMode === 'airbnb'
                  ? 'bg-[#2ecc71] text-black'
                  : 'border border-[#2ecc71] text-[#2ecc71]'
                }`}
            >
              Airbnb
            </button>
            <button
              onClick={() => setSelectedMode('wholesale')}
              className={`px-6 py-2 font-mono text-base transition-all duration-300
                ${selectedMode === 'wholesale'
                  ? 'bg-[#2ecc71] text-black'
                  : 'border border-[#2ecc71] text-[#2ecc71]'
                }`}
            >
              Wholesale
            </button>
          </div>

          {/* Smart Import Form */}
          <form onSubmit={handleSmartImport} className="w-full max-w-2xl flex gap-2 mb-16">
            <input
              type="text"
              name="url"
              placeholder="Add a property link to analyze (e.g., https://www.redfin.com/...)"
              className="flex-1 px-4 py-3 bg-[#111111] font-mono text-white placeholder-gray-500
                focus:outline-none focus:ring-1 focus:ring-[#2ecc71]"
              disabled={isImporting}
            />
            <button
              type="submit"
              disabled={isImporting}
              className="px-4 py-3 bg-[#2ecc71] text-black font-mono font-bold
                hover:bg-[#27ae60] transition-colors flex items-center gap-2"
            >
              {isImporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Importing...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Smart Import
                </>
              )}
            </button>
          </form>

          {/* Preview Box */}
          {showPreview ? (
            <div className="w-full max-w-4xl bg-[#111111] border border-[#2ecc71]/20 rounded-lg p-6 mb-12
              shadow-[0_0_30px_rgba(46,204,113,0.1)]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#2ecc71] mb-2 flex items-center gap-2">
                    <MapPin size={24} />
                    {address ? address : "Property Analysis"}
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
                  onClick={handleClear}
                  className="text-gray-400 hover:text-[#2ecc71] transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="mb-6">
                    <label className="block text-gray-400 mb-2">Purchase Price</label>
                    <input
                      type="text"
                      value={`$${propertyPrice.toLocaleString()}`}
                      onChange={(e) => {
                        const value = parseInt(e.target.value.replace(/\D/g, ''))
                        if (!isNaN(value)) setPropertyPrice(value)
                      }}
                      className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2ecc71]/20 rounded text-white
                        focus:outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71]"
                    />
                  </div>

                  {renderCalculatorInputs()}
                </div>

                <div>
                  <div className="bg-[#0a0a0a] rounded-lg p-4 mb-6">
                    <div className="text-center">
                      <div className="text-[#2ecc71] text-3xl font-bold mb-2">
                        ${parseInt(calculateRevenue()).toLocaleString()}
                      </div>
                      <div className="text-gray-400">{getRevenueLabel()}</div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg overflow-hidden h-64 bg-gray-100">
                    {isMapLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    ) : mapError ? (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        {mapError}
                      </div>
                    ) : !address ? (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        Submit a Smart Import to view property location
                      </div>
                    ) : mapUrl ? (
                      <iframe
                        src={mapUrl}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No map available
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={handleEditClick}
                      className="flex items-center gap-2 px-4 py-2 border border-[#2ecc71]/20 rounded
                        text-gray-400 hover:text-[#2ecc71] hover:border-[#2ecc71] transition-all duration-300"
                    >
                      <Edit2 size={20} /> Edit
                    </button>
                    <button 
                      onClick={handlePrint}
                      className="flex items-center gap-2 px-4 py-2 border border-[#2ecc71]/20 rounded
                        text-gray-400 hover:text-[#2ecc71] hover:border-[#2ecc71] transition-all duration-300"
                    >
                      <Printer size={20} /> Print
                    </button>
                    <button 
                      onClick={handleShare}
                      className="flex items-center gap-2 px-4 py-2 border border-[#2ecc71]/20 rounded
                        text-gray-400 hover:text-[#2ecc71] hover:border-[#2ecc71] transition-all duration-300"
                    >
                      <Share2 size={20} /> Share
                    </button>
                    <button
                      onClick={handleSaveAnalysis}
                      disabled={isLoading}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#2ecc71] text-black font-bold rounded
                        hover:bg-[#27ae60] transition-all duration-300 hover:shadow-[0_0_20px_rgba(46,204,113,0.4)]
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FileText size={20} />
                      {isLoading ? 'Saving...' : 'Save Analysis'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-4xl bg-[#111111] border border-[#2ecc71]/20 rounded-lg p-6 mb-12
              shadow-[0_0_30px_rgba(46,204,113,0.1)] flex flex-col items-center justify-center text-gray-400">
              <Search size={48} className="mb-4 text-[#2ecc71]" />
              <p className="text-lg mb-2">Add a property link to start your analysis</p>
              <p className="text-sm">Paste a link from Redfin, Zillow, or Realtor.com to automatically import property details</p>
            </div>
          )}

          {/* Share Modal */}
          {showShareModal && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-[#111111] border border-[#2ecc71]/20 rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-xl font-bold text-[#2ecc71] mb-4">Share Property Analysis</h3>
                <div className="flex flex-col gap-4">
                  <button
                    onClick={handleEmailShare}
                    className="flex items-center gap-2 px-4 py-3 border border-[#2ecc71]/20 rounded
                      text-gray-400 hover:text-[#2ecc71] hover:border-[#2ecc71] transition-all duration-300"
                  >
                    <Mail size={20} /> Share via Email
                  </button>
                  <button
                    onClick={handleTextShare}
                    className="flex items-center gap-2 px-4 py-3 border border-[#2ecc71]/20 rounded
                      text-gray-400 hover:text-[#2ecc71] hover:border-[#2ecc71] transition-all duration-300"
                  >
                    <MessageSquare size={20} /> Share via Text
                  </button>
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="px-4 py-3 bg-[#2ecc71] text-black font-bold rounded
                      hover:bg-[#27ae60] transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Features Grid */}
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
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
            ].map((feature, index) => (
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
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .w-full.max-w-4xl, .w-full.max-w-4xl * {
            visibility: visible;
          }
          .w-full.max-w-4xl {
            position: absolute;
            left: 0;
            top: 0;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </PageLayout>
  )
}