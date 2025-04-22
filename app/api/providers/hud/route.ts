import { NextResponse } from 'next/server'

// Types for HUD API responses
interface HUDFairMarketRent {
  zipcode: string
  year: number
  efficiency: number
  oneBedroom: number
  twoBedroom: number
  threeBedroom: number
  fourBedroom: number
  smallAreaRent: {
    efficiency: number
    oneBedroom: number
    twoBedroom: number
    threeBedroom: number
    fourBedroom: number
  }
}

// Mock data for development
const MOCK_HUD_DATA: Record<string, HUDFairMarketRent> = {
  '14214': {
    zipcode: '14214',
    year: 2023,
    efficiency: 800,
    oneBedroom: 900,
    twoBedroom: 1100,
    threeBedroom: 1400,
    fourBedroom: 1600,
    smallAreaRent: {
      efficiency: 850,
      oneBedroom: 950,
      twoBedroom: 1150,
      threeBedroom: 1450,
      fourBedroom: 1650
    }
  },
  'default': {
    zipcode: '00000',
    year: 2023,
    efficiency: 1000,
    oneBedroom: 1100,
    twoBedroom: 1300,
    threeBedroom: 1600,
    fourBedroom: 1800,
    smallAreaRent: {
      efficiency: 1050,
      oneBedroom: 1150,
      twoBedroom: 1350,
      threeBedroom: 1650,
      fourBedroom: 1850
    }
  }
}

// Function to fetch Fair Market Rent data from HUD API
async function fetchHUDFMRData(zipcode: string): Promise<HUDFairMarketRent> {
  // In production, this would make an actual API call to HUD
  // const response = await fetch(`https://www.huduser.gov/hudapi/public/fmr/zip/${zipcode}`, {
  //   headers: {
  //     'Authorization': `Bearer ${process.env.HUD_API_KEY}`,
  //     'Content-Type': 'application/json'
  //   }
  // })
  // const data = await response.json()
  // return data

  // For now, return mock data
  console.log(`[HUD] Fetching Fair Market Rent data for zipcode ${zipcode}`)
  return MOCK_HUD_DATA[zipcode] || MOCK_HUD_DATA['default']
}

export async function POST(request: Request) {
  try {
    const { zipcode } = await request.json()

    if (!zipcode) {
      return NextResponse.json({ 
        error: 'Missing required parameter: zipcode' 
      }, { status: 400 })
    }

    const fmrData = await fetchHUDFMRData(zipcode)

    return NextResponse.json({
      success: true,
      data: fmrData
    })
  } catch (error) {
    console.error('HUD API error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch Fair Market Rent data from HUD',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 