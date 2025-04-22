import { NextResponse } from 'next/server'

// Types for RentCast API responses
interface RentCastPropertyData {
  address: string
  purchasePrice: number
  propertyType: string
  yearBuilt?: number
  squareFeet?: number
  bedrooms?: number
  bathrooms?: number
  lotSize?: number
  lastSaleDate?: string
  lastSalePrice?: number
  zestimate?: number
  rentEstimate?: {
    low: number
    high: number
    median: number
  }
  comps?: Array<{
    address: string
    price: number
    beds: number
    baths: number
    sqft: number
    distance: number
  }>
}

// Mock data for development
const MOCK_RENTCAST_DATA: Record<string, RentCastPropertyData> = {
  'default': {
    address: "33 Montrose Ave, Buffalo, NY 14214",
    purchasePrice: 400000,
    propertyType: "Single Family",
    yearBuilt: 1925,
    squareFeet: 2400,
    bedrooms: 4,
    bathrooms: 2,
    lotSize: 6000,
    lastSaleDate: "2015-06-15",
    lastSalePrice: 320000,
    zestimate: 425000,
    rentEstimate: {
      low: 2200,
      high: 2800,
      median: 2500
    },
    comps: [
      {
        address: "45 Montrose Ave, Buffalo, NY 14214",
        price: 385000,
        beds: 3,
        baths: 2,
        sqft: 2200,
        distance: 0.2
      },
      {
        address: "28 Montrose Ave, Buffalo, NY 14214",
        price: 395000,
        beds: 4,
        baths: 2,
        sqft: 2300,
        distance: 0.3
      },
      {
        address: "52 Montrose Ave, Buffalo, NY 14214",
        price: 410000,
        beds: 4,
        baths: 2.5,
        sqft: 2500,
        distance: 0.4
      }
    ]
  }
}

// Function to fetch property data from RentCast API
async function fetchRentCastData(address: string, zipcode: string): Promise<RentCastPropertyData> {
  // In production, this would make an actual API call to RentCast
  // const apiKey = process.env.RENTCAST_API_KEY
  // const response = await fetch(`https://api.rentcast.io/v1/properties?address=${encodeURIComponent(address)}&zipcode=${zipcode}`, {
  //   headers: {
  //     'Authorization': `Bearer ${apiKey}`,
  //     'Content-Type': 'application/json'
  //   }
  // })
  // const data = await response.json()
  // return data

  // For now, return mock data
  console.log(`[RentCast] Fetching data for ${address}, ${zipcode}`)
  return MOCK_RENTCAST_DATA['default']
}

export async function POST(request: Request) {
  try {
    const { address, zipcode } = await request.json()

    if (!address || !zipcode) {
      return NextResponse.json({ 
        error: 'Missing required parameters: address and zipcode' 
      }, { status: 400 })
    }

    const propertyData = await fetchRentCastData(address, zipcode)

    return NextResponse.json({
      success: true,
      data: propertyData
    })
  } catch (error) {
    console.error('RentCast API error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch property data from RentCast',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 