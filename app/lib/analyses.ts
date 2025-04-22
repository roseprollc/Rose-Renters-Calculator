import { Analysis, AnalysisType } from '../types/analysis'
import { prisma } from './prisma'
import { Analysis as PrismaAnalysis, AnalysisVersion } from '@prisma/client'

// TODO: Replace with actual database queries
const mockAnalyses: Analysis[] = [
  {
    id: '1',
    userId: 'user1',
    propertyAddress: '123 Main St, City, State 12345',
    type: 'airbnb',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: {
      price: 500000,
      estimatedRevenue: 75000,
      notes: 'Great location near downtown'
    }
  },
  {
    id: '2',
    userId: 'user1',
    propertyAddress: '456 Oak Ave, City, State 12345',
    type: 'rental',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: {
      price: 300000,
      estimatedRevenue: 36000
    }
  }
]

export async function getUserAnalyses(userEmail: string): Promise<Analysis[]> {
  const analyses = await prisma.analysis.findMany({
    where: {
      user: {
        email: userEmail
      }
    },
    include: {
      versions: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })

  return analyses.map((analysis: PrismaAnalysis & { versions: AnalysisVersion[] }) => ({
    id: analysis.id,
    userId: analysis.userId,
    propertyAddress: analysis.propertyAddress,
    type: analysis.type as AnalysisType,
    createdAt: analysis.createdAt.toISOString(),
    updatedAt: analysis.updatedAt.toISOString(),
    data: analysis.data as any,
    notes: analysis.notes || undefined,
    aiSummary: analysis.aiSummary || undefined,
    versions: analysis.versions.map((version: AnalysisVersion) => ({
      id: version.id,
      createdAt: version.createdAt.toISOString(),
      data: version.data as any,
      notes: version.notes || undefined,
      aiSummary: version.aiSummary || undefined
    }))
  }))
}

export async function saveAnalysis(
  analysis: Omit<Analysis, 'id' | 'createdAt' | 'updatedAt'>,
  userEmail: string
): Promise<Analysis> {
  const user = await prisma.user.findUnique({
    where: { email: userEmail }
  })

  if (!user) throw new Error('User not found')

  // Check free tier limit
  if (user.subscriptionTier === 'free') {
    const count = await prisma.analysis.count({
      where: { userId: user.id }
    })
    if (count >= 5) {
      throw new Error('Free tier limit reached')
    }
  }

  // Check if this is an update to an existing analysis
  const existingAnalysis = await prisma.analysis.findFirst({
    where: {
      userId: user.id,
      propertyAddress: analysis.propertyAddress,
      type: analysis.type
    }
  })

  if (existingAnalysis) {
    // Create a new version of the existing analysis
    const newVersion = await prisma.analysisVersion.create({
      data: {
        analysisId: existingAnalysis.id,
        data: analysis.data,
        notes: analysis.notes,
        aiSummary: analysis.aiSummary
      }
    })

    // Update the main analysis
    const updatedAnalysis = await prisma.analysis.update({
      where: { id: existingAnalysis.id },
      data: {
        data: analysis.data,
        notes: analysis.notes,
        aiSummary: analysis.aiSummary,
        updatedAt: new Date()
      },
      include: {
        versions: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    return {
      id: updatedAnalysis.id,
      userId: updatedAnalysis.userId,
      propertyAddress: updatedAnalysis.propertyAddress,
      type: updatedAnalysis.type as AnalysisType,
      createdAt: updatedAnalysis.createdAt.toISOString(),
      updatedAt: updatedAnalysis.updatedAt.toISOString(),
      data: updatedAnalysis.data as any,
      notes: updatedAnalysis.notes || undefined,
      aiSummary: updatedAnalysis.aiSummary || undefined,
      versions: updatedAnalysis.versions.map((version: AnalysisVersion) => ({
        id: version.id,
        createdAt: version.createdAt.toISOString(),
        data: version.data as any,
        notes: version.notes || undefined,
        aiSummary: version.aiSummary || undefined
      }))
    }
  }

  // Create new analysis and version
  const newAnalysis = await prisma.analysis.create({
    data: {
      userId: user.id,
      propertyAddress: analysis.propertyAddress,
      type: analysis.type,
      data: analysis.data,
      notes: analysis.notes,
      aiSummary: analysis.aiSummary,
      versions: {
        create: {
          data: analysis.data,
          notes: analysis.notes,
          aiSummary: analysis.aiSummary
        }
      }
    },
    include: {
      versions: true
    }
  })

  return {
    id: newAnalysis.id,
    userId: newAnalysis.userId,
    propertyAddress: newAnalysis.propertyAddress,
    type: newAnalysis.type as AnalysisType,
    createdAt: newAnalysis.createdAt.toISOString(),
    updatedAt: newAnalysis.updatedAt.toISOString(),
    data: newAnalysis.data as any,
    notes: newAnalysis.notes || undefined,
    aiSummary: newAnalysis.aiSummary || undefined,
    versions: newAnalysis.versions.map((version: AnalysisVersion) => ({
      id: version.id,
      createdAt: version.createdAt.toISOString(),
      data: version.data as any,
      notes: version.notes || undefined,
      aiSummary: version.aiSummary || undefined
    }))
  }
}

export async function updateAnalysisNotes(id: string, notes: string): Promise<void> {
  await prisma.analysis.update({
    where: { id },
    data: {
      notes,
      updatedAt: new Date()
    }
  })
}

export async function deleteAnalyses(ids: string[]): Promise<void> {
  await prisma.analysis.deleteMany({
    where: {
      id: {
        in: ids
      }
    }
  })
}

export async function exportAnalysis(id: string, format: 'pdf' | 'csv'): Promise<Blob> {
  const analysis = await prisma.analysis.findUnique({
    where: { id },
    include: {
      versions: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  if (!analysis) throw new Error('Analysis not found')

  if (format === 'csv') {
    // Generate CSV
    const rows = [
      ['Property Address', 'Type', 'Price', 'Created At', 'Notes', 'AI Summary'],
      [
        analysis.propertyAddress,
        analysis.type,
        (analysis.data as any).price || '',
        analysis.createdAt.toISOString(),
        analysis.notes || '',
        analysis.aiSummary || ''
      ]
    ]
    
    // Add version history if available
    if (analysis.versions && analysis.versions.length > 0) {
      rows.push(['', '', '', '', '', ''])
      rows.push(['Version History', '', '', '', '', ''])
      rows.push(['Version ID', 'Created At', 'Price', 'Notes', 'AI Summary', ''])
      
      analysis.versions.forEach(version => {
        rows.push([
          version.id,
          version.createdAt.toISOString(),
          (version.data as any).price || '',
          version.notes || '',
          version.aiSummary || '',
          ''
        ])
      })
    }
    
    const csv = rows.map(row => row.join(',')).join('\n')
    return new Blob([csv], { type: 'text/csv' })
  } else {
    // Generate PDF (you'll need a PDF library like pdfkit)
    // This is a placeholder that returns a simple text blob
    let text = `
      Property Analysis Report
      -----------------------
      Address: ${analysis.propertyAddress}
      Type: ${analysis.type}
      Price: ${(analysis.data as any).price || 'N/A'}
      Created: ${analysis.createdAt.toISOString()}
      Notes: ${analysis.notes || 'N/A'}
      AI Summary: ${analysis.aiSummary || 'N/A'}
    `
    
    // Add version history if available
    if (analysis.versions && analysis.versions.length > 0) {
      text += `
      
      Version History
      --------------
      `
      
      analysis.versions.forEach((version, index) => {
        text += `
        Version ${index + 1} (${version.createdAt.toISOString()})
        Price: ${(version.data as any).price || 'N/A'}
        Notes: ${version.notes || 'N/A'}
        AI Summary: ${version.aiSummary || 'N/A'}
        `
      })
    }
    
    return new Blob([text], { type: 'application/pdf' })
  }
} 