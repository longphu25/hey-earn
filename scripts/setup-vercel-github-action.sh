#!/bin/bash

# Setup script for Vercel GitHub Actions integration

echo "Vercel GitHub Actions Setup Helper"
echo "=================================="
echo ""
echo "This script helps you obtain the necessary credentials for GitHub Actions integration with Vercel."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI not found. Installing globally..."
    pnpm add -g vercel
fi

echo "Logging into Vercel (if not already logged in)..."
vercel login

echo ""
echo "Linking project to Vercel..."
vercel link

echo ""
echo "Retrieving project environment variables..."
echo "You'll need the following values for GitHub Secrets:"
echo ""

# Get project info
# PROJECT_JSON=$(vercel project ls --json)
# PROJECT_NAME=$(basename $(pwd))
# PROJECT_ID=$(echo $PROJECT_JSON | grep -o "\"id\":\"[^\"]*\"" | grep -o "[^\"]*$" | head -1)
# ORG_ID=$(echo $PROJECT_JSON | grep -o "\"orgId\":\"[^\"]*\"" | grep -o "[^\"]*$" | head -1)

# Read file .vercel/project.json get PROJECT_ID = projectId, ORG_ID = orgId
PROJECT_JSON=$(cat .vercel/project.json)
PROJECT_ID=$(echo $PROJECT_JSON | grep -o "\"projectId\":\"[^\"]*\"" | grep -o "[^\"]*$")
ORG_ID=$(echo $PROJECT_JSON | grep -o "\"orgId\":\"[^\"]*\"" | grep -o "[^\"]*$")

echo "VERCEL_PROJECT_ID: $PROJECT_ID"
echo "VERCEL_ORG_ID: $ORG_ID"
echo ""
echo "For VERCEL_TOKEN, create a token at: https://vercel.com/account/tokens"
echo ""
echo "Add these secrets to your GitHub repository:"
echo "1. Go to your GitHub repository settings"
echo "2. Navigate to Secrets and variables > Actions"
echo "3. Add the three secrets mentioned above"
echo ""
echo "Setup complete! Your GitHub Actions workflow should now be able to deploy to Vercel."
