import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get('error') || 'Authentication failed';
  
  // Log the error for debugging
  console.error('Auth error:', error);
  
  // Return a JSON response with the error
  return NextResponse.json({ error }, { status: 400 });
} 