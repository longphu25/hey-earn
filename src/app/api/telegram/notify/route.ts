import { NextRequest, NextResponse } from 'next/server';
import { processNewListingsJob } from '@/services/telegram/scheduledJobs';

// This secret key should be set in the environment variables
const API_SECRET_KEY = process.env.API_SECRET_KEY;

export const dynamic = 'force-dynamic'; // Ensure this route is always dynamic

export async function POST(req: NextRequest) {
  try {
    // Check for authorization
    const authHeader = req.headers.get('authorization');

    if (
      !authHeader ||
      !API_SECRET_KEY ||
      !authHeader.startsWith('Bearer ') ||
      authHeader !== `Bearer ${API_SECRET_KEY}`
    ) {
      console.error('Unauthorized request to notifications job');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Run the job to process new listings and send notifications
    await processNewListingsJob();

    return NextResponse.json({ success: true, message: 'Notifications job executed successfully' });
  } catch (error) {
    console.error('Error running notifications job:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
