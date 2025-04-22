import { NextResponse } from 'next/server'

// Types for AirDNA API responses
interface AirDNAPropertyData {
  address: string
  zipcode: string
  marketData: {
    averageDailyRate: number
    averageOccupancyRate: number
    averageCleaningFee: number
    averageLengthOfStay: number
    totalListings: number
    revenuePerAvailableNight: number
    revenuePerAvailableProperty: number
  }
  seasonalData: Array<{
    month: string
    averageDailyRate: number
    occupancyRate: number
    revenue: number
  }>
  comparableProperties: Array<{
    address: string
    averageDailyRate: number
    occupancyRate: number
    revenue: number
    bedrooms: number
    bathrooms: number
    squareFeet: number
  }>
}

// Mock data for development
const MOCK_AIRDNA_DATA: Record<string, AirDNAPropertyData> = {
  '14214': {
    address: "Buffalo, NY 14214",
    zipcode: "14214",
    marketData: {
      averageDailyRate: 175,
      averageOccupancyRate: 65,
      averageCleaningFee: 125,
      averageLengthOfStay: 2.5,
      totalListings: 45,
      revenuePerAvailableNight: 113.75,
      revenuePerAvailableProperty: 4151.88
    },
    seasonalData: [
      { month: "January", averageDailyRate: 150, occupancyRate: 45, revenue: 2025 },
      { month: "February", averageDailyRate: 155, occupancyRate: 50, revenue: 2325 },
      { month: "March", averageDailyRate: 160, occupancyRate: 55, revenue: 2640 },
      { month: "April", averageDailyRate: 165, occupancyRate: 60, revenue: 2970 },
      { month: "May", averageDailyRate: 170, occupancyRate: 65, revenue: 3315 },
      { month: "June", averageDailyRate: 180, occupancyRate: 75, revenue: 4050 },
      { month: "July", averageDailyRate: 190, occupancyRate: 80, revenue: 4560 },
      { month: "August", averageDailyRate: 185, occupancyRate: 75, revenue: 4162.5 },
      { month: "September", averageDailyRate: 175, occupancyRate: 70, revenue: 3675 },
      { month: "October", averageDailyRate: 165, occupancyRate: 65, revenue: 3217.5 },
      { month: "November", averageDailyRate: 160, occupancyRate: 60, revenue: 2880 },
      { month: "December", averageDailyRate: 155, occupancyRate: 55, revenue: 2557.5 }
    ],
    comparableProperties: [
      {
        address: "45 Montrose Ave, Buffalo, NY 14214",
        averageDailyRate: 170,
        occupancyRate: 62,
        revenue: 3124,
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 2200
      },
      {
        address: "28 Montrose Ave, Buffalo, NY 14214",
        averageDailyRate: 175,
        occupancyRate: 65,
        revenue: 3325,
        bedrooms: 4,
        bathrooms: 2,
        squareFeet: 2300
      },
      {
        address: "52 Montrose Ave, Buffalo, NY 14214",
        averageDailyRate: 180,
        occupancyRate: 68,
        revenue: 3672,
        bedrooms: 4,
        bathrooms: 2.5,
        squareFeet: 2500
      }
    ]
  },
  'default': {
    address: "Unknown Location",
    zipcode: "00000",
    marketData: {
      averageDailyRate: 200,
      averageOccupancyRate: 70,
      averageCleaningFee: 150,
      averageLengthOfStay: 3,
      totalListings: 50,
      revenuePerAvailableNight: 140,
      revenuePerAvailableProperty: 4200
    },
    seasonalData: [
      { month: "January", averageDailyRate: 180, occupancyRate: 50, revenue: 2700 },
      { month: "February", averageDailyRate: 185, occupancyRate: 55, revenue: 3052.5 },
      { month: "March", averageDailyRate: 190, occupancyRate: 60, revenue: 3420 },
      { month: "April", averageDailyRate: 195, occupancyRate: 65, revenue: 3802.5 },
      { month: "May", averageDailyRate: 200, occupancyRate: 70, revenue: 4200 },
      { month: "June", averageDailyRate: 210, occupancyRate: 80, revenue: 5040 },
      { month: "July", averageDailyRate: 220, occupancyRate: 85, revenue: 5610 },
      { month: "August", averageDailyRate: 215, occupancyRate: 80, revenue: 5160 },
      { month: "September", averageDailyRate: 205, occupancyRate: 75, revenue: 4612.5 },
      { month: "October", averageDailyRate: 195, occupancyRate: 70, revenue: 4095 },
      { month: "November", averageDailyRate: 190, occupancyRate: 65, revenue: 3705 },
      { month: "December", averageDailyRate: 185, occupancyRate: 60, revenue: 3330 }
    ],
    comparableProperties: [
      {
        address: "123 Main St, Anytown, USA 00000",
        averageDailyRate: 195,
        occupancyRate: 68,
        revenue: 3978,
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 2200
      },
      {
        address: "456 Oak Ave, Anytown, USA 00000",
        averageDailyRate: 200,
        occupancyRate: 70,
        revenue: 4200,
        bedrooms: 4,
        bathrooms: 2,
        squareFeet: 2400
      },
      {
        address: "789 Pine St, Anytown, USA 00000",
        averageDailyRate: 205,
        occupancyRate: 72,
        revenue: 4428,
        bedrooms: 4,
        bathrooms: 2.5,
        squareFeet: 2600
      }
    ]
  }
}

// Function to fetch AirDNA data
async function fetchAirDNAData(zipcode: string): Promise<AirDNAPropertyData> {
  // In production, this would make an actual API call to AirDNA
  // const apiKey = process.env.AIRDNA_API_KEY
  // const response = await fetch(`https://api.airdna.co/v1/market-data?zipcode=${zipcode}`, {
  //   headers: {
  //     'Authorization': `Bearer ${apiKey}`,
  //     'Content-Type': 'application/json'
  //   }
  // })
  // const data = await response.json()
  // return data

  // For now, return mock data
  console.log(`[AirDNA] Fetching data for zipcode ${zipcode}`)
  return MOCK_AIRDNA_DATA[zipcode] || MOCK_AIRDNA_DATA['default']
}

export async function POST(request: Request) {
  try {
    const { zipcode } = await request.json()

    if (!zipcode) {
      return NextResponse.json({ 
        error: 'Missing required parameter: zipcode' 
      }, { status: 400 })
    }

    const airDNAData = await fetchAirDNAData(zipcode)

    return NextResponse.json({
      success: true,
      data: airDNAData
    })
  } catch (error) {
    console.error('AirDNA API error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch data from AirDNA',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 