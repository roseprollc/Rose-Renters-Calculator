export type UserTier = 'free' | 'pro' | 'elite'

export interface TierFeatures {
  maxProperties: number
  gptInsights: boolean
  dealAnalysis: boolean
  marketReports: boolean
  apiAccess: boolean
  customReports: boolean
}

export const TIER_FEATURES: Record<UserTier, TierFeatures> = {
  free: {
    maxProperties: 1,
    gptInsights: false,
    dealAnalysis: false,
    marketReports: false,
    apiAccess: false,
    customReports: false
  },
  pro: {
    maxProperties: 5,
    gptInsights: true,
    dealAnalysis: true,
    marketReports: true,
    apiAccess: false,
    customReports: false
  },
  elite: {
    maxProperties: Infinity,
    gptInsights: true,
    dealAnalysis: true,
    marketReports: true,
    apiAccess: true,
    customReports: true
  }
}

export function hasFeatureAccess(tier: UserTier, feature: keyof TierFeatures): boolean {
  return TIER_FEATURES[tier][feature]
}

export function getMaxProperties(tier: UserTier): number {
  return TIER_FEATURES[tier].maxProperties
}

export function canUpgrade(currentTier: UserTier): boolean {
  return currentTier !== 'elite'
}

export function getNextTier(currentTier: UserTier): UserTier | null {
  switch (currentTier) {
    case 'free':
      return 'pro'
    case 'pro':
      return 'elite'
    default:
      return null
  }
}

export function getTierPrice(tier: UserTier): number {
  switch (tier) {
    case 'pro':
      return 29.99
    case 'elite':
      return 99.99
    default:
      return 0
  }
} 