import { NextResponse } from 'next/server'

// Mock Stripe implementation
const mockStripe = {
  checkout: {
    sessions: {
      create: async (params: any) => {
        // Return a mock session URL
        return {
          url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002'}/success?session_id=mock_session_123`
        }
      }
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { plan, priceId } = body

    // Use mock implementation instead of real Stripe
    const session = await mockStripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002'}/ai-upgrade`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    )
  }
} 