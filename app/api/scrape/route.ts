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
          '--disable-features=IsolateOrigins,site-per-process',
          '--disable-extensions',
          '--disable-default-apps',
          '--disable-popup-blocking',
          '--disable-notifications',
          '--disable-background-networking',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-breakpad',
          '--disable-component-extensions-with-background-pages',
          '--disable-features=TranslateUI,BlinkGenPropertyTrees',
          '--disable-ipc-flooding-protection',
          '--disable-renderer-backgrounding',
          '--enable-features=NetworkService,NetworkServiceInProcess',
          '--metrics-recording-only',
          '--no-first-run',
          '--password-store=basic',
          '--use-mock-keychain',
          '--force-device-scale-factor=1',
          '--hide-scrollbars',
          '--mute-audio'
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

    // Validate URL format
    try {
      new URL(url);
    } catch (e) {
      return NextResponse.json({ 
        error: 'Invalid URL format',
        details: 'Please provide a valid URL'
      }, { status: 400 });
    }

    try {
      browser = await setupBrowser();
      page = await browser.newPage();

      // Set a longer timeout for navigation
      await page.setDefaultNavigationTimeout(30000);

      // Set viewport
      await page.setViewport({ width: 1920, height: 1080 });

      // Block unnecessary resources
      await page.setRequestInterception(true);
      page.on('request', (request) => {
        const resourceType = request.resourceType();
        if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
          request.abort();
        } else {
          request.continue();
        }
      });

      // Navigate to the URL with retry logic
      let navigationSuccess = false;
      let navigationError: Error | null = null;
      
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          await page.goto(url, { 
            waitUntil: 'networkidle0',
            timeout: 30000
          });
          navigationSuccess = true;
          break;
        } catch (error) {
          navigationError = error instanceof Error ? error : new Error('Unknown navigation error');
          console.error(`Navigation attempt ${attempt} failed:`, navigationError);
          if (attempt < 3) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }
        }
      }

      if (!navigationSuccess) {
        throw new Error(`Failed to navigate to URL after 3 attempts: ${navigationError?.message}`);
      }

      // Extract property data based on the website
      let propertyData: PropertyData = {
        price: 0,
        address: '',
      };

      if (url.includes('redfin.com')) {
        // Redfin selectors with fallbacks
        const selectors = {
          price: ['.statsValue', '.price', '[data-testid="price"]'],
          address: ['.homeAddressV3', '.address', '[data-testid="address"]'],
          beds: ['.beds', '[data-testid="beds"]'],
          baths: ['.baths', '[data-testid="baths"]'],
          sqft: ['.sqFt', '[data-testid="sqft"]']
        };

        for (const [key, selectorList] of Object.entries(selectors)) {
          for (const selector of selectorList) {
            try {
              const element = await page.$(selector);
              if (element) {
                const text = await element.evaluate(el => el.textContent || '');
                if (text) {
                  if (key === 'price') {
                    propertyData.price = cleanPriceString(text);
                  } else if (key === 'address') {
                    propertyData.address = text.trim();
                  } else if (key === 'beds') {
                    propertyData.beds = extractNumericValue(text);
                  } else if (key === 'baths') {
                    propertyData.baths = extractNumericValue(text);
                  } else if (key === 'sqft') {
                    propertyData.sqft = extractNumericValue(text);
                  }
                  break;
                }
              }
            } catch (error) {
              console.error(`Error extracting ${key}:`, error);
            }
          }
        }
      } else if (url.includes('realtor.com')) {
        // Realtor.com selectors with fallbacks
        const selectors = {
          price: ['[data-testid="price"]', '.price'],
          address: ['[data-testid="address"]', '.address'],
          beds: ['[data-testid="property-meta-beds"]', '.beds'],
          baths: ['[data-testid="property-meta-baths"]', '.baths'],
          sqft: ['[data-testid="property-meta-sqft"]', '.sqft']
        };

        for (const [key, selectorList] of Object.entries(selectors)) {
          for (const selector of selectorList) {
            try {
              const element = await page.$(selector);
              if (element) {
                const text = await element.evaluate(el => el.textContent || '');
                if (text) {
                  if (key === 'price') {
                    propertyData.price = cleanPriceString(text);
                  } else if (key === 'address') {
                    propertyData.address = text.trim();
                  } else if (key === 'beds') {
                    propertyData.beds = extractNumericValue(text);
                  } else if (key === 'baths') {
                    propertyData.baths = extractNumericValue(text);
                  } else if (key === 'sqft') {
                    propertyData.sqft = extractNumericValue(text);
                  }
                  break;
                }
              }
            } catch (error) {
              console.error(`Error extracting ${key}:`, error);
            }
          }
        }
      }

      // Validate the extracted data
      if (!validatePropertyData(propertyData)) {
        throw new Error('Failed to extract required property data. Please try again or enter the information manually.');
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
  } catch (error) {
    console.error('Request error:', error);
    return NextResponse.json({ 
      error: 'Invalid request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
} 