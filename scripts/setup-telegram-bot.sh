#!/bin/bash

# Script to help set up a Telegram bot

echo "Telegram Bot Setup Helper"
echo "========================="
echo ""
echo "This script will guide you through setting up your Telegram bot for Hey Earn."
echo ""

echo "Steps to create a Telegram bot:"
echo "1. Open Telegram and search for @BotFather"
echo "2. Start a conversation and send the command /newbot"
echo "3. Follow the instructions to create your bot named 'hey_earn_bot'"
echo "4. Once completed, BotFather will provide you with a token"
echo ""
read -p "Have you created your bot with BotFather? (y/n): " created_bot

if [ "$created_bot" != "y" ]; then
  echo "Please create your bot with BotFather and then run this script again."
  exit 1
fi

# Get bot token
read -p "Enter your Telegram bot token: " bot_token
if [ -z "$bot_token" ]; then
  echo "Bot token is required."
  exit 1
fi

# Generate a secret token for webhook verification
secret_token=$(openssl rand -hex 16)

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  touch .env
  echo "Created new .env file."
fi

# Check if .env already has these variables
if grep -q "TELEGRAM_BOT_TOKEN" .env; then
  # Update existing variables
  sed -i '' "s|TELEGRAM_BOT_TOKEN=.*|TELEGRAM_BOT_TOKEN=$bot_token|" .env
else
  # Add new variables
  echo "TELEGRAM_BOT_TOKEN=$bot_token" >> .env
fi

if grep -q "TELEGRAM_SECRET_TOKEN" .env; then
  sed -i '' "s|TELEGRAM_SECRET_TOKEN=.*|TELEGRAM_SECRET_TOKEN=$secret_token|" .env
else
  echo "TELEGRAM_SECRET_TOKEN=$secret_token" >> .env
fi

echo ""
echo "Bot configuration added to your .env file."
echo ""
echo "For local development, the bot will run in polling mode."
echo "For production, you'll need to set TELEGRAM_WEBHOOK_URL in your .env file."
echo ""
echo "Next Steps:"
echo "1. Start your development server: pnpm dev"
echo "2. Talk to your bot on Telegram to test it"
echo ""
echo "Setup complete!"
