import { NextResponse } from 'next/server'

// Types for Census API responses
interface CensusData {
  zipcode: string
  population: number
  medianAge: number
  medianHouseholdIncome: number
  medianPropertyValue: number
  housingUnits: number
  ownerOccupied: number
  renterOccupied: number
  vacant: number
  demographics: {
    white: number
    black: number
    hispanic: number
    asian: number
    other: number
  }
  education: {
    highSchool: number
    bachelors: number
    graduate: number
  }
  employment: {
    laborForce: number
    employed: number
    unemployed: number
    unemploymentRate: number
  }
}

// Mock data for development
const MOCK_CENSUS_DATA: Record<string, CensusData> = {
  '14214': {
    zipcode: '14214',
    population: 12500,
    medianAge: 35.2,
    medianHouseholdIncome: 65000,
    medianPropertyValue: 225000,
    housingUnits: 5200,
    ownerOccupied: 3100,
    renterOccupied: 1800,
    vacant: 300,
    demographics: {
      white: 65,
      black: 20,
      hispanic: 8,
      asian: 5,
      other: 2
    },
    education: {
      highSchool: 85,
      bachelors: 35,
      graduate: 15
    },
    employment: {
      laborForce: 7500,
      employed: 7000,
      unemployed: 500,
      unemploymentRate: 6.7
    }
  },
  'default': {
    zipcode: '00000',
    population: 15000,
    medianAge: 38.5,
    medianHouseholdIncome: 75000,
    medianPropertyValue: 275000,
    housingUnits: 6000,
    ownerOccupied: 3600,
    renterOccupied: 2100,
    vacant: 300,
    demographics: {
      white: 70,
      black: 15,
      hispanic: 10,
      asian: 3,
      other: 2
    },
    education: {
      highSchool: 90,
      bachelors: 40,
      graduate: 18
    },
    employment: {
      laborForce: 9000,
      employed: 8500,
      unemployed: 500,
      unemploymentRate: 5.6
    }
  }
}

// Function to fetch Census data
async function fetchCensusData(zipcode: string): Promise<CensusData> {
  // In production, this would make an actual API call to the Census API
  // const apiKey = process.env.CENSUS_API_KEY
  // const response = await fetch(`https://api.census.gov/data/2020/dec/pl?get=NAME,P1_001N,P1_003N&for=zip%20code%20tabulation%20area:${zipcode}&key=${apiKey}`)
  // const data = await response.json()
  // return data

  // For now, return mock data
  console.log(`[Census] Fetching data for zipcode ${zipcode}`)
  return MOCK_CENSUS_DATA[zipcode] || MOCK_CENSUS_DATA['default']
}

export async function POST(request: Request) {
  try {
    const { zipcode } = await request.json()

    if (!zipcode) {
      return NextResponse.json({ 
        error: 'Missing required parameter: zipcode' 
      }, { status: 400 })
    }

    const censusData = await fetchCensusData(zipcode)

    return NextResponse.json({
      success: true,
      data: censusData
    })
  } catch (error) {
    console.error('Census API error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch data from Census API',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 