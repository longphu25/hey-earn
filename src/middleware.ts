import { NextResponse, type NextRequest } from 'next/server';
import { initializeTelegramBot } from './services';

// Initialize the bot once
let botInitialized = false;

export async function middleware(request: NextRequest) {
  // Only initialize the bot once during server startup
  if (!botInitialized && process.env.NODE_ENV !== 'production') {
    try {
      await initializeTelegramBot();
      botInitialized = true;
      console.log('Telegram bot initialized via middleware');
      console.log(request.url);
    } catch (error) {
      console.error('Failed to initialize Telegram bot:', error);
    }
  }

  return NextResponse.next();
}

// Only run middleware for specific paths
export const config = {
  matcher: ['/api/:path*'],
};
