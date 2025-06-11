import { NextRequest, NextResponse } from 'next/server';
import { TelegramBotService } from '@/services/telegram';

// Secret token to authenticate Telegram webhook requests
const TELEGRAM_SECRET_TOKEN = process.env.TELEGRAM_SECRET_TOKEN;

export const dynamic = 'force-dynamic'; // Ensure this route is always dynamic

export async function POST(req: NextRequest) {
  try {
    // Validate the secret token from the header
    const secretHeader = req.headers.get('x-telegram-bot-api-secret-token');

    if (TELEGRAM_SECRET_TOKEN && secretHeader !== TELEGRAM_SECRET_TOKEN) {
      console.error('Invalid secret token in Telegram webhook request');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    // Parse the update object from the request
    const update = await req.json();

    // Process the update with our bot service
    const telegramService = TelegramBotService.getInstance();
    await telegramService.handleUpdate(update);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling Telegram webhook:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
