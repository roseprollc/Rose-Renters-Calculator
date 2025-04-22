import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/route'
import { updateAnalysisNotes } from '@/app/lib/analyses'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { notes } = await request.json()
    
    if (typeof notes !== 'string') {
      return NextResponse.json({ error: 'Invalid notes' }, { status: 400 })
    }

    await updateAnalysisNotes(params.id, notes)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating notes:', error)
    return NextResponse.json(
      { error: 'Failed to update notes' },
      { status: 500 }
    )
  }
} 