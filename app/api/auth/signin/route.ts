import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../[...nextauth]/options'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.redirect(new URL('/auth/signin', request.url))
} 