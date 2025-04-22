import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { nanoid } from 'nanoid';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { cookies } from 'next/headers';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const authToken = cookieStore.get('auth_token');

  if (!authToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const analysis = await prisma.analysis.findFirst({
      where: { publicId: params.id },
      include: {
        versions: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!analysis) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
    }

    // Return only necessary data for public view
    const publicAnalysis = {
      type: analysis.type,
      data: analysis.data,
      propertyAddress: analysis.propertyAddress,
      versions: analysis.versions,
      createdAt: analysis.createdAt,
    };

    return NextResponse.json({ analysis: publicAnalysis });
  } catch (error) {
    console.error('Error fetching shared analysis:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const analysis = await prisma.analysis.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      }
    });

    if (!analysis) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
    }

    // Generate public ID if not exists
    if (!analysis.publicId) {
      const updatedAnalysis = await prisma.analysis.update({
        where: { id: params.id },
        data: {
          publicId: nanoid(10),
          isPublic: true
        }
      });

      const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL}/shared/analysis/${updatedAnalysis.publicId}`;
      return NextResponse.json({ publicUrl });
    }

    const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL}/shared/analysis/${analysis.publicId}`;
    return NextResponse.json({ publicUrl });
  } catch (error) {
    console.error('Share analysis error:', error);
    return NextResponse.json({ error: 'Failed to share analysis' }, { status: 500 });
  }
} 