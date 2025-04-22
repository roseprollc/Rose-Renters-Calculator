import { NextResponse } from 'next/server'
import puppeteer, { Browser } from 'puppeteer'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'

interface PropertyData {
  price: number
  address: string
  beds?: number
  baths?: number
  sqft?: number
}

// Helper function to extract zipcode from address
const extractZipcode = (address: string): string => {
  const match = address.match(/\b\d{5}\b/)
  return match ? match[0] : ''
}

// Helper function to extract number from string
const extractNumber = (str: string): number => {
  if (!str) return 0;
  // First try to extract a complete price with commas and decimals
  const priceMatch = str.match(/\$?([0-9,]+(?:\.\d+)?)/);
  if (priceMatch) {
    // Remove commas and convert to number
    return parseFloat(priceMatch[1].replace(/,/g, ''));
  }
  // Fallback to simple number extraction
  const match = str.match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 0;
}

// Helper function to validate property data
const validatePropertyData = (data: PropertyData): boolean => {
  return !!(data.price && data.address)
}

// Helper function to fetch average rates for a zipcode
async function fetchZipcodeAverages(zipcode: string) {
  try {
    // This would ideally call a real API service that provides this data
    // For now, we'll use some reasonable estimates based on property value
    // In a production environment, you'd want to use services like AirDNA or PriceLabs
    return {
      avgDailyRate: null, // Will be calculated based on property value
      avgCleaningFee: null, // Will be calculated based on property value
      avgOccupancyRate: 65, // Industry average
    }
  } catch (error) {
    console.error('Error fetching zipcode averages:', error)
    return null
  }
}

// Helper function to try multiple selectors with type safety
const trySelectors = (selectors: string[]): string | null => {
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element?.textContent) {
      return element.textContent.trim();
    }
  }
  return null;
}

// Helper function to extract numeric value from string
const extractNumericValue = (str: string): number => {
  const match = str.match(/\d+(\.\d+)?/)
  return match ? parseFloat(match[0]) : 0
}

// Helper function to clean price string
const cleanPriceString = (str: string): number => {
  if (!str) return 0;
  // Remove all non-numeric characters except decimal points and commas
  const cleaned = str.replace(/[^\d,.]/g, '');
  // Remove commas and convert to number
  return parseFloat(cleaned.replace(/,/g, ''));
}

// Improved browser setup with better error handling and resource management
async function setupBrowser(retries = 3): Promise<Browser> {
  let lastError: Error | null = null;
  let browser: Browser | null = null;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Browser setup attempt ${attempt} of ${retries}`);
      browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--window-size=1920,1080',
        ],
        ignoreHTTPSErrors: true,
        timeout: 30000
      });

      // Test the browser connection
      const testPage = await browser.newPage();
      await testPage.close();
      
      return browser;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error during browser setup');
      console.error(`Browser setup attempt ${attempt} failed:`, lastError);
      
      // Clean up browser if it was created
      if (browser) {
        try {
          await browser.close();
        } catch (e) {
          console.error('Error closing browser:', e);
        }
      }
      
      // If this is the last attempt, throw the error
      if (attempt === retries) {
        throw lastError;
      }
      
      // Wait before retrying with exponential backoff
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
      console.log(`Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

export async function POST(request: Request) {
  let browser: Browser | null = null;
  
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Check if URL is from a supported site
    if (!url.includes('redfin.com') && !url.includes('realtor.com')) {
      return NextResponse.json({ 
        error: 'Unsupported website. Please use Redfin or Realtor.com links.',
        unsupported: true 
      }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (e) {
      return NextResponse.json({ 
        error: 'Invalid URL format',
        details: 'Please provide a valid URL'
      }, { status: 400 });
    }

    // Initialize browser
    browser = await setupBrowser();

    // Return mock data for testing with proper error handling
    const mockData = {
      price: 500000,
      address: "123 Main St, Anytown, CA 90210",
      beds: 3,
      baths: 2,
      sqft: 2000,
      avgDailyRate: 250,
      avgCleaningFee: 150,
      avgOccupancyRate: 65
    };

    return NextResponse.json(mockData);

  } catch (error) {
    console.error('Error in scrape route:', error);
    return NextResponse.json({ 
      error: 'An error occurred while processing the request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    // Ensure browser is always closed
    if (browser) {
      try {
        await browser.close();
      } catch (e) {
        console.error('Error closing browser:', e);
      }
    }
  }
} 