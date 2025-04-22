import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../[...nextauth]/options'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    // Redirect to dashboard on successful authentication
    return NextResponse.redirect(new URL('/dashboard', request.url))
  } catch (error) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(
      new URL(`/auth/error?error=${encodeURIComponent('Authentication failed')}`, request.url)
    )
  }
} 