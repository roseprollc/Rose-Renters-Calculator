import { SubscriptionTier } from '@prisma/client'

export type AnalysisType = 'mortgage' | 'rental' | 'wholesale' | 'airbnb'

export type BaseAnalysis = {
  id: string
  userId: string
  propertyAddress: string
  type: AnalysisType
  createdAt: string
  updatedAt: string
  tags: string[]
  notes?: string
  aiSummary?: string
  versions: AnalysisVersion[]
}

export type MortgageAnalysis = BaseAnalysis & {
  type: 'mortgage'
  data: {
    price: number
    downPayment: number
    interestRate: number
    loanTerm: number
    monthlyPayment: number
    propertyTax: number
    insurance: number
    hoa?: number
    maintenance?: number
    utilities?: number
    capRate?: number
    roi?: number
  }
}

export type RentalAnalysis = BaseAnalysis & {
  type: 'rental'
  data: {
    price: number
    estimatedRent: number
    expenses: {
      propertyTax: number
      insurance: number
      maintenance: number
      utilities?: number
      hoa?: number
    }
    monthlyCashFlow: number
    capRate: number
    roi: number
  }
}

export type WholesaleAnalysis = BaseAnalysis & {
  type: 'wholesale'
  data: {
    purchasePrice: number
    arv: number
    repairCosts: number
    potentialProfit: number
    holdingCosts?: number
  }
}

export type AirbnbAnalysis = BaseAnalysis & {
  type: 'airbnb'
  data: {
    price: number
    monthlyRevenue: number
    occupancyRate: number
    expenses: {
      propertyTax: number
      insurance: number
      maintenance: number
      utilities: number
      cleaning: number
      supplies: number
      hoa?: number
    }
    monthlyCashFlow: number
    capRate: number
    roi: number
  }
}

export type Analysis = MortgageAnalysis | RentalAnalysis | WholesaleAnalysis | AirbnbAnalysis

export type AnalysisVersion = {
  id: string
  analysisId: string
  createdAt: string
  data: any
  notes?: string
}

export type SortOption = 'date-asc' | 'date-desc' | 'price-asc' | 'price-desc'

export type AnalysisFilters = {
  type: AnalysisType | 'all'
  sortBy: SortOption
  search?: string
}

// Type guard utility
export function isMortgageAnalysis(a: Analysis): a is MortgageAnalysis {
  return a.type === 'mortgage' && 
    typeof a.data.price === 'number'
} 