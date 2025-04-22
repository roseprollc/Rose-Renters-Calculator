import { useSession } from 'next-auth/react'

export type UserTier = 'free' | 'pro' | 'elite'

/**
 * Hook to get the current user's subscription tier
 * @returns The user's subscription tier or 'free' if not authenticated
 */
export function useUserTier(): UserTier {
  const { data: session } = useSession()
  
  // Default to 'free' if not authenticated
  if (!session?.user) {
    return 'free'
  }
  
  // Check for role in session (which corresponds to subscription tier)
  const role = session.user.role
  
  // Map role to tier
  if (role === 'elite') return 'elite'
  if (role === 'pro') return 'pro'
  
  // Default to 'free' if no role is set or it's not pro/elite
  return 'free'
}

/**
 * Check if the user has access to a specific feature based on their tier
 * @param requiredTier The minimum tier required for the feature
 * @returns Boolean indicating if the user has access
 */
export function useHasFeatureAccess(requiredTier: UserTier): boolean {
  const userTier = useUserTier()
  
  // Define tier hierarchy
  const tierHierarchy: Record<UserTier, number> = {
    'free': 0,
    'pro': 1,
    'elite': 2
  }
  
  // Check if user's tier is sufficient
  return tierHierarchy[userTier] >= tierHierarchy[requiredTier]
}

/**
 * Get a list of features available to the current user
 * @returns Object with boolean flags for each feature
 */
export function useAvailableFeatures() {
  const userTier = useUserTier()
  
  return {
    // AI features
    canUseAI: userTier !== 'free',
    canAutoGenerateAI: userTier === 'elite',
    
    // Export features
    canExportPDF: userTier !== 'free',
    canExportCSV: userTier !== 'free',
    canBulkExport: userTier !== 'free',
    
    // Version history features
    canViewHistory: true, // Available to all tiers
    canSaveVersions: userTier !== 'free',
    
    // Other features can be added here
  }
} 