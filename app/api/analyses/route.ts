import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { prisma } from '@/app/lib/prisma';
import { Analysis } from '@/app/types/analysis';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const sort = searchParams.get('sort') || 'date-desc';
    const search = searchParams.get('search') || '';

    // Build query
    const where: any = { userId: session.user.id };
    
    if (type && type !== 'all') {
      where.type = type;
    }

    if (search) {
      where.OR = [
        { propertyAddress: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Build sort
    let orderBy: any = { createdAt: 'desc' };
    switch (sort) {
      case 'date-asc':
        orderBy = { createdAt: 'asc' };
        break;
      case 'date-desc':
        orderBy = { createdAt: 'desc' };
        break;
      case 'type':
        orderBy = [{ type: 'asc' }, { createdAt: 'desc' }];
        break;
      case 'address':
        orderBy = [{ propertyAddress: 'asc' }, { createdAt: 'desc' }];
        break;
    }

    const analyses = await prisma.analysis.findMany({
      where,
      orderBy,
      include: {
        versions: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    return NextResponse.json(analyses);
  } catch (error) {
    console.error('Error fetching analyses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analyses' },
      { status: 500 }
    );
  }
}

interface VersionData {
  id: string;
  createdAt: string;
  data: Omit<Analysis, 'id' | 'userId' | 'versions'>;
  notes?: string;
  aiSummary?: string;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.type || !body.propertyAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if this is an update to an existing analysis
    if (body.id) {
      const existingAnalysis = await prisma.analysis.findUnique({
        where: { id: body.id, userId: session.user.id },
        include: { versions: true }
      });

      if (!existingAnalysis) {
        return NextResponse.json(
          { error: 'Analysis not found' },
          { status: 404 }
        );
      }

      // Update existing analysis
      const updatedAnalysis = await prisma.analysis.update({
        where: { id: body.id },
        data: {
          type: body.type,
          propertyAddress: body.propertyAddress,
          data: body.data,
          notes: body.notes,
          versions: {
            create: {
              data: body.data,
              notes: body.notes,
              aiSummary: body.aiSummary
            }
          }
        },
        include: {
          versions: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      return NextResponse.json(updatedAnalysis);
    }

    // Create new analysis
    const newAnalysis = await prisma.analysis.create({
      data: {
        userId: session.user.id,
        type: body.type,
        propertyAddress: body.propertyAddress,
        data: body.data,
        notes: body.notes,
        versions: {
          create: {
            data: body.data,
            notes: body.notes,
            aiSummary: body.aiSummary
          }
        }
      },
      include: {
        versions: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    return NextResponse.json(newAnalysis);
  } catch (error) {
    console.error('Error saving analysis:', error);
    return NextResponse.json(
      { error: 'Failed to save analysis' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids')?.split(',') || [];

    if (ids.length === 0) {
      return NextResponse.json(
        { error: 'No analysis IDs provided' },
        { status: 400 }
      );
    }

    // Delete analyses
    await prisma.analysis.deleteMany({
      where: {
        id: { in: ids },
        userId: session.user.id
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting analyses:', error);
    return NextResponse.json(
      { error: 'Failed to delete analyses' },
      { status: 500 }
    );
  }
} 