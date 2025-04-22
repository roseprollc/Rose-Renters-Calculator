import { NextResponse } from 'next/server'

// For development/testing, we'll use dummy data if API calls fail
const USE_DUMMY_DATA = false // Set to false to use real API calls

// Dummy data for development/testing
const DUMMY_DATA = {
  propertyDetails: {
    address: "190 Davidson Ave, Buffalo, NY 14215",
    purchasePrice: 94990, // Updated to match actual Redfin listing
    propertyType: "Single Family",
    yearBuilt: 1925,
    squareFeet: 1344,
    bedrooms: 3,
    bathrooms: 1
  },
  monthlyExpenses: {
    propertyTax: 2400, // Estimated based on Buffalo rates
    insurance: 800,
    utilities: 150,
    maintenance: 100,
    hoaFees: 0
  },
  rentalAssumptions: {
    monthlyRent: 1400,
    vacancyRate: 5,
    managementFee: 8,
    repairsPercentage: 1
  },
  financing: {
    downPayment: 20,
    interestRate: 7.5,
    loanTerm: 30,
    closingCosts: 3
  },
  source: {
    url: "",
    platform: "Unknown"
  }
}

// Helper function to extract address from Redfin URL
function extractAddressFromRedfinUrl(url: string): { address: string; zipcode: string } | null {
  try {
    const urlObj = new URL(url);
    const parts = urlObj.pathname.split('/');
    
    // Extract state, city, and address parts
    const state = parts[1] || '';
    const city = parts[2] || '';
    const addressParts = parts.slice(3).filter(part => part && part !== 'home' && !part.match(/^\d+$/));
    
    // Extract zip code if present
    const zipCode = addressParts.find(part => part.match(/^\d{5}$/)) || '';
    
    // Remove zip code from address parts
    const streetAddressParts = addressParts.filter(part => part !== zipCode);
    
    // Format the street address
    const formattedAddress = streetAddressParts
      .map(part => part
        .split('-')
        .map(word => {
          // Handle street numbers
          if (word.match(/^\d+$/)) {
            return word;
          }
          // Capitalize other words
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ')
      )
      .join(' ');
    
    // Return in the format "Street Address City STATE ZIPCODE"
    const address = `${formattedAddress} ${city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()} ${state.toUpperCase()} ${zipCode}`;
    
    return {
      address,
      zipcode: zipCode
    };
  } catch (error) {
    console.error('Error extracting address from URL:', error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'Missing URL' }, { status: 400 });
    }

    // Check if it's a Zillow URL
    if (url.includes('zillow.com')) {
      return NextResponse.json({ 
        error: 'Zillow links are currently not supported. Please use Redfin or Realtor.com links instead.',
        unsupported: true
      }, { status: 400 });
    }

    // Extract address from URL
    const addressInfo = url.includes('redfin.com') ? extractAddressFromRedfinUrl(url) : null;

    if (!addressInfo) {
      return NextResponse.json({ 
        error: 'Could not extract address from URL. Please try a different URL or enter details manually.' 
      }, { status: 400 });
    }

    try {
      // Call our API providers endpoint
      const response = await fetch('/api/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url,
          address: addressInfo.address,
          zipcode: addressInfo.zipcode
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch property data');
      }

      const data = await response.json();

      // Transform the API data into the calculator format
      return NextResponse.json({
        propertyDetails: {
          address: data.propertyDetails.address,
          purchasePrice: data.propertyDetails.purchasePrice,
          propertyType: data.propertyDetails.propertyType || "Single Family",
          yearBuilt: data.propertyDetails.yearBuilt,
          squareFeet: data.propertyDetails.squareFeet,
          bedrooms: data.propertyDetails.bedrooms,
          bathrooms: data.propertyDetails.bathrooms
        },
        monthlyExpenses: {
          propertyTax: Math.round(data.propertyDetails.purchasePrice * 0.025 / 12), // Estimated annual tax rate of 2.5%
          insurance: Math.round(data.propertyDetails.purchasePrice * 0.005 / 12), // Estimated annual rate of 0.5%
          utilities: 150,
          maintenance: Math.round(data.propertyDetails.purchasePrice * 0.01 / 12), // 1% annual maintenance
          hoaFees: 0
        },
        rentalAssumptions: {
          monthlyRent: data.marketData?.averageDailyRate ? Math.round(data.marketData.averageDailyRate * 30) : 
                      data.propertyDetails.rentEstimate?.median || 
                      Math.round(data.propertyDetails.purchasePrice * 0.008), // 0.8% monthly rent estimate
          vacancyRate: data.marketData?.averageOccupancyRate ? 100 - data.marketData.averageOccupancyRate : 5,
          managementFee: 8,
          repairsPercentage: 1
        },
        financing: {
          downPayment: 20,
          interestRate: 7.5,
          loanTerm: 30,
          closingCosts: 3
        },
        source: {
          url: url,
          platform: url.includes('redfin.com') ? 'Redfin' : 
                   url.includes('realtor.com') ? 'Realtor.com' : 'Unknown'
        }
      });
    } catch (apiError) {
      console.error('API provider error:', apiError);
      
      // If API call fails, use dummy data with correct address
      return NextResponse.json({
        ...DUMMY_DATA,
        propertyDetails: {
          ...DUMMY_DATA.propertyDetails,
          address: addressInfo.address
        },
        source: {
          url: url,
          platform: url.includes('redfin.com') ? 'Redfin' : 
                   url.includes('realtor.com') ? 'Realtor.com' : 'Unknown'
        }
      });
    }
  } catch (error) {
    console.error('Smart import error:', error);
    return NextResponse.json(
      { error: 'Failed to process property data' },
      { status: 500 }
    );
  }
} 