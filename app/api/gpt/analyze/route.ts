import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'

// Helper to generate prompts based on calculator type and tier
function generatePrompt(calculatorType: string, formData: any, tier: string) {
  const basePrompt = `Analyze this ${calculatorType} investment opportunity:\n`
  
  // Add property details
  const details = `
Property Details:
- Purchase Price: $${formData.propertyPrice || 'N/A'}
- Location: ${formData.propertyData?.address || 'N/A'}
- Bedrooms: ${formData.propertyData?.bedrooms || 'N/A'}
- Bathrooms: ${formData.propertyData?.bathrooms || 'N/A'}
- Square Feet: ${formData.propertyData?.squareFeet || 'N/A'}
- Year Built: ${formData.propertyData?.yearBuilt || 'N/A'}
- Property Type: ${formData.propertyData?.propertyType || 'N/A'}
- Lot Size: ${formData.propertyData?.lotSize || 'N/A'}

Financial Details:
- Down Payment: $${formData.downPayment || 'N/A'} (${formData.downPaymentPercent || 'N/A'}%)
- Interest Rate: ${formData.interestRate || 'N/A'}%
- Loan Term: ${formData.loanTerm || 'N/A'} years
- Monthly Payment: $${formData.monthlyPayment || 'N/A'}
`

  // Add calculator-specific details
  let specificDetails = ''
  if (calculatorType === 'airbnb') {
    specificDetails = `
Airbnb Specifics:
- Average Daily Rate: $${formData.nightlyRate || 'N/A'}
- Occupancy Rate: ${formData.occupancyRate || 'N/A'}%
- Cleaning Fee: $${formData.cleaningFee || 'N/A'}
- Maintenance Costs: $${formData.maintenanceCosts || 'N/A'}/month
- Utilities: $${formData.utilities || 'N/A'}/month
- Platform Fee: ${formData.platformFee || 'N/A'}%

Performance Metrics:
- Monthly Revenue: $${formData.analytics?.monthlyRevenue || 'N/A'}
- Net Operating Income: $${formData.analytics?.noi || 'N/A'}
- Cash on Cash Return: ${formData.analytics?.cashOnCashReturn || 'N/A'}%
- Cap Rate: ${formData.analytics?.capRate || 'N/A'}%
- ROI: ${formData.analytics?.roi || 'N/A'}%
- Break-even Occupancy: ${formData.analytics?.breakEvenOccupancy || 'N/A'}%
- RevPAR: $${formData.analytics?.revpar || 'N/A'}
- ADR: $${formData.analytics?.adr || 'N/A'}
`
  } else if (calculatorType === 'rental') {
    specificDetails = `
Rental Specifics:
- Monthly Rent: $${formData.monthlyRent || 'N/A'}
- Vacancy Rate: ${formData.vacancyRate || 'N/A'}%
- Property Management: $${formData.propertyManagement || 'N/A'}/month
- HOA Fees: $${formData.hoaFees || 'N/A'}/month
- Maintenance: $${formData.maintenance || 'N/A'}/month
- Utilities: $${formData.utilities || 'N/A'}/month
- Property Taxes: $${formData.propertyTaxes || 'N/A'}/year
- Insurance: $${formData.insurance || 'N/A'}/year

Performance Metrics:
- Monthly Cash Flow: $${formData.analytics?.monthlyCashFlow || 'N/A'}
- Annual Cash Flow: $${formData.analytics?.annualCashFlow || 'N/A'}
- Cap Rate: ${formData.analytics?.capRate || 'N/A'}%
- Cash on Cash Return: ${formData.analytics?.cashOnCashReturn || 'N/A'}%
- Break-even Rent: $${formData.analytics?.breakEvenRent || 'N/A'}
- Gross Rent Multiplier: ${formData.analytics?.grossRentMultiplier || 'N/A'}
- Debt Coverage Ratio: ${formData.analytics?.debtCoverageRatio || 'N/A'}
- Operating Expense Ratio: ${formData.analytics?.operatingExpenseRatio || 'N/A'}%
`
  } else if (calculatorType === 'wholesale') {
    specificDetails = `
Wholesale Specifics:
- ARV: $${formData.arv || 'N/A'}
- Repair Costs: $${formData.repairCosts || 'N/A'}
- Offer Price: $${formData.offerPrice || 'N/A'}
- Closing Costs: $${formData.closingCosts || 'N/A'}
- Holding Costs: $${formData.holdingCosts || 'N/A'}
- Wholesale Fee: $${formData.wholesaleFee || 'N/A'}

Performance Metrics:
- Potential Profit: $${formData.analytics?.potentialProfit || 'N/A'}
- Max Allowable Offer: $${formData.analytics?.maxAllowableOffer || 'N/A'}
- Equity After Repair: $${formData.analytics?.equityAfterRepair || 'N/A'}
- ROI: ${formData.analytics?.roi || 'N/A'}%
- ARV to Offer Ratio: ${formData.analytics?.arvToOfferRatio || 'N/A'}%
- Risk Level: ${formData.analytics?.riskLevel || 'N/A'}
- Profit Margin: ${formData.analytics?.profitMargin || 'N/A'}%
- Repair Ratio: ${formData.analytics?.repairRatio || 'N/A'}%
- Total Investment Required: $${formData.analytics?.totalInvestmentRequired || 'N/A'}
- Net Profit: $${formData.analytics?.netProfit || 'N/A'}
- Cash on Cash: ${formData.analytics?.cashOnCash || 'N/A'}%
- Buyer Potential Profit: $${formData.analytics?.buyerPotentialProfit || 'N/A'}
- Buyer ROI: ${formData.analytics?.buyerROI || 'N/A'}%
- Wholesale Spread: ${formData.analytics?.wholesaleSpread || 'N/A'}%
- Assignment Fee Ratio: ${formData.analytics?.assignmentFeeRatio || 'N/A'}%
`
  } else if (calculatorType === 'mortgage') {
    specificDetails = `
Mortgage Specifics:
- Loan Amount: $${formData.analytics?.loanSummary?.totalLoanAmount || 'N/A'}
- Total Interest: $${formData.analytics?.loanSummary?.totalInterest || 'N/A'}
- Total Payments: $${formData.analytics?.loanSummary?.totalPayments || 'N/A'}
- Monthly Payment: $${formData.analytics?.monthlyPayment || 'N/A'}
- PMI Amount: $${formData.pmiAmount || 'N/A'}/month

Payment Breakdown:
- Principal: $${formData.analytics?.paymentBreakdown?.principal || 'N/A'}
- Interest: $${formData.analytics?.paymentBreakdown?.interest || 'N/A'}
- Property Tax: $${formData.analytics?.paymentBreakdown?.propertyTax || 'N/A'}
- Insurance: $${formData.analytics?.paymentBreakdown?.insurance || 'N/A'}
- PMI: $${formData.analytics?.paymentBreakdown?.pmi || 'N/A'}

Risk Analysis:
- DTI Ratio: ${formData.analytics?.riskAnalysis?.debtToIncomeRatio || 'N/A'}%
- LTV Ratio: ${formData.analytics?.riskAnalysis?.loanToValueRatio || 'N/A'}%
- Front-end Ratio: ${formData.analytics?.riskAnalysis?.frontEndRatio || 'N/A'}%
- Back-end Ratio: ${formData.analytics?.riskAnalysis?.backEndRatio || 'N/A'}%
- Housing Expense Ratio: ${formData.analytics?.riskAnalysis?.housingExpenseRatio || 'N/A'}%
`
  }

  // Add tier-specific instructions
  const tierInstructions = tier === 'elite' 
    ? `Provide a comprehensive investment analysis including:
1. Detailed ROI projection with market context
2. Risk assessment considering multiple factors
3. Specific recommendations for optimization
4. Market comparison and benchmarking
5. Long-term value appreciation potential
6. Tax implications and benefits
7. Financing strategy optimization
8. Exit strategy recommendations
9. Portfolio integration analysis
10. Risk mitigation strategies
Please be thorough and analytical in your response.`
    : `Provide a concise investment analysis including:
1. Basic ROI assessment
2. Key risk factors
3. One or two main recommendations
4. Market position
5. Financing considerations
Keep the response focused and actionable.`

  return `${basePrompt}${details}${specificDetails}\n${tierInstructions}`
}

export async function POST(request: Request) {
  try {
    // Verify session and tier
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user tier from session
    const tier = session.user.subscriptionTier || 'free'
    if (tier === 'free') {
      return NextResponse.json({ error: 'Upgrade required' }, { status: 403 })
    }

    // Parse request body
    const body = await request.json()
    const { calculatorType, formData } = body

    if (!calculatorType || !formData) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 })
    }

    // Generate appropriate prompt
    const prompt = generatePrompt(calculatorType, formData, tier)

    // TODO: Replace with actual OpenAI API call
    // For now, return mock response based on tier
    const mockResponse = tier === 'elite'
      ? `Comprehensive Investment Analysis

ROI Projection:
Based on the provided data, we project an annualized ROI of 14.7%. This calculation factors in:
- Gross Revenue: $4,050/month (75% occupancy @ $180/night)
- Operating Expenses: $2,820/month
- Net Cash Flow: $1,230/month

Market Context:
- Your location shows strong seasonal demand (peak: Jun-Aug)
- Local market occupancy averages 72%
- Your price point is competitive for the amenities

Risk Assessment:
1. Seasonality Impact: Moderate risk - consider dynamic pricing
2. Market Competition: Low risk - limited inventory in area
3. Regulatory Environment: Low risk - stable short-term rental policies
4. Interest Rate Exposure: Moderate risk - fixed rate recommended

Optimization Recommendations:
1. Pricing Strategy: Implement seasonal adjustments (+15% during peak)
2. Operational Efficiency: Bundle cleaning services for better margins
3. Marketing: Improve listing photos and description
4. Revenue Management: Consider minimum stay requirements during peak

Benchmark Comparison:
- Your projected RevPAR: $135 (Top 25% in market)
- Market Average RevPAR: $112
- Your Cost Basis: 15% below market average

Long-term Outlook:
Property value appreciation potential is strong due to:
- Area development plans
- Historical 5.8% annual appreciation
- Growing rental demand

Overall: Strong investment opportunity with multiple optimization levers available.`
      : `Investment Analysis Summary

Based on a 75% occupancy rate and $180/night average:
- Estimated monthly revenue: $4,050
- Net cash flow: $1,230

Key Risks:
1. Seasonal demand fluctuations
2. Market competition

Recommendations:
1. Consider increasing daily rate by 10%
2. Implement dynamic pricing for peak seasons

Overall: Deal shows good profit potential in current market conditions.`

    return NextResponse.json({ 
      success: true,
      insight: mockResponse
    })

  } catch (error) {
    console.error('GPT analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to generate analysis' },
      { status: 500 }
    )
  }
} 