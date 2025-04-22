import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { prisma } from '@/app/lib/prisma';
import { Analysis, AnalysisVersion } from '@/app/types/analysis';

// GET: Fetch version history for a specific analysis
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const analysisId = searchParams.get('analysisId');
    
    if (!analysisId) {
      return NextResponse.json(
        { error: 'Analysis ID is required' },
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

    // Return the versions array or empty array if none exists
    return NextResponse.json(analysis.versions || []);
  } catch (error) {
    console.error('Error fetching version history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch version history' },
      { status: 500 }
    );
  }
}

// POST: Add a new version to an analysis
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { analysisId, version } = await req.json();
    
    if (!analysisId || !version) {
      return NextResponse.json(
        { error: 'Analysis ID and version data are required' },
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
        versions: true
      }
    });

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    // Add the new version
    const updatedAnalysis = await prisma.analysis.update({
      where: { id: analysisId },
      data: {
        versions: {
          create: {
            data: version.data,
            notes: version.notes,
            aiSummary: version.aiSummary
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
      analysis: updatedAnalysis
    });
  } catch (error) {
    console.error('Error adding version:', error);
    return NextResponse.json(
      { error: 'Failed to add version' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a specific version
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const analysisId = searchParams.get('analysisId');
    const versionId = searchParams.get('versionId');
    
    if (!analysisId || !versionId) {
      return NextResponse.json(
        { error: 'Analysis ID and version ID are required' },
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
        versions: true
      }
    });

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    // Delete the version
    await prisma.analysisVersion.delete({
      where: { id: versionId }
    });

    return NextResponse.json({
      success: true,
      message: 'Version deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting version:', error);
    return NextResponse.json(
      { error: 'Failed to delete version' },
      { status: 500 }
    );
  }
} 