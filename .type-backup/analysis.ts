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
  interestRate?: number
  totalInterest?: number
  totalCost?: number
  roi?: number
  
  // Rental specific fields
  monthlyRent?: number
  vacancyRate?: number
  operatingExpenses?: number
  monthlyCashFlow?: number
  annualCashFlow?: number
  capRate?: number
  
  // Wholesale specific fields
  arv?: number
  repairCosts?: number
  offerPrice?: number
  potentialProfit?: number
  totalInvestment?: number
  
  // Airbnb specific fields
  averageDailyRate?: number
  occupancyRate?: number
  monthlyRevenue?: number
  nightlyRate?: number
  monthlyExpenses?: number
  monthlyProfit?: number

  // Common fields
  propertyPrice?: number
  versions: AnalysisVersion[]
  data: {
    price?: number
    revenue?: number
    [key: string]: any
  }

  digestPreferences?: DigestPreferences
  autoImproveSuggestions?: AutoImproveSuggestion[]
} 