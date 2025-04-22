import { Analysis } from '@/app/types/analysis'

/**
 * Generates AI insights based on the analysis data
 * This is a mock implementation that will be replaced with actual GPT integration
 * 
 * @param analysis The analysis data to generate insights from
 * @param userTier The user's subscription tier (free, pro, elite)
 * @returns A string containing the AI-generated insights
 */
export async function generateInsightFromAnalysis(
  analysis: Analysis,
  userTier: 'free' | 'pro' | 'elite'
): Promise<string> {
  // Mock delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Generate insights based on analysis type
  switch (analysis.type) {
    case 'mortgage':
      return generateMortgageInsights(analysis)
    case 'rental':
      return generateRentalInsights(analysis)
    case 'wholesale':
      return generateWholesaleInsights(analysis)
    case 'airbnb':
      return generateAirbnbInsights(analysis)
    default:
      return 'Unable to generate insights for this analysis type.'
  }
}

/**
 * Generates insights for mortgage analyses
 */
function generateMortgageInsights(analysis: Analysis): string {
  const monthlyPayment = analysis.monthlyPayment
  const totalCost = analysis.totalCost
  const roi = analysis.roi
  
  let insight = `Based on the mortgage analysis for ${analysis.propertyAddress}, `
  
  // ROI assessment
  if (roi > 10) {
    insight += `this property shows strong investment potential with a ${roi.toFixed(2)}% ROI. `
  } else if (roi > 5) {
    insight += `this property has moderate investment potential with a ${roi.toFixed(2)}% ROI. `
  } else {
    insight += `this property has limited investment potential with a ${roi.toFixed(2)}% ROI. `
  }
  
  // Monthly payment assessment
  if (monthlyPayment < 1000) {
    insight += `The monthly payment of ${monthlyPayment.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} is relatively low, making it more accessible. `
  } else if (monthlyPayment < 2000) {
    insight += `The monthly payment of ${monthlyPayment.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} is moderate. `
  } else {
    insight += `The monthly payment of ${monthlyPayment.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} is relatively high, which may impact cash flow. `
  }
  
  // Total cost assessment
  insight += `The total cost of ${totalCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} should be considered in relation to the property's appreciation potential. `
  
  // Interest rate context if available
  if (analysis.interestRate) {
    if (analysis.interestRate < 4) {
      insight += `The current interest rate of ${analysis.interestRate}% is favorable. `
    } else if (analysis.interestRate < 6) {
      insight += `The current interest rate of ${analysis.interestRate}% is moderate. `
    } else {
      insight += `The current interest rate of ${analysis.interestRate}% is relatively high, which may impact long-term profitability. `
    }
  }
  
  return insight
}

/**
 * Generates insights for rental analyses
 */
function generateRentalInsights(analysis: Analysis): string {
  const monthlyCashFlow = analysis.monthlyCashFlow
  const annualCashFlow = analysis.annualCashFlow || (monthlyCashFlow * 12)
  const capRate = analysis.capRate
  
  let insight = `Based on the rental analysis for ${analysis.propertyAddress}, `
  
  // Cash flow assessment
  if (monthlyCashFlow > 500) {
    insight += `this property shows strong cash flow potential with ${monthlyCashFlow.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} monthly cash flow. `
  } else if (monthlyCashFlow > 0) {
    insight += `this property has positive cash flow of ${monthlyCashFlow.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} monthly, though it's relatively modest. `
  } else {
    insight += `this property has negative cash flow of ${Math.abs(monthlyCashFlow).toLocaleString('en-US', { style: 'currency', currency: 'USD' })} monthly, which may not be sustainable long-term. `
  }
  
  // Cap rate assessment
  if (capRate > 8) {
    insight += `The cap rate of ${capRate.toFixed(2)}% is excellent, indicating strong potential returns. `
  } else if (capRate > 5) {
    insight += `The cap rate of ${capRate.toFixed(2)}% is good, indicating reasonable returns. `
  } else {
    insight += `The cap rate of ${capRate.toFixed(2)}% is relatively low, suggesting limited income potential relative to the property value. `
  }
  
  // Annual cash flow context
  insight += `The annual cash flow of ${annualCashFlow.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} should be considered in relation to maintenance costs and potential vacancies. `
  
  return insight
}

/**
 * Generates insights for wholesale analyses
 */
function generateWholesaleInsights(analysis: Analysis): string {
  const arv = analysis.arv
  const potentialProfit = analysis.potentialProfit
  const totalInvestment = analysis.totalInvestment || 0
  const repairCosts = analysis.repairCosts || 0
  
  let insight = `Based on the wholesale analysis for ${analysis.propertyAddress}, `
  
  // Profit potential assessment
  if (potentialProfit > 30000) {
    insight += `this property shows excellent profit potential with ${potentialProfit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} in potential profit. `
  } else if (potentialProfit > 15000) {
    insight += `this property has good profit potential with ${potentialProfit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} in potential profit. `
  } else {
    insight += `this property has limited profit potential with ${potentialProfit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} in potential profit. `
  }
  
  // ARV assessment
  insight += `The After Repair Value (ARV) of ${arv.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} `
  
  // Repair costs context
  if (repairCosts > 0) {
    insight += `with estimated repair costs of ${repairCosts.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} `
  }
  
  // Investment assessment
  insight += `requires a total investment of ${totalInvestment.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}. `
  
  // Risk assessment
  if (repairCosts > arv * 0.3) {
    insight += `The high repair costs relative to ARV indicate significant renovation risk. `
  } else if (repairCosts > arv * 0.15) {
    insight += `The moderate repair costs suggest manageable renovation requirements. `
  } else {
    insight += `The low repair costs suggest minimal renovation requirements. `
  }
  
  return insight
}

/**
 * Generates insights for Airbnb analyses
 */
function generateAirbnbInsights(analysis: Analysis): string {
  const monthlyRevenue = analysis.monthlyRevenue
  const monthlyProfit = analysis.monthlyProfit || 0
  const nightlyRate = analysis.nightlyRate || 0
  
  let insight = `Based on the Airbnb analysis for ${analysis.propertyAddress}, `
  
  // Revenue assessment
  if (monthlyRevenue > 5000) {
    insight += `this property shows strong revenue potential with ${monthlyRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} monthly revenue. `
  } else if (monthlyRevenue > 3000) {
    insight += `this property has good revenue potential with ${monthlyRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} monthly revenue. `
  } else {
    insight += `this property has modest revenue potential with ${monthlyRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} monthly revenue. `
  }
  
  // Profit assessment
  if (monthlyProfit > 2000) {
    insight += `The monthly profit of ${monthlyProfit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} is excellent. `
  } else if (monthlyProfit > 0) {
    insight += `The monthly profit of ${monthlyProfit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} is positive but modest. `
  } else {
    insight += `The monthly loss of ${Math.abs(monthlyProfit).toLocaleString('en-US', { style: 'currency', currency: 'USD' })} indicates this property may not be profitable as a short-term rental. `
  }
  
  // Nightly rate context
  if (nightlyRate > 0) {
    insight += `With a nightly rate of ${nightlyRate.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}, `
    
    if (nightlyRate > 200) {
      insight += `this property is positioned in the premium segment of the market. `
    } else if (nightlyRate > 100) {
      insight += `this property is positioned in the mid-range segment of the market. `
    } else {
      insight += `this property is positioned in the budget segment of the market. `
    }
  }
  
  return insight
} 