import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { getNextTier, getTierPrice, UserTier } from '@/app/lib/tiers'
import { prisma } from '@/app/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { targetTier } = await request.json()
    if (!targetTier || !['pro', 'elite'].includes(targetTier)) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }

    const currentTier = session.user.subscriptionTier as UserTier
    const nextTier = getNextTier(currentTier)

    if (!nextTier || nextTier !== targetTier) {
      return NextResponse.json({ error: 'Invalid upgrade path' }, { status: 400 })
    }

    // TODO: Integrate with payment processor (Stripe, etc.)
    const price = getTierPrice(targetTier)

    // Update user tier in database
    await prisma.user.update({
      where: { email: session.user.email },
      data: { subscriptionTier: targetTier },
    })

    return NextResponse.json({
      success: true,
      newTier: targetTier,
      price
    })
  } catch (error) {
    console.error('Tier upgrade error:', error)
    return NextResponse.json(
      { error: 'Failed to process upgrade' },
      { status: 500 }
    )
  }
} 