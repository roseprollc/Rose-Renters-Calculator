import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { prisma } from '@/app/lib/prisma';

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ids } = await req.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Analysis IDs array is required' },
        { status: 400 }
      );
    }

    const result = await prisma.analysis.deleteMany({
      where: {
        id: { in: ids },
        userId: session.user.id
      }
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: 'No analyses found to delete' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      deletedCount: result.count
    });
  } catch (error) {
    console.error('Error bulk deleting analyses:', error);
    return NextResponse.json(
      { error: 'Failed to delete analyses' },
      { status: 500 }
    );
  }
} 