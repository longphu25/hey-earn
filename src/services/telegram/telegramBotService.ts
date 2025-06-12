import { Telegraf, Markup } from 'telegraf';
import dotenv from 'dotenv';
import {
  getUserBalance,
  recordEarning,
  recordSpending,
  getUserTransactions,
  getUserPreferences,
  setUserPreferences,
  availableSkills,
  ListingType,
  getUsersForNotification,
} from './botDatabaseHelper';

// Load environment variables
dotenv.config();

// Interfaces for Earn listings
interface Listing {
  id: string;
  title: string;
  sponsor: string;
  rewardToken: string;
  rewardValue: number;
  usdValue: number;
  variableCompensation: boolean;
  rewardRange?: { min: number; max: number };
  url: string;
  deadline: Date;
  type: 'Bounty' | 'Project';
  skills: string[];
  geography: string | null;
  publishedAt: Date;
}

export class TelegramBotService {
  private bot: Telegraf;
  private static instance: TelegramBotService;

  // Store user's current menu state
  private userStates: Record<
    number,
    {
      action: string;
      data?: any;
    }
  > = {};

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
      const userId = ctx.from?.id;
      if (!userId) return;

      ctx.reply(
        'Welcome to Superteam Earn Notification Bot! 🚀\n\n' +
          'I will notify you about new opportunities on Superteam Earn that match your preferences.\n\n' +
          'Use /setup to configure your notification preferences.',
        Markup.keyboard([['🔧 Setup Preferences'], ['👀 View Preferences', '❓ Help']]).resize()
      );
    });

    this.bot.command('help', (ctx) => {
      ctx.reply(
        'Here are the available commands:\n\n' +
          '/start - Start the bot\n' +
          '/setup - Configure your notification preferences\n' +
          '/preferences - View your current notification preferences\n' +
          '/help - Show this help message\n\n' +
          'You will receive notifications about new opportunities on Superteam Earn that match your preferences!'
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

    this.bot.command('setup', this.handleSetupCommand.bind(this));
    this.bot.command('preferences', this.handlePreferencesCommand.bind(this));

    // Handle text messages for interactive menu
    this.bot.hears('🔧 Setup Preferences', this.handleSetupCommand.bind(this));
    this.bot.hears('👀 View Preferences', this.handlePreferencesCommand.bind(this));
    this.bot.hears('❓ Help', (ctx) => {
      ctx.reply(
        'Here are the available commands:\n\n' +
          '/start - Start the bot\n' +
          '/setup - Configure your notification preferences\n' +
          '/preferences - View your current notification preferences\n' +
          '/help - Show this help message\n\n' +
          'You will receive notifications about new opportunities on Superteam Earn that match your preferences!'
      );
    });

    // Handle callback queries for preferences configuration
    this.bot.action(/^listingType:(.+)$/, this.handleListingTypeSelection.bind(this));
    this.bot.action(/^minUsd:(.+)$/, this.handleMinUsdSelection.bind(this));
    this.bot.action(/^maxUsd:(.+)$/, this.handleMaxUsdSelection.bind(this));
    this.bot.action(/^skill:(.+)$/, this.handleSkillSelection.bind(this));
    this.bot.action('savePreferences', this.handleSavePreferences.bind(this));
    this.bot.action('resetPreferences', this.handleResetPreferences.bind(this));
    this.bot.action('back', (ctx) => {
      ctx.answerCbQuery();
      this.handleSetupCommand(ctx);
    });

    // Legacy commands (for backward compatibility)
    this.bot.command('balance', async (ctx) => {
      const userId = ctx.from?.id;
      if (!userId) return;

      const balance = await getUserBalance(userId);
      ctx.reply(`Your current balance is: $${balance}`);
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

  public async handleUpdate(update: any): Promise<void> {
    // We have to use 'any' here because the correct type is not easily importable
    // from the telegraf library without additional setup
    await this.bot.handleUpdate(update);
  }

  /**
   * Launch the bot in webhook mode
   */
  public async startWebhook(webhookUrl: string): Promise<void> {
    // Logic to set up webhook
    await this.bot.telegram.setWebhook(webhookUrl);
  }

  /**
   * Launch the bot in polling mode (for development)
   */
  public async startPolling(): Promise<void> {
    // Start polling for updates
    this.bot.launch();
  }

  // Handler for setup command
  private async handleSetupCommand(ctx: any): Promise<void> {
    const userId = ctx.from?.id;
    if (!userId) return;

    // Set user state
    this.userStates[userId] = { action: 'setup' };

    await ctx.reply(
      "🔧 Let's set up your notification preferences. What type of listings do you want to be notified about?",
      Markup.inlineKeyboard([
        [
          Markup.button.callback('Bounties', 'listingType:Bounty'),
          Markup.button.callback('Projects', 'listingType:Project'),
          Markup.button.callback('Both', 'listingType:All'),
        ],
      ])
    );
  }

  // Handler for preferences command
  private async handlePreferencesCommand(ctx: any): Promise<void> {
    const userId = ctx.from?.id;
    if (!userId) return;

    const prefs = await getUserPreferences(userId);

    if (!prefs) {
      return ctx.reply(
        "You haven't set up your preferences yet. Use /setup to configure them.",
        Markup.keyboard([['🔧 Setup Preferences'], ['❓ Help']]).resize()
      );
    }

    const skillsText = prefs.skills.length > 0 ? prefs.skills.join(', ') : 'All skills';

    const maxUsdText = prefs.maxUsdValue === null ? 'No upper limit' : `$${prefs.maxUsdValue}`;

    await ctx.reply(
      `📊 Your current notification preferences:\n\n` +
        `Listing Type: ${prefs.listingTypes}\n` +
        `USD Value Range: $${prefs.minUsdValue} - ${maxUsdText}\n` +
        `Skills: ${skillsText}\n` +
        `Status: ${prefs.active ? '✅ Active' : '❌ Inactive'}\n\n` +
        `Use /setup to update your preferences.`,
      Markup.keyboard([['🔧 Setup Preferences'], ['❓ Help']]).resize()
    );
  }

  // Handler for listing type selection
  private async handleListingTypeSelection(ctx: any): Promise<void> {
    const userId = ctx.from?.id;
    if (!userId) return;

    const match = ctx.match[1] as ListingType;

    // Set temporary user preference
    this.userStates[userId] = {
      action: 'setup_min_usd',
      data: { listingTypes: match },
    };

    await ctx.answerCbQuery(`Selected: ${match}`);

    await ctx.editMessageText(
      `Selected listing type: ${match}\n\n` +
        `Now, what's the minimum USD value you're interested in?`,
      Markup.inlineKeyboard([
        [
          Markup.button.callback('$0', 'minUsd:0'),
          Markup.button.callback('$100', 'minUsd:100'),
          Markup.button.callback('$500', 'minUsd:500'),
        ],
        [
          Markup.button.callback('$1000', 'minUsd:1000'),
          Markup.button.callback('$2000', 'minUsd:2000'),
          Markup.button.callback('$5000', 'minUsd:5000'),
        ],
      ])
    );
  }

  // Handler for minimum USD selection
  private async handleMinUsdSelection(ctx: any): Promise<void> {
    const userId = ctx.from?.id;
    if (!userId) return;

    const minUsdValue = parseInt(ctx.match[1], 10);

    // Update temporary user preference
    this.userStates[userId] = {
      action: 'setup_max_usd',
      data: {
        ...this.userStates[userId]?.data,
        minUsdValue,
      },
    };

    await ctx.answerCbQuery(`Selected: $${minUsdValue}`);

    await ctx.editMessageText(
      `Selected minimum USD value: $${minUsdValue}\n\n` +
        `What's the maximum USD value you're interested in?`,
      Markup.inlineKeyboard([
        [
          Markup.button.callback('$1000', 'maxUsd:1000'),
          Markup.button.callback('$5000', 'maxUsd:5000'),
          Markup.button.callback('$10000', 'maxUsd:10000'),
        ],
        [
          Markup.button.callback('$20000', 'maxUsd:20000'),
          Markup.button.callback('$50000', 'maxUsd:50000'),
          Markup.button.callback('No Limit', 'maxUsd:null'),
        ],
      ])
    );
  }

  // Handler for maximum USD selection
  private async handleMaxUsdSelection(ctx: any): Promise<void> {
    const userId = ctx.from?.id;
    if (!userId) return;

    const maxUsdStr = ctx.match[1];
    const maxUsdValue = maxUsdStr === 'null' ? null : parseInt(maxUsdStr, 10);

    // Update temporary user preference
    this.userStates[userId] = {
      action: 'setup_skills',
      data: {
        ...this.userStates[userId]?.data,
        maxUsdValue,
      },
    };

    await ctx.answerCbQuery(`Selected: ${maxUsdValue === null ? 'No Limit' : '$' + maxUsdValue}`);

    // Create buttons for skills in rows of 2
    const skillButtons = [];
    for (let i = 0; i < availableSkills.length; i += 2) {
      const row = [];
      if (i < availableSkills.length) {
        row.push(Markup.button.callback(availableSkills[i], `skill:${availableSkills[i]}`));
      }
      if (i + 1 < availableSkills.length) {
        row.push(Markup.button.callback(availableSkills[i + 1], `skill:${availableSkills[i + 1]}`));
      }
      skillButtons.push(row);
    }

    // Add the "Save" and "All Skills" buttons as the last row
    skillButtons.push([
      Markup.button.callback('All Skills', 'savePreferences'),
      Markup.button.callback('Reset', 'resetPreferences'),
    ]);

    const selectedSkills = this.userStates[userId]?.data?.skills || [];

    await ctx.editMessageText(
      `Selected maximum USD value: ${maxUsdValue === null ? 'No Limit' : '$' + maxUsdValue}\n\n` +
        `Now, choose the skills you're interested in:\n` +
        (selectedSkills.length > 0 ? `Selected: ${selectedSkills.join(', ')}\n\n` : '') +
        `Click "All Skills" when you're done, or to receive notifications for all skills.`,
      Markup.inlineKeyboard(skillButtons)
    );
  }

  // Handler for skill selection
  private async handleSkillSelection(ctx: any): Promise<void> {
    const userId = ctx.from?.id;
    if (!userId) return;

    const skill = ctx.match[1];

    // Initialize skills array if it doesn't exist
    if (!this.userStates[userId]?.data?.skills) {
      this.userStates[userId] = {
        ...this.userStates[userId],
        data: {
          ...this.userStates[userId]?.data,
          skills: [],
        },
      };
    }

    // Toggle skill selection
    const skills = this.userStates[userId]?.data?.skills || [];
    const skillIndex = skills.indexOf(skill);

    if (skillIndex === -1) {
      // Add skill if not already selected
      skills.push(skill);
      await ctx.answerCbQuery(`Added: ${skill}`);
    } else {
      // Remove skill if already selected
      skills.splice(skillIndex, 1);
      await ctx.answerCbQuery(`Removed: ${skill}`);
    }

    // Update user state with modified skills
    this.userStates[userId] = {
      ...this.userStates[userId],
      data: {
        ...this.userStates[userId]?.data,
        skills,
      },
    };

    // Create buttons for skills in rows of 2
    const skillButtons = [];
    for (let i = 0; i < availableSkills.length; i += 2) {
      const row = [];
      if (i < availableSkills.length) {
        const skill1 = availableSkills[i];
        const isSelected1 = skills.includes(skill1);
        row.push(Markup.button.callback(`${isSelected1 ? '✅ ' : ''}${skill1}`, `skill:${skill1}`));
      }
      if (i + 1 < availableSkills.length) {
        const skill2 = availableSkills[i + 1];
        const isSelected2 = skills.includes(skill2);
        row.push(Markup.button.callback(`${isSelected2 ? '✅ ' : ''}${skill2}`, `skill:${skill2}`));
      }
      skillButtons.push(row);
    }

    // Add the "Save" button as the last row
    skillButtons.push([
      Markup.button.callback('Save Preferences', 'savePreferences'),
      Markup.button.callback('Reset', 'resetPreferences'),
    ]);

    // Reconstruct the previous message
    const minUsdValue = this.userStates[userId]?.data?.minUsdValue;
    const maxUsdValue = this.userStates[userId]?.data?.maxUsdValue;

    await ctx.editMessageText(
      `Your preferences:\n` +
        `Minimum USD value: $${minUsdValue}\n` +
        `Maximum USD value: ${maxUsdValue === null ? 'No Limit' : '$' + maxUsdValue}\n\n` +
        `Selected skills: ${skills.length > 0 ? skills.join(', ') : 'None'}\n\n` +
        `Click "Save Preferences" when you're done.`,
      Markup.inlineKeyboard(skillButtons)
    );
  }

  // Handler for saving preferences
  private async handleSavePreferences(ctx: any): Promise<void> {
    const userId = ctx.from?.id;
    if (!userId) return;

    // Get temporary user preferences
    const tempPrefs = this.userStates[userId]?.data;

    if (!tempPrefs) {
      await ctx.answerCbQuery('No preferences to save');
      return;
    }

    // Save user preferences
    await setUserPreferences(userId, {
      listingTypes: tempPrefs.listingTypes || 'All',
      minUsdValue: tempPrefs.minUsdValue || 0,
      maxUsdValue: tempPrefs.maxUsdValue,
      skills: tempPrefs.skills || [],
      active: true,
      geography: null, // This can be set based on user's Earn profile in the future
    });

    // Clear user state
    delete this.userStates[userId];

    await ctx.answerCbQuery('Preferences saved!');

    await ctx.editMessageText(
      '✅ Your notification preferences have been saved!\n\n' +
        'You will now receive notifications for new opportunities on Superteam Earn that match your preferences.\n\n' +
        'Use /preferences to view your current settings or /setup to change them.',
      Markup.inlineKeyboard([[Markup.button.callback('View Preferences', 'preferences')]])
    );
  }

  // Handler for resetting preferences
  private async handleResetPreferences(ctx: any): Promise<void> {
    const userId = ctx.from?.id;
    if (!userId) return;

    // Clear user state
    delete this.userStates[userId];

    await ctx.answerCbQuery('Preferences reset');

    // Start setup process again
    await this.handleSetupCommand(ctx);
  }

  // Send a notification to a user about a new listing
  public async sendListingNotification(userId: number, listing: Listing): Promise<void> {
    try {
      // Format the reward text
      let rewardText = '';
      if (listing.variableCompensation) {
        rewardText = 'Variable Compensation';
      } else if (listing.rewardRange) {
        rewardText = `${listing.rewardToken} ${listing.rewardRange.min} - ${listing.rewardRange.max} (~$${listing.usdValue})`;
      } else {
        rewardText = `${listing.rewardToken} ${listing.rewardValue} (~$${listing.usdValue})`;
      }

      // Format deadline
      const deadline = new Date(listing.deadline);
      const deadlineStr = deadline.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      // Add UTM parameter to the URL
      const trackingUrl = listing.url.includes('?')
        ? `${listing.url}&utm_source=telegrambot`
        : `${listing.url}?utm_source=telegrambot`;

      // Send the notification
      await this.bot.telegram.sendMessage(
        userId,
        `🔔 *New ${listing.type} on Superteam Earn!*\n\n` +
          `*${listing.title}*\n` +
          `From: ${listing.sponsor}\n` +
          `Reward: ${rewardText}\n` +
          `Deadline: ${deadlineStr}\n\n` +
          `[View Details](${trackingUrl})`,
        { parse_mode: 'Markdown' }
      );
    } catch (error) {
      console.error(`Failed to send notification to user ${userId}:`, error);
    }
  }

  // This method will be called by a scheduled job to send notifications for new listings
  public async processNewListings(listings: Listing[]): Promise<void> {
    for (const listing of listings) {
      // Check if the listing was published 12 hours ago
      const now = new Date();
      const publishedAt = new Date(listing.publishedAt);
      const hoursElapsed = (now.getTime() - publishedAt.getTime()) / (1000 * 60 * 60);

      if (hoursElapsed < 11.5 || hoursElapsed > 12.5) {
        continue; // Skip if not around 12 hours since publishing
      }

      // Get users who should be notified about this listing
      const userIds = await getUsersForNotification({
        usdValue: listing.usdValue,
        type: listing.type,
        skills: listing.skills,
        geography: listing.geography,
      });

      // Send notifications
      for (const userId of userIds) {
        await this.sendListingNotification(userId, listing);
      }
    }
  }
}
