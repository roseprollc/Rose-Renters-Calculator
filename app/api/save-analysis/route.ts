import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { clientPromise } from '@/app/lib/mongodb';
import { Analysis } from '@/app/types/analysis';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const userId = session.user.id;

    // Validate required fields
    if (!data.propertyUrl || !data.propertyAddress || !data.propertyPrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();

    // Create analysis document
    const analysis = {
      ...data,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('analyses').insertOne(analysis);

    return NextResponse.json({
      id: result.insertedId,
      ...analysis
    });
  } catch (error) {
    console.error('Save analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to save analysis' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();

    // Get query parameters
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const query = searchParams.get('query') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build search query
    const searchQuery = query
      ? {
          userId,
          $or: [
            { propertyAddress: { $regex: query, $options: 'i' } },
            { propertyUrl: { $regex: query, $options: 'i' } }
          ]
        }
      : { userId };

    // Fetch analyses with pagination
    const analyses = await db
      .collection('analyses')
      .find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count for pagination
    const total = await db.collection('analyses').countDocuments(searchQuery);

    return NextResponse.json({
      analyses,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get analyses error:', error);
    return NextResponse.json(
      { error: 'Failed to get analyses' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or empty analysis IDs' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();

    // Delete analyses
    const result = await db.collection('analyses').deleteMany({
      _id: { $in: ids.map(id => new ObjectId(id)) },
      userId
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'No analyses found to delete' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Delete analyses error:', error);
    return NextResponse.json(
      { error: 'Failed to delete analyses' },
      { status: 500 }
    );
  }
} 