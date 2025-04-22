import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/app/lib/mongodb';
import { Analysis } from '@/app/types/analysis';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const client = await clientPromise;
    const db = client.db();

    // Validate required fields
    if (!data.type || !data.address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create analysis document
    const analysis: Omit<Analysis, 'id'> = {
      type: data.type,
      address: data.address,
      createdAt: new Date(),
      notes: data.notes || '',
      ...data
    };

    // Insert into database
    const result = await db.collection('analyses').insertOne({
      ...analysis,
      userId: session.user.email
    });

    return NextResponse.json({
      id: result.insertedId,
      ...analysis
    });
  } catch (error) {
    console.error('Error saving analysis:', error);
    return NextResponse.json(
      { error: 'Failed to save analysis' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'newest';

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const where = {
      userId: user.id,
      ...(type && type !== 'all' ? { type } : {}),
      ...(search ? {
        OR: [
          { propertyAddress: { contains: search, mode: 'insensitive' } },
          { notes: { contains: search, mode: 'insensitive' } }
        ]
      } : {})
    };

    const analyses = await prisma.analysis.findMany({
      where,
      orderBy: {
        createdAt: sortBy === 'newest' ? 'desc' : 'asc'
      }
    });

    return NextResponse.json({ analyses });

  } catch (error) {
    console.error('Error fetching analyses:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch analyses',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { ids } = data;

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete analyses
    await prisma.analysis.deleteMany({
      where: {
        id: { in: ids },
        userId: user.id
      }
    });

    return NextResponse.json({ 
      success: true,
      message: `Successfully deleted ${ids.length} analyses`
    });

  } catch (error) {
    console.error('Error deleting analyses:', error);
    return NextResponse.json({ 
      error: 'Failed to delete analyses',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 