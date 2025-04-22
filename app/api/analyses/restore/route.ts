import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { prisma } from '@/app/lib/prisma';
import { Analysis } from '@/app/types/analysis';

interface AnalysisData {
  propertyAddress?: string;
  [key: string]: any;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check subscription tier
    if (session.user.subscriptionTier === 'free') {
      return NextResponse.json(
        { error: 'restore_not_allowed' },
        { status: 403 }
      );
    }

    const { analysisId, versionIndex } = await request.json();
    
    if (!analysisId || typeof versionIndex !== 'number') {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    // Find the analysis and ensure it belongs to the user
    const analysis = await prisma.analysis.findUnique({
      where: {
        id: analysisId,
        userId: session.user.id
      },
      include: {
        versions: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    // Validate version index
    if (!analysis.versions || versionIndex >= analysis.versions.length) {
      return NextResponse.json(
        { error: 'Invalid version index' },
        { status: 400 }
      );
    }

    // Get the version to restore
    const versionToRestore = analysis.versions[versionIndex];
    const versionData = versionToRestore.data as AnalysisData;
    const currentData = analysis.data as AnalysisData;

    // Update the analysis with the restored version and add current state to versions
    const updatedAnalysis = await prisma.analysis.update({
      where: { id: analysisId },
      data: {
        data: versionData,
        propertyAddress: versionData?.propertyAddress || analysis.propertyAddress,
        notes: versionToRestore.notes,
        versions: {
          create: {
            data: currentData,
            notes: 'Auto-saved before restore',
            aiSummary: analysis.versions[0]?.aiSummary
          }
        }
      },
      include: {
        versions: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Version restored successfully',
      analysis: updatedAnalysis
    });
  } catch (error) {
    console.error('Error restoring version:', error);
    return NextResponse.json(
      { error: 'Failed to restore version' },
      { status: 500 }
    );
  }
} 