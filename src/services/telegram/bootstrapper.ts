import { TelegramService } from '@/services/telegram/telegramService';

/**
 * Initialize the Telegram bot service
 * In production, we set up the webhook
 * In development, we use polling mode
 */
export async function initializeTelegramBot() {
  try {
    const telegramService = TelegramService.getInstance();

    const isProd = process.env.NODE_ENV === 'production';
    const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;

    if (isProd && webhookUrl) {
      // In production, use webhook mode
      await telegramService.startWebhook(webhookUrl);
      console.log('Telegram bot initialized in webhook mode');
    } else if (!isProd) {
      // In development, use polling mode
      await telegramService.startPolling();
      console.log('Telegram bot initialized in polling mode');
    } else {
      console.warn('Skipping Telegram bot initialization: Missing webhook URL in production');
    }
  } catch (error) {
    console.error('Failed to initialize Telegram bot:', error);
  }
}
