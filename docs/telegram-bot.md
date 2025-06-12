# Superteam Earn Telegram Notification Bot

This document explains how the Telegram notification bot for Superteam Earn works and how to set it up.

## Overview

The Superteam Earn Telegram notification bot provides users with personalized alerts for new bounties and projects published on the platform. Users can configure their preferences to receive notifications based on USD value, listing type, and specific skills.

## Features

- **Personalized Notifications**: Users receive alerts for new opportunities on Superteam Earn that match their preferences.
- **Customizable Filters**: Users can configure notifications based on:
  - USD value range
  - Listing type (Bounties, Projects, or both)
  - Specific skills
- **Seamless User Experience**: Accessible via a direct link from the Superteam Earn user menu.
- **Rich Notifications**: Each notification includes:
  - Title of the listing
  - Sponsor's name
  - Reward token name and value
  - Reward amount in USD
  - Variable compensation or range information
  - Direct link to the listing with UTM tracking
  - Deadline for the listing

## Bot Commands

The bot supports the following commands:

- `/start` - Start the bot and get a welcome message
- `/help` - Display a list of available commands
- `/setup` - Configure notification preferences
- `/preferences` - View current notification settings

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
   - `API_SECRET_KEY` - A secret key to secure the notification API endpoint
   - `DATABASE_URL` - Connection string for the Superteam Earn database (if applicable)

2. Deploy your application. The bot will automatically set up webhook mode in production.

3. Set up a scheduled job to trigger notifications 12 hours after listings are published:
   - For Vercel, add a cron job in your `vercel.json`:
     ```json
     {
       "crons": [
         {
           "path": "/api/telegram/notify",
           "schedule": "0 */1 * * *"
         }
       ]
     }
     ```
   - This will check for new listings every hour and send notifications for those published 12 hours ago.
   - The endpoint is secured with the `API_SECRET_KEY` header.

## Architecture

The bot is built using:

- [Telegraf](https://github.com/telegraf/telegraf) - Modern Telegram Bot API framework for Node.js
- Next.js API routes for webhook handling

The code structure is:

```
src/
  services/
    telegram/
      telegramService.ts  - Main bot service for notifications
      scheduledJobs.ts    - Job to process listings and send notifications
      bootstrapper.ts     - Bot initialization logic
  app/
    api/
      telegram/
        webhook/
          route.ts        - Webhook endpoint for Telegram updates
        notify/
          route.ts        - Endpoint to trigger notification processing
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
