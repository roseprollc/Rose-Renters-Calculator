import { NextResponse } from 'next/server';
import { clientPromise } from '@/app/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Test the connection by running a simple command
    const result = await db.command({ ping: 1 });
    
    if (result.ok === 1) {
      return NextResponse.json({ 
        status: 'success',
        message: 'Successfully connected to MongoDB',
        result 
      });
    } else {
      throw new Error('MongoDB ping failed');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json({ 
      status: 'error',
      message: 'Failed to connect to MongoDB',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 