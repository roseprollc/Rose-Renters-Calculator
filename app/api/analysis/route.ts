import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { prisma } from '@/app/lib/prisma';
import { generatePDF, generateCSV } from '@/app/lib/exportUtils';
import { nanoid } from 'nanoid';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const userId = session.user.id;

    const analysis = await prisma.analysis.create({
      data: {
        userId,
        type: 'mortgage',
        data,
        propertyAddress: data.propertyAddress || 'Unknown Address',
        versions: {
          create: {
            data,
            notes: data.notes || '',
            aiSummary: data.aiSummary || ''
          }
        }
      },
      include: {
        versions: true
      }
    });

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error('Save analysis error:', error);
    return NextResponse.json({ error: 'Failed to save analysis' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { analysisId, data, notes, aiSummary } = await req.json();
    const userId = session.user.id;

    // Get original analysis
    const originalAnalysis = await prisma.analysis.findUnique({
      where: { id: analysisId, userId },
      include: { versions: true }
    });

    if (!originalAnalysis) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
    }

    // Check subscription tier for version history
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (user?.subscriptionTier === 'free') {
      // For free tier, update the existing analysis
      const updatedAnalysis = await prisma.analysis.update({
        where: { id: analysisId },
        data: {
          data,
          propertyAddress: data.propertyAddress || originalAnalysis.propertyAddress,
          versions: {
            update: {
              where: { id: originalAnalysis.versions[0].id },
              data: {
                data,
                notes: notes || '',
                aiSummary: aiSummary || ''
              }
            }
          }
        },
        include: {
          versions: true
        }
      });

      return NextResponse.json({ success: true, analysis: updatedAnalysis });
    }

    // For Pro/Elite, create new version
    const updatedAnalysis = await prisma.analysis.update({
      where: { id: analysisId },
      data: {
        data,
        propertyAddress: data.propertyAddress || originalAnalysis.propertyAddress,
        versions: {
          create: {
            data,
            notes: notes || '',
            aiSummary: aiSummary || ''
          }
        }
      },
      include: {
        versions: true
      }
    });

    return NextResponse.json({ success: true, analysis: updatedAnalysis });
  } catch (error) {
    console.error('Update analysis error:', error);
    return NextResponse.json({ error: 'Failed to update analysis' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const analyses = await prisma.analysis.findMany({
      where: { userId },
      include: {
        versions: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, analyses });
  } catch (error) {
    console.error('Get analyses error:', error);
    return NextResponse.json({ error: 'Failed to get analyses' }, { status: 500 });
  }
} 