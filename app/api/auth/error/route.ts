import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const error = searchParams.get('error') || 'Unknown authentication error';
  
  // Log the error for debugging
  console.error('Auth error:', error);
  
  // Return a JSON response with the error
  return NextResponse.json({ 
    error: true,
    message: error,
    timestamp: new Date().toISOString()
  }, { 
    status: 400 
  });
} 