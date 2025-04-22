import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { prisma } from '@/app/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { id } = params
    
    // Find the analysis to verify ownership
    const analysis = await prisma.analysis.findUnique({
      where: { id },
      include: { user: true }
    })
    
    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      )
    }
    
    // Verify the user owns this analysis
    if (analysis.user.email !== session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }
    
    // Delete the analysis and all its versions
    await prisma.analysisVersion.deleteMany({
      where: { analysisId: id }
    })
    
    await prisma.analysis.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting analysis:', error)
    return NextResponse.json(
      { error: 'Failed to delete analysis' },
      { status: 500 }
    )
  }
} 