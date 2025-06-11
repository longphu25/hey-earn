import { TelegramBotService } from '@/services/telegram';

/**
 * This function is called when the server starts in production mode
 */
export async function setupTelegramWebhook() {
  try {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') {
      console.log('Skipping webhook setup in development mode');
      return;
    }

    const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error('TELEGRAM_WEBHOOK_URL is not defined');
      return;
    }

    const telegramService = TelegramBotService.getInstance();
    await telegramService.startWebhook(webhookUrl);

    console.log('Telegram webhook setup complete');
  } catch (error) {
    console.error('Failed to set up Telegram webhook:', error);
  }
}

// If this file is executed directly (e.g., via a script)
if (require.main === module) {
  setupTelegramWebhook()
    .then(() => {
      console.log('Webhook setup script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Webhook setup script failed:', error);
      process.exit(1);
    });
}
