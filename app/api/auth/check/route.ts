import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const authToken = cookieStore.get('auth_token');
  
  return NextResponse.json({
    authenticated: !!authToken
  });
} 