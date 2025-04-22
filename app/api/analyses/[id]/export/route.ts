import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/route'
import { exportAnalysis } from '@/app/lib/analyses'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') as 'pdf' | 'csv'
    
    if (!format || !['pdf', 'csv'].includes(format)) {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
    }

    const blob = await exportAnalysis(params.id, format)
    
    return new NextResponse(blob, {
      headers: {
        'Content-Type': format === 'pdf' ? 'application/pdf' : 'text/csv',
        'Content-Disposition': `attachment; filename=analysis-${params.id}.${format}`
      }
    })
  } catch (error) {
    console.error('Error exporting analysis:', error)
    return NextResponse.json(
      { error: 'Failed to export analysis' },
      { status: 500 }
    )
  }
} 