import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { clientPromise, stringToObjectId } from '@/app/lib/mongodb'
import { ObjectId } from 'mongodb'

// GET an analysis by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const client = await clientPromise
    const db = client.db()
    
    const analysis = await db.collection('analyses').findOne({ 
      _id: stringToObjectId(params.id),
      userId: session.user.id
    })
    
    if (!analysis) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 })
    }
    
    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error fetching analysis:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH (update) an analysis
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const client = await clientPromise
    const db = client.db()
    
    // Find the analysis to ensure it exists and belongs to the user
    const existingAnalysis = await db.collection('analyses').findOne({ 
      _id: stringToObjectId(params.id),
      userEmail: session.user.email
    })
    
    if (!existingAnalysis) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 })
    }
    
    // Update the analysis with the new data
    const result = await db.collection('analyses').updateOne(
      { _id: stringToObjectId(params.id) },
      { $set: body }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating analysis:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE an analysis
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    if (!id) {
      return NextResponse.json(
        { error: 'Analysis ID is required' },
        { status: 400 }
      )
    }
    
    const client = await clientPromise
    const db = client.db()
    
    const result = await db.collection('analyses').deleteOne({
      _id: new ObjectId(id),
      userId: session.user.email
    })
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting analysis:', error)
    return NextResponse.json(
      { error: 'Failed to delete analysis' },
      { status: 500 }
    )
  }
} 