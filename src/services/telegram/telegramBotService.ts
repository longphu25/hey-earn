import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import {
  getUserBalance,
  recordEarning,
  recordSpending,
  getUserTransactions,
} from './botDatabaseHelper';

// Load environment variables
dotenv.config();

export class TelegramBotService {
  private bot: Telegraf;
  private static instance: TelegramBotService;

  private constructor() {
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not defined in environment variables');
    }

    this.bot = new Telegraf(token);
    this.setupCommands();
    this.setupListeners();
  }

  public static getInstance(): TelegramBotService {
    if (!TelegramBotService.instance) {
      TelegramBotService.instance = new TelegramBotService();
    }

    return TelegramBotService.instance;
  }

  private setupCommands() {
    // Set up bot commands
    this.bot.command('start', (ctx) => {
      ctx.reply('Welcome to Hey Earn Bot! 🚀 I can help you track earnings and manage finances.');
    });

    this.bot.command('help', (ctx) => {
      ctx.reply(
        'Here are the available commands:\n' +
          '/start - Start the bot\n' +
          '/help - Show this help message\n' +
          '/balance - Check your current balance\n' +
          '/earn [amount] [description] - Record an earning\n' +
          '/spend [amount] [description] - Record an expense\n' +
          '/history - View your recent transactions'
      );
    });

    this.bot.command('balance', async (ctx) => {
      const userId = ctx.from?.id;
      if (!userId) {
        ctx.reply('Could not identify user.');
        return;
      }

      const balance = await getUserBalance(userId);
      ctx.reply(`Your current balance is $${balance.toFixed(2)}`);
    });

    this.bot.command('earn', async (ctx) => {
      const message = ctx.message.text;
      const parts = message.split(' ');
      const userId = ctx.from?.id;

      if (!userId) {
        ctx.reply('Could not identify user.');
        return;
      }

      if (parts.length < 2) {
        ctx.reply('Please provide an amount: /earn [amount] [description]');
        return;
      }

      const amount = parseFloat(parts[1]);
      const description = parts.slice(2).join(' ') || 'No description';

      if (isNaN(amount)) {
        ctx.reply('Please provide a valid amount');
        return;
      }

      const newBalance = await recordEarning(userId, amount, description);
      ctx.reply(
        `Recorded earning of $${amount.toFixed(2)} for "${description}"\nYour new balance is $${newBalance.toFixed(2)}`
      );
    });

    this.bot.command('spend', async (ctx) => {
      const message = ctx.message.text;
      const parts = message.split(' ');
      const userId = ctx.from?.id;

      if (!userId) {
        ctx.reply('Could not identify user.');
        return;
      }

      if (parts.length < 2) {
        ctx.reply('Please provide an amount: /spend [amount] [description]');
        return;
      }

      const amount = parseFloat(parts[1]);
      const description = parts.slice(2).join(' ') || 'No description';

      if (isNaN(amount)) {
        ctx.reply('Please provide a valid amount');
        return;
      }

      const newBalance = await recordSpending(userId, amount, description);
      ctx.reply(
        `Recorded expense of $${amount.toFixed(2)} for "${description}"\nYour new balance is $${newBalance.toFixed(2)}`
      );
    });

    this.bot.command('history', async (ctx) => {
      const userId = ctx.from?.id;
      if (!userId) {
        ctx.reply('Could not identify user.');
        return;
      }

      const transactions = await getUserTransactions(userId);

      if (transactions.length === 0) {
        ctx.reply('No transactions found.');
        return;
      }

      const historyText = transactions
        .map((t, index) => {
          const date = t.timestamp.toLocaleDateString();
          const type = t.type === 'earn' ? '➕' : '➖';
          return `${index + 1}. ${type} $${t.amount.toFixed(2)} - ${t.description} (${date})`;
        })
        .join('\n');

      ctx.reply(`Your recent transactions:\n\n${historyText}`);
    });
  }

  private setupListeners() {
    // Handle regular messages
    this.bot.on('text', (ctx) => {
      const messageText = ctx.message.text;

      // Ignore commands which are handled separately
      if (messageText.startsWith('/')) {
        return;
      }

      ctx.reply('I received your message. Use /help to see available commands.');
    });
  }

  /**
   * Process an update from the webhook
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async handleUpdate(update: any): Promise<void> {
    // We have to use 'any' here because the correct type is not easily importable
    // from the telegraf library without additional setup
    await this.bot.handleUpdate(update);
  }

  /**
   * Launch the bot in webhook mode
   */
  public async startWebhook(webhookUrl: string): Promise<void> {
    await this.bot.telegram.setWebhook(webhookUrl);
    console.log(`Telegram webhook set to: ${webhookUrl}`);
  }

  /**
   * Launch the bot in polling mode (for development)
   */
  public async startPolling(): Promise<void> {
    // Remove any existing webhook
    await this.bot.telegram.deleteWebhook();
    // Start polling
    await this.bot.launch();
    console.log('Telegram bot started in polling mode');

    // Enable graceful stop
    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
  }
}
