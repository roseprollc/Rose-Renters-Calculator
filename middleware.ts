import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'
import { hasFeatureAccess } from './app/lib/tiers'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                    request.nextUrl.pathname.startsWith('/signup')

  // Redirect authenticated users away from auth pages
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Protect dashboard and API routes
  if (!token && (
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/api/')
  )) {
    const callbackUrl = encodeURIComponent(request.nextUrl.pathname)
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, request.url))
  }

  // Add cache control headers for static assets
  if (request.nextUrl.pathname.startsWith('/_next/static/')) {
    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    return response
  }

  // Add security headers
  const response = NextResponse.next()
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // Add tier-based feature access if token exists
  if (token?.subscriptionTier) {
    const tier = token.subscriptionTier as 'free' | 'pro' | 'elite'
    const path = request.nextUrl.pathname

    // Check feature access based on path
    if (path.startsWith('/api/gpt') && !hasFeatureAccess(tier, 'gptInsights')) {
      return NextResponse.json(
        { error: 'Upgrade required for GPT insights' },
        { status: 403 }
      )
    }

    if (path.startsWith('/api/market') && !hasFeatureAccess(tier, 'marketReports')) {
      return NextResponse.json(
        { error: 'Upgrade required for market reports' },
        { status: 403 }
      )
    }

    if (path.startsWith('/api/analysis') && !hasFeatureAccess(tier, 'dealAnalysis')) {
      return NextResponse.json(
        { error: 'Upgrade required for deal analysis' },
        { status: 403 }
      )
    }
  }

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
    '/login',
    '/signup',
    '/_next/static/:path*',
  ],
}