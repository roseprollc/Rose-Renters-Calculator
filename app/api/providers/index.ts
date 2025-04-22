import { NextResponse } from 'next/server'

// Helper function to extract zipcode from address
const extractZipcode = (address: string): string => {
  const match = address.match(/\b\d{5}\b/)
  return match ? match[0] : ''
}

// Helper function to extract address parts from URL
const extractAddressFromUrl = (url: string): { address: string, zipcode: string } | null => {
  try {
    // Handle Redfin URLs
    if (url.includes('redfin.com')) {
      const urlObj = new URL(url)
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
      const address = `${formattedAddress} ${city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()} ${state.toUpperCase()} ${zipCode}`
      
      return {
        address,
        zipcode: zipCode || '14214' // Default to Buffalo if no zipcode found
      }
    }
    
    return null
  } catch (error) {
    console.error('Error extracting address from URL:', error)
    return null
  }
}

export async function POST(request: Request) {
  try {
    const { url, address, zipcode } = await request.json()
    
    // If we have a URL but no address/zipcode, try to extract from URL
    let propertyAddress = address
    let propertyZipcode = zipcode
    
    if (url && !propertyAddress) {
      const extractedAddress = extractAddressFromUrl(url)
      if (extractedAddress) {
        propertyAddress = extractedAddress.address
        propertyZipcode = extractedAddress.zipcode
      }
    }
    
    // If we still don't have a zipcode but have an address, try to extract it
    if (propertyAddress && !propertyZipcode) {
      propertyZipcode = extractZipcode(propertyAddress)
    }
    
    // If we still don't have required data, return an error
    if (!propertyAddress || !propertyZipcode) {
      return NextResponse.json({ 
        error: 'Could not determine property address or zipcode. Please provide these details manually.',
        requiresManualInput: true
      }, { status: 400 })
    }
    
    // Fetch data from all providers in parallel
    const [rentcastData, hudData, airDNAData, censusData] = await Promise.all([
      fetch('/api/providers/rentcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: propertyAddress, zipcode: propertyZipcode })
      }).then(res => res.json()).catch(err => ({ error: 'Failed to fetch RentCast data' })),
      
      fetch('/api/providers/hud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zipcode: propertyZipcode })
      }).then(res => res.json()).catch(err => ({ error: 'Failed to fetch HUD data' })),
      
      fetch('/api/providers/airdna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zipcode: propertyZipcode })
      }).then(res => res.json()).catch(err => ({ error: 'Failed to fetch AirDNA data' })),
      
      fetch('/api/providers/census', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zipcode: propertyZipcode })
      }).then(res => res.json()).catch(err => ({ error: 'Failed to fetch Census data' }))
    ])
    
    // Combine all data into a single response
    return NextResponse.json({
      success: true,
      propertyDetails: {
        address: propertyAddress,
        zipcode: propertyZipcode,
        ...(rentcastData.success ? rentcastData.data : {})
      },
      marketData: {
        ...(airDNAData.success ? airDNAData.data.marketData : {}),
        ...(hudData.success ? hudData.data : {})
      },
      demographics: censusData.success ? censusData.data : {},
      source: {
        url: url || null,
        platform: url ? (
          url.includes('redfin.com') ? 'Redfin' : 
          url.includes('zillow.com') ? 'Zillow' : 
          url.includes('realtor.com') ? 'Realtor.com' : 'Unknown'
        ) : 'Manual Input'
      }
    })
  } catch (error) {
    console.error('Property data provider error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch property data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 