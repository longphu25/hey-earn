This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment with GitHub Actions

This project is configured to deploy automatically to Vercel using GitHub Actions.

### Setup Instructions

1. Create a Vercel project and link it to your GitHub repository.
2. Obtain the following secrets from Vercel:
   - `VERCEL_TOKEN`: Create a token in your Vercel account settings
   - `VERCEL_ORG_ID`: Find in your Vercel project settings
   - `VERCEL_PROJECT_ID`: Find in your Vercel project settings

3. Add these secrets to your GitHub repository:
   - Go to your GitHub repository
   - Navigate to Settings > Secrets and variables > Actions
   - Add the three secrets mentioned above

4. Push to the `main` branch to trigger a production deployment
5. Create a pull request to trigger a preview deployment

The GitHub Actions workflows will:
- Build and deploy your application
- For preview deployments: Add a comment to your PR with the preview URL

## Telegram Bot Integration

This project includes a Telegram bot for tracking earnings and expenses.

### Bot Features

- Track earnings and expenses
- Check balance
- View transaction history

### Setup Instructions

1. Run the setup script:
   ```bash
   pnpm setup:telegram-bot
   ```

2. Follow the prompts to configure your bot

3. For production deployment, add these environment variables to your Vercel project:
   - `TELEGRAM_BOT_TOKEN`: Your bot token from BotFather
   - `TELEGRAM_SECRET_TOKEN`: A random secret for webhook security
   - `TELEGRAM_WEBHOOK_URL`: Your webhook URL (e.g., `https://yourdomain.com/api/telegram/webhook`)

For more details, see the [Telegram Bot Documentation](docs/telegram-bot.md)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
