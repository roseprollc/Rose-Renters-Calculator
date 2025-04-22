import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { clientPromise } from '@/app/lib/mongodb';
import { Analysis } from '@/app/types/analysis';
import { generatePDF } from '@/app/lib/pdfGenerator';
import { sendEmail } from '@/app/lib/email';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { testMode = false } = await req.json();
    const client = await clientPromise;
    const db = client.db();

    // Get user's digest preferences
    const user = await db.collection('users').findOne({ email: session.user.email });
    if (!user?.digestPreferences?.enabled) {
      return NextResponse.json({ error: 'Digest not enabled' }, { status: 400 });
    }

    // Get analyses from the last week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const analyses = await db.collection('analyses')
      .find({
        userId: session.user.email,
        createdAt: { $gte: oneWeekAgo },
        type: { $in: user.digestPreferences.analysisTypes }
      })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray() as Analysis[];

    if (analyses.length === 0) {
      return NextResponse.json({ message: 'No analyses to include in digest' });
    }

    // Generate PDF report
    const pdfBuffer = await generatePDF(analyses, user.digestPreferences);

    // Send email
    if (!testMode) {
      await sendEmail({
        to: session.user.email,
        subject: 'Your Weekly Analysis Digest',
        text: `Here's your weekly analysis digest with ${analyses.length} properties.`,
        attachments: [{
          filename: 'analysis-digest.pdf',
          content: pdfBuffer
        }]
      });
    }

    return NextResponse.json({
      message: testMode ? 'Test digest generated' : 'Digest sent',
      analysisCount: analyses.length
    });
  } catch (error) {
    console.error('Digest error:', error);
    return NextResponse.json(
      { error: 'Failed to generate digest' },
      { status: 500 }
    );
  }
} 