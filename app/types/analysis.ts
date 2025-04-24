import { SubscriptionTier } from "./subscription";

export type AnalysisType = 'mortgage' | 'rental' | 'wholesale' | 'airbnb'

export type SortOption = 'newest' | 'oldest' | 'price-high' | 'price-low' | 'revenue-high' | 'revenue-low'

export interface AnalysisFilters {
  search: string
  type: AnalysisType | 'all'
  sortBy: SortOption
}

export interface AnalysisVersion {
  id: string
  createdAt: string
  data: any
  notes?: string
  aiInsights?: string
}

export interface DigestPreferences {
  enabled: boolean
  deliveryDay: 'monday' | 'wednesday' | 'friday'
  analysisTypes: AnalysisType[]
}

export interface AutoImproveSuggestion {
  id: string
  suggestion: string
  impact: string
  createdAt: string
}

export interface Analysis {
  id: string
  userId: string
  type: AnalysisType
  createdAt: string
  updatedAt: string
  propertyAddress: string
  notes?: string
  aiInsights?: string
  tags: string[]
  
  // Mortgage specific fields
  purchasePrice?: number
  downPayment?: number
  monthlyPayment?: number
  
  // Rental specific fields
  monthlyRent?: number
  vacancyRate?: number
  operatingExpenses?: number
  
  // Wholesale specific fields
  arv?: number
  repairCosts?: number
  offerPrice?: number
  
  // Airbnb specific fields
  averageDailyRate?: number
  occupancyRate?: number
  monthlyRevenue?: number

  // Common fields
  propertyPrice?: number
  versions: {
    id: string
    data: Omit<Analysis, '_id' | 'userId' | 'versions'>
    createdAt: string
  }[]
  data: {
    price?: number
    revenue?: number
    [key: string]: any
  }

  // Mortgage specific
  interestRate?: number
  totalInterest?: number
  totalCost?: number

  // Rental specific
  monthlyCashFlow?: number
  annualCashFlow?: number
  roi?: number
  capRate?: number

  // Wholesale specific
  potentialProfit?: number
  totalInvestment?: number

  // Airbnb specific
  nightlyRate?: number
  monthlyExpenses?: number
  monthlyProfit?: number

  digestPreferences?: DigestPreferences
  autoImproveSuggestions?: AutoImproveSuggestion[]

  aiSummary?: string
  aiInsights?: string
  aiRecommendations?: string
  aiRiskAssessment?: string
  aiMarketAnalysis?: string
  aiPropertyValue?: string
  aiRentalIncome?: string
  aiExpenses?: string
  aiCashFlow?: string
  aiRoi?: string
  aiCapRate?: string
  aiBreakEven?: string
  aiDscr?: string
  aiNotes?: string
}

export interface RentalAnalysis extends Analysis {
  mode: 'renters'
  monthlyRent: number
  propertyTaxes: number
  insurance: number
  maintenance: number
  vacancyRate: number
  managementFee: number
  utilities: number
  otherExpenses: number
}

export interface WholesaleAnalysis extends Analysis {
  mode: 'wholesale'
  arv: number
  repairCosts: number
  holdingCosts: number
  assignmentFee: number
  profit: number
}

export interface AirbnbAnalysis extends Analysis {
  mode: 'airbnb'
  nightlyRate: number
  occupancyRate: number
  cleaningFee: number
  platformFees: number
  monthlyRent: number
}

export function isRentalAnalysis(analysis: Analysis): analysis is RentalAnalysis {
  return analysis.mode === 'renters'
}

export function isWholesaleAnalysis(analysis: Analysis): analysis is WholesaleAnalysis {
  return analysis.mode === 'wholesale'
}

export function isAirbnbAnalysis(analysis: Analysis): analysis is AirbnbAnalysis {
  return analysis.mode === 'airbnb'
}

// Extend the Session type to include subscriptionTier
declare module 'next-auth' {
  interface Session {
    user?: {
      id?: string
      email?: string | null
      name?: string | null
      image?: string | null
      role?: string
      subscriptionTier?: 'free' | 'pro' | 'elite'
    }
  }
} 