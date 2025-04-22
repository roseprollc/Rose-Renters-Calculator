export function extractAddressFromUrl(url: string): string | null {
  try {
    // Handle Redfin URLs
    if (url.includes('redfin.com')) {
      // Extract the address part from the URL
      const urlParts = url.split('/')
      const addressIndex = urlParts.findIndex(part => part === 'home')
      if (addressIndex !== -1 && urlParts[addressIndex + 1]) {
        // The address is typically in the format "123-Main-St-City-State"
        const addressPart = urlParts[addressIndex + 1]
        // Convert dashes to spaces and remove any trailing numbers
        return addressPart
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
          .replace(/\s+\d+$/, '') // Remove trailing numbers
      }
    }
    return null
  } catch (error) {
    console.error('Error extracting address from URL:', error)
    return null
  }
} 