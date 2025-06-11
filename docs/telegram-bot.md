# Telegram Bot Integration

This document explains how the Telegram bot for Hey Earn works and how to set it up.

## Overview

The Hey Earn Telegram bot allows users to track their earnings and expenses directly from Telegram. Users can interact with the bot using commands to record transactions and view their financial information.

## Bot Commands

The bot supports the following commands:

- `/start` - Start the bot and get a welcome message
- `/help` - Display a list of available commands
- `/balance` - Check your current balance
- `/earn [amount] [description]` - Record an earning
- `/spend [amount] [description]` - Record an expense
- `/history` - View your recent transactions

## Setting Up the Bot

### Development Setup

1. Create a Telegram bot using BotFather:
   - Open Telegram and search for `@BotFather`
   - Start a chat and send `/newbot`
   - Follow the instructions to create a bot named "hey_earn_bot"
   - Save the API token provided by BotFather

2. Run the setup script in this repository:
   ```bash
   pnpm setup:telegram-bot
   ```

3. The script will prompt you for your bot token and set up the necessary environment variables.

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. In development mode, the bot will run in polling mode, so you can immediately interact with it in Telegram.

### Production Setup

For production deployment, you need to:

1. Set the following environment variables in your Vercel project:
   - `TELEGRAM_BOT_TOKEN` - Your bot token from BotFather
   - `TELEGRAM_SECRET_TOKEN` - A random secret token for webhook security
   - `TELEGRAM_WEBHOOK_URL` - The URL for your bot webhook (e.g., `https://yourdomain.com/api/telegram/webhook`)

2. Deploy your application. The bot will automatically set up webhook mode in production.

## Architecture

The bot is built using:

- [Telegraf](https://github.com/telegraf/telegraf) - Modern Telegram Bot API framework for Node.js
- Next.js API routes for webhook handling

The code structure is:

```
src/
  services/
    telegram/
      telegramBotService.ts  - Main bot service
      botDatabaseHelper.ts   - Helper for database operations
      bootstrapper.ts        - Bot initialization logic
  app/
    api/
      telegram/
        webhook/
          route.ts           - Webhook endpoint for Telegram updates
```

## Future Improvements

- Replace the in-memory storage with a real database
- Add authentication to link Telegram users with app accounts
- Add more commands for financial reporting and analytics
