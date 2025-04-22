import { NextResponse } from 'next/server'
import puppeteer, { Browser, Page } from 'puppeteer'

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

// Improved browser setup with better error handling
async function setupBrowser(retries = 3): Promise<Browser> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Browser setup attempt ${attempt} of ${retries}`);
      const browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--window-size=1920,1080',
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process'
        ],
        ignoreHTTPSErrors: true,
        timeout: 30000
      });
      return browser;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error during browser setup');
      console.error(`Browser setup attempt ${attempt} failed:`, lastError);
      if (attempt === retries) {
        throw lastError;
      }
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  throw lastError;
}

export async function POST(request: Request) {
  let browser: Browser | null = null;
  let page: Page | null = null;

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

    browser = await setupBrowser();
    page = await browser.newPage();

    // Set a longer timeout for navigation
    await page.setDefaultNavigationTimeout(30000);

    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });

    // Enable request interception to block unnecessary resources
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const resourceType = request.resourceType();
      if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
        request.abort();
      } else {
        request.continue();
      }
    });

    // Navigate to the URL
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Extract property data based on the website
    let propertyData: PropertyData = {
      price: 0,
      address: '',
    };

    if (url.includes('redfin.com')) {
      // Redfin selectors
      const priceSelector = '.statsValue';
      const addressSelector = '.homeAddressV3';
      const bedsSelector = '.beds';
      const bathsSelector = '.baths';
      const sqftSelector = '.sqFt';

      propertyData = {
        price: cleanPriceString(await page.$eval(priceSelector, el => el.textContent || '')),
        address: await page.$eval(addressSelector, el => el.textContent || ''),
        beds: extractNumericValue(await page.$eval(bedsSelector, el => el.textContent || '')),
        baths: extractNumericValue(await page.$eval(bathsSelector, el => el.textContent || '')),
        sqft: extractNumericValue(await page.$eval(sqftSelector, el => el.textContent || ''))
      };
    } else if (url.includes('realtor.com')) {
      // Realtor.com selectors
      const priceSelector = '[data-testid="price"]';
      const addressSelector = '[data-testid="address"]';
      const bedsSelector = '[data-testid="property-meta-beds"]';
      const bathsSelector = '[data-testid="property-meta-baths"]';
      const sqftSelector = '[data-testid="property-meta-sqft"]';

      propertyData = {
        price: cleanPriceString(await page.$eval(priceSelector, el => el.textContent || '')),
        address: await page.$eval(addressSelector, el => el.textContent || ''),
        beds: extractNumericValue(await page.$eval(bedsSelector, el => el.textContent || '')),
        baths: extractNumericValue(await page.$eval(bathsSelector, el => el.textContent || '')),
        sqft: extractNumericValue(await page.$eval(sqftSelector, el => el.textContent || ''))
      };
    }

    // Validate the extracted data
    if (!validatePropertyData(propertyData)) {
      throw new Error('Failed to extract required property data');
    }

    // Get zipcode averages
    const zipcode = extractZipcode(propertyData.address);
    const averages = zipcode ? await fetchZipcodeAverages(zipcode) : null;

    return NextResponse.json({
      ...propertyData,
      averages
    });

  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to scrape property data',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  } finally {
    if (page) {
      try {
        await page.close();
      } catch (error) {
        console.error('Error closing page:', error);
      }
    }
    if (browser) {
      try {
        await browser.close();
      } catch (error) {
        console.error('Error closing browser:', error);
      }
    }
  }
} 