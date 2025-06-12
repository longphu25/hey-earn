#!/usr/bin/env node

/**
 * This script starts a Next.js development server and exposes it via ngrok.
 * It's useful for testing webhooks, sharing your dev environment, or bypassing CORS.
 */

const { spawn } = require('child_process');
const ngrok = require('ngrok');
const path = require('path');
const HttpsProxyAgent = require('https-proxy-agent');

// Load environment variables from .env, .env.local, .env.development (in that order)
require('dotenv').config({ path: path.join(process.cwd(), '.env') });
require('dotenv').config({ path: path.join(process.cwd(), '.env.local') });
require('dotenv').config({ path: path.join(process.cwd(), '.env.development') });

/**
 * Updates the Telegram webhook URL
 * @param {string} ngrokUrl - The ngrok URL to set as webhook
 */
async function updateTelegramWebhook(ngrokUrl) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const secretToken = process.env.TELEGRAM_SECRET_TOKEN;

  if (!botToken) {
    console.log(
      '\x1b[33m%s\x1b[0m',
      '⚠️ TELEGRAM_BOT_TOKEN not found in .env.local, skipping webhook setup'
    );
    return;
  }

  try {
    const webhookUrl = `${ngrokUrl}/api/telegram/webhook`;
    console.log('\x1b[36m%s\x1b[0m', `🤖 Setting Telegram webhook to: ${webhookUrl}`);

    // Use fetch instead of https with
    const proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: webhookUrl,
        ...(secretToken ? { secret_token: secretToken } : {}),
      }),
      ...(proxy ? { agent: new HttpsProxyAgent(proxy) } : {}),
    };
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/setWebhook`,
      fetchOptions
    );

    if (!response.ok) {
      console.error(
        '\x1b[31m%s\x1b[0m',
        `❌ HTTP error: ${response.status} ${response.statusText}`
      );
      return;
    }

    try {
      const result = await response.json();
      if (result.ok) {
        console.log('\x1b[32m%s\x1b[0m', '✅ Telegram webhook successfully set');

        // Update the environment variable for the current process
        process.env.TELEGRAM_WEBHOOK_URL = webhookUrl;

        // Also add a note about updating .env file
        console.log(
          '\x1b[33m%s\x1b[0m',
          `ℹ️ To persist this setting, add this to your .env.local file:`
        );
        console.log('\x1b[33m%s\x1b[0m', `TELEGRAM_WEBHOOK_URL=${webhookUrl}`);
      } else {
        console.error(
          '\x1b[31m%s\x1b[0m',
          `❌ Failed to set Telegram webhook: ${result.description}`
        );
      }
    } catch (parseError) {
      console.error(
        '\x1b[31m%s\x1b[0m',
        `❌ Error parsing Telegram API response: ${parseError.message}`
      );
    }
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', `❌ Error setting Telegram webhook: ${err.message}`);
  }
}

// Configuration
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const NGROK_TOKEN = process.env.NGROK_TOKEN || '';
if (!NGROK_TOKEN) {
  console.error('\x1b[31m%s\x1b[0m', '❌ NGROK_TOKEN environment variable is not set.');
  console.error('\x1b[33m%s\x1b[0m', 'Please set it to your ngrok auth token.');
  process.exit(1);
}

// Start the Next.js dev server
console.log('\x1b[36m%s\x1b[0m', '🚀 Starting Next.js development server...');
const devProcess = spawn('pnpm', ['dev'], {
  stdio: 'inherit',
  shell: true,
});

// Handle dev server process exit
devProcess.on('exit', (code) => {
  console.log(`\n\x1b[36m%s\x1b[0m`, `📟 Next.js dev server exited with code ${code}`);
  process.exit(code);
});

// Start ngrok when the dev server is ready
setTimeout(async () => {
  try {
    console.log('\x1b[36m%s\x1b[0m', '🌐 Starting ngrok tunnel...');

    // Path to ngrok config
    // const configPath = require('path').join(process.cwd(), 'ngrok.json');
    // console.log('\x1b[36m%s\x1b[0m', `Using ngrok config at: ${configPath}`);
    // https://www.npmjs.com/package/ngrok#local-install

    // Connect to ngrok
    const url = await ngrok.connect({
      addr: PORT,
      authtoken: NGROK_TOKEN,
    });

    console.log('\x1b[32m%s\x1b[0m', `✨ Success! Your app is available at: ${url}`);
    console.log(
      '\x1b[33m%s\x1b[0m',
      `⚠️  Note: Some Next.js features like rewrites might behave differently through ngrok`
    );
    console.log('\x1b[36m%s\x1b[0m', `📋 Local URL: ${BASE_URL}`);

    // Update Telegram webhook URL
    await updateTelegramWebhook(url);

    console.log('\x1b[36m%s\x1b[0m', `Press Ctrl+C to stop the servers\n`);
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', `❌ Error starting ngrok: ${err.message}`);
    devProcess.kill();
    process.exit(1);
  }
}, 5000); // Wait 5 seconds for the dev server to start

// Handle script termination
process.on('SIGINT', async () => {
  console.log('\n\x1b[36m%s\x1b[0m', '🛑 Shutting down servers...');

  try {
    await ngrok.kill();
    console.log('\x1b[36m%s\x1b[0m', '✅ Ngrok tunnel closed');
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', `❌ Error closing ngrok: ${err.message}`);
  }

  devProcess.kill();
  process.exit(0);
});
