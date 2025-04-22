import { NextResponse } from 'next/server'

// This would normally be in an environment variable
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY

export async function POST(request: Request) {
  try {
    const { address } = await request.json()
    
    // Geocode the address to get coordinates
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
    const response = await fetch(geocodeUrl)
    const data = await response.json()
    
    if (data.status === 'OK' && data.results[0]) {
      const { lat, lng } = data.results[0].geometry.location
      
      // Generate a static map URL
      const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=600x400&maptype=roadmap&markers=color:red%7C${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
      
      return NextResponse.json({
        coordinates: { lat, lng },
        staticMapUrl,
        // Include place_id for potential Street View usage later
        placeId: data.results[0].place_id
      })
    }
    
    return NextResponse.json({ error: 'Could not geocode address' }, { status: 400 })
  } catch (error) {
    console.error('Maps API error:', error)
    return NextResponse.json({ error: 'Failed to process map request' }, { status: 500 })
  }
} 