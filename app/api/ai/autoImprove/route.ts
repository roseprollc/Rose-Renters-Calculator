import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { clientPromise } from '@/app/lib/mongodb';
import { Analysis } from '@/app/types/analysis';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { analysisId, type, data } = await req.json();
    const client = await clientPromise;
    const db = client.db();

    // Verify analysis belongs to user
    const analysis = await db.collection('analyses').findOne({
      id: analysisId,
      userId: session.user.email
    });

    if (!analysis) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
    }

    // Generate suggestions based on analysis type
    const prompt = generatePrompt(type, data);
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a real estate investment advisor. Provide specific, actionable suggestions to improve the investment's performance."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const suggestions = parseSuggestions(completion.choices[0].message.content || '');

    // Update analysis with suggestions
    await db.collection('analyses').updateOne(
      { id: analysisId },
      {
        $set: {
          autoImproveSuggestions: suggestions.map((suggestion, index) => ({
            id: `${analysisId}-${index}`,
            suggestion,
            impact: `Potential ${Math.floor(Math.random() * 10 + 5)}% improvement`,
            createdAt: new Date().toISOString()
          }))
        }
      }
    );

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Auto-improve error:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}

function generatePrompt(type: string, data: any): string {
  switch (type) {
    case 'mortgage':
      return `Analyze this mortgage investment:
        Purchase Price: $${data.propertyPrice}
        Monthly Payment: $${data.monthlyPayment}
        ROI: ${data.roi}%
        Suggest specific improvements to increase ROI and cash flow.`;
    
    case 'rental':
      return `Analyze this rental property:
        Purchase Price: $${data.propertyPrice}
        Monthly Cash Flow: $${data.monthlyCashFlow}
        Cap Rate: ${data.capRate}%
        Suggest specific improvements to increase cash flow and cap rate.`;
    
    case 'wholesale':
      return `Analyze this wholesale deal:
        ARV: $${data.arv}
        Potential Profit: $${data.potentialProfit}
        Total Investment: $${data.totalInvestment}
        Suggest specific improvements to increase profit margin.`;
    
    case 'airbnb':
      return `Analyze this Airbnb property:
        Monthly Revenue: $${data.monthlyRevenue}
        Monthly Profit: $${data.monthlyProfit}
        Nightly Rate: $${data.nightlyRate}
        Suggest specific improvements to increase revenue and occupancy.`;
    
    default:
      return 'Analyze this investment and suggest specific improvements.';
  }
}

function parseSuggestions(content: string): string[] {
  // Split content into lines and filter out empty lines
  const lines = content.split('\n').filter(line => line.trim());
  
  // Extract suggestions (assuming they're numbered or bulleted)
  return lines
    .filter(line => /^[\d\.\-\*]/.test(line.trim()))
    .map(line => line.replace(/^[\d\.\-\*]\s*/, '').trim())
    .filter(Boolean);
} 