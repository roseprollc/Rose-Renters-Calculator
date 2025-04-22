import { NextResponse } from "next/server"
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { generateInsights } from '@/app/lib/openai'
import { useUserTier } from '@/app/contextLayer/userContext'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user tier to check if they have access to AI features
    const userTier = session.user.subscriptionTier || 'free'
    
    // Check if user has access to AI features
    if (userTier === 'free') {
      return NextResponse.json(
        { error: 'AI insights are only available for Pro and Elite users' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { analysisId, address, type, metrics, notes } = body

    if (!analysisId || !address || !type || !metrics) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate insights using OpenAI
    const insights = await generateInsights({
      type,
      address,
      metrics,
      notes
    })

    // Return the generated insights
    return NextResponse.json({ insights })
  } catch (error) {
    console.error('Error generating AI insights:', error)
    return NextResponse.json(
      { error: 'Failed to generate AI insights' },
      { status: 500 }
    )
  }
}
