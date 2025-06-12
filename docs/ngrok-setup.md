# Using Ngrok with Hey-Earn

This guide explains how to use ngrok to create a secure tunnel to your local development server.

## Why Use Ngrok?

- Test webhook integrations (like Telegram bots) without deploying
- Share your development work with others
- Bypass CORS restrictions when testing API integrations
- Test your app on multiple devices

## Prerequisites

1. Install ngrok as a development dependency:
   ```bash
   pnpm add -D ngrok
   ```

## Using the Built-in Script

We've added a convenient script to start both the Next.js development server and ngrok:

```bash
pnpm run dev:ngrok
```

This will:
1. Start the Next.js development server on port 3000 (default)
2. Create an ngrok tunnel to that port
3. Display the public URL you can use to access your app

## Manual Configuration

If you want more control over ngrok settings:

1. Sign up for a free account at [ngrok.com](https://ngrok.com)
2. Add your authtoken to the `ngrok.json` file
3. Start ngrok manually:
   ```bash
   npx ngrok http 3000 --config=ngrok.json
   ```

## Working with APIs

When using ngrok, you might face some challenges:

1. **CORS Issues**: Fixed by our proxy implementation in `/api/superteam-earn/route.ts`
2. **Authentication**: Some services may not accept requests from ngrok URLs
3. **Cookie Issues**: Cookies might not work properly through ngrok tunnels

## Telegram Bot Testing

For testing the Telegram bot webhook:

1. Start ngrok: `pnpm run dev:ngrok`
2. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)
3. Update your webhook URL:
   ```bash
   TELEGRAM_BOT_TOKEN=your_token WEBHOOK_URL=https://abc123.ngrok.io/api/telegram/webhook pnpm run setup:telegram-bot
   ```

## Troubleshooting

- **Connection Refused**: Make sure your local server is running
- **Invalid Host Header**: Add `{ ignoreDev: true }` to ngrok.connect options in `scripts/dev-ngrok.js`
- **CORS Still Not Working**: Check that your API routes are properly proxying requests

## Learn More

- [Ngrok Documentation](https://ngrok.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)
