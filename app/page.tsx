"use client"

import { useState, useEffect, useCallback } from 'react'
import { Search, MapPin, Camera, Edit2, Printer, Share2, X, Star, Calculator, FileText, Mail, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import PageLayout from './components/PageLayout'
import { toast } from 'react-hot-toast'
import { ErrorBoundary } from './components/ErrorBoundary'
import HomePage from './components/HomePage'

// Force dynamic rendering to prevent static generation
export const dynamic = 'force-dynamic'

const formatAddress = (parts: string[]): string => {
  // Remove any empty strings and clean up the parts
  const cleanParts = parts.filter(part => part && part !== 'home' && !part.match(/^\d+$/))
  
  // Process each part to ensure proper capitalization and formatting
  const formattedParts = cleanParts.map(part => {
    // Split by both hyphens and underscores
    return part
      .split(/[-_]/)
      .map(word => {
        // Handle state abbreviations
        if (word.length === 2 && word.toUpperCase() === word) {
          return word.toUpperCase()
        }
        // Handle zip codes
        if (word.match(/^\d{5}$/)) {
          return word
        }
        // Handle street numbers
        if (word.match(/^\d+$/)) {
          return word
        }
        // Capitalize other words
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      })
      .join(' ')
  })

  // Join all parts with spaces
  return formattedParts.join(' ')
}

const extractAddressFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url)
    
    // Handle Redfin URLs
    if (urlObj.hostname.includes('redfin.com')) {
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
      return `${formattedAddress} ${city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()} ${state.toUpperCase()} ${zipCode}`
    }
    
    // Handle Zillow URLs
    if (urlObj.hostname.includes('zillow.com')) {
      const parts = urlObj.pathname.split('/')
      const addressPart = parts.find(part => part.includes('-'))
      if (addressPart) {
        // Format Zillow address to match the desired format
        const addressComponents = addressPart.split('-')
        const zipCode = addressComponents.find(part => part.match(/^\d{5}$/)) || ''
        const state = addressComponents.find(part => part.length === 2 && part.toUpperCase() === part) || ''
        const city = addressComponents[addressComponents.length - 2] || ''
        
        // Remove zip code, state, and city from the address components
        const streetAddress = addressComponents
          .filter(part => part !== zipCode && part !== state && part !== city)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
        
        // Return in the format "Street Address City STATE ZIPCODE"
        return `${streetAddress} ${city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()} ${state.toUpperCase()} ${zipCode}`
      }
    }
    
    // Handle Realtor.com URLs
    if (urlObj.hostname.includes('realtor.com')) {
      const parts = urlObj.pathname.split('/')
      const addressPart = parts.find(part => part.includes('_'))
      if (addressPart) {
        // Format Realtor.com address to match the desired format
        const addressComponents = addressPart.split('_')
        const zipCode = addressComponents.find(part => part.match(/^\d{5}$/)) || ''
        const state = addressComponents.find(part => part.length === 2 && part.toUpperCase() === part) || ''
        const city = addressComponents[addressComponents.length - 2] || ''
        
        // Remove zip code, state, and city from the address components
        const streetAddress = addressComponents
          .filter(part => part !== zipCode && part !== state && part !== city)
          .map(word => {
            return word
              .split('-')
              .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
              .join(' ')
          })
          .join(' ')
        
        // Return in the format "Street Address City STATE ZIPCODE"
        return `${streetAddress} ${city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()} ${state.toUpperCase()} ${zipCode}`
      }
    }
    
    // If no pattern matches, return the original URL
    return url
  } catch (error) {
    // If URL parsing fails, return the original input
    return url
  }
}

// Helper function to format any address string to the standard format
const formatAddressToStandard = (address: string): string => {
  // If it's already a URL, extract the address first
  if (address.startsWith('http')) {
    address = extractAddressFromUrl(address)
  }
  
  // Split the address into parts
  const parts = address.split(/\s+/).filter(part => part.length > 0)
  
  // Find the zip code (5 digits)
  const zipCodeIndex = parts.findIndex(part => /^\d{5}$/.test(part))
  const zipCode = zipCodeIndex !== -1 ? parts[zipCodeIndex] : ''
  
  // Find the state (2 letter abbreviation)
  const stateIndex = parts.findIndex((part, index) => {
    const upperPart = part.toUpperCase()
    // Check if this is "ST" meaning "Street"
    if (upperPart === 'ST') {
      // Look at previous part to see if it's a number (indicating street address)
      const prevPart = parts[index - 1]
      if (prevPart && /^\d+$/.test(prevPart)) {
        return false // This "ST" is part of street address
      }
    }
    // Otherwise check if it's a valid state abbreviation
    return /^[A-Z]{2}$/.test(upperPart)
  })
  const state = stateIndex !== -1 ? parts[stateIndex].toUpperCase() : ''
  
  // Find the city (usually before the state)
  const cityIndex = stateIndex !== -1 ? stateIndex - 1 : -1
  const city = cityIndex !== -1 ? parts[cityIndex] : ''
  
  // Get all parts before the city as the street address
  const streetParts = parts.slice(0, cityIndex !== -1 ? cityIndex : parts.length)
    .filter(part => part !== zipCode)
  
  // Format street address
  const formattedStreetAddress = streetParts
    .map(word => {
      // Handle street numbers
      if (/^\d+$/.test(word)) {
        return word
      }
      // Handle 'ST' abbreviation for Street
      if (word.toUpperCase() === 'ST') {
        return 'Street'
      }
      // Capitalize other words
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
  
  const formattedCity = city
    ? city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()
    : ''
  
  // Return in the format "Street Address City STATE ZIPCODE"
  return `${formattedStreetAddress} ${formattedCity} ${state} ${zipCode}`.trim()
}

export default function Page() {
  return (
    <ErrorBoundary>
      <HomePage />
    </ErrorBoundary>
  )
}