import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/app/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { 
      calculatorType,
      propertyUrl,
      propertyPrice,
      analytics,
      ...otherData
    } = data;

    if (!calculatorType || !analytics) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      // Create user if they don't exist
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || session.user.email.split('@')[0],
        }
      });
    }

    // Create the analysis with the user
    const newAnalysis = await prisma.analysis.create({
      data: {
        userId: user.id,
        propertyAddress: propertyUrl || 'Manual Entry',
        type: calculatorType,
        data: {
          ...otherData,
          propertyPrice,
          analytics
        },
        versions: {
          create: {
            data: {
              ...otherData,
              propertyPrice,
              analytics
            }
          }
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      analysisId: newAnalysis.id,
      message: 'Report saved successfully'
    });
  } catch (error) {
    console.error('Error saving analysis:', error);
    // More detailed error handling
    let errorMessage = 'Failed to save report';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('Foreign key constraint failed')) {
        errorMessage = 'User authentication error';
        statusCode = 401;
      } else if (error.message.includes('Unique constraint failed')) {
        errorMessage = 'Report already exists';
        statusCode = 409;
      }
    }

    return NextResponse.json({ 
      error: errorMessage,
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: statusCode });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const analyses = await prisma.analysis.findMany({
      where: {
        userId: session.user.id
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
    });

    return NextResponse.json({ reports: analyses });
  } catch (error) {
    console.error('Error fetching analyses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 