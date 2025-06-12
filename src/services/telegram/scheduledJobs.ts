/**
 * Scheduled job to process new listings and send notifications
 * This file handles the logic for fetching new listings from the database
 * and sending notifications to users based on their preferences
 */

import { TelegramService, Listing } from '@/services/telegram/telegramService';
import dotenv from 'dotenv';

dotenv.config();

export async function processNewListingsJob() {
  try {
    console.log('Running scheduled job to process new listings...');

    // TODO: In the actual implementation, fetch listings from the Superteam Earn database
    // For now, we'll use a mock implementation
    const listings = await mockFetchNewListings();

    if (listings.length === 0) {
      console.log('No new listings to process');
      return;
    }

    console.log(`Found ${listings.length} new listing(s) to process`);

    // Get the telegram service instance
    const telegramService = TelegramService.getInstance();

    // Process the listings
    await telegramService.processNewListings(listings);

    console.log('Finished processing new listings');
  } catch (error) {
    console.error('Error processing new listings:', error);
  }
}

// Mock function to fetch new listings (to be replaced with actual database queries)
async function mockFetchNewListings(): Promise<Listing[]> {
  // Return some mock listings
  return [
    {
      id: 'listing-1',
      title: 'Frontend Developer for Solana DApp',
      sponsor: 'Solana Foundation',
      rewardToken: 'USDC',
      rewardValue: 2000,
      usdValue: 2000,
      variableCompensation: false,
      url: 'https://earn.superteam.fun/bounty/frontend-developer',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      type: 'Bounty',
      skills: ['Development', 'Design'],
      geography: null, // Global
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    },
    {
      id: 'listing-2',
      title: 'Content Writer for Educational Materials',
      sponsor: 'Superteam',
      rewardToken: 'USDC',
      rewardValue: 0,
      usdValue: 3000,
      variableCompensation: true,
      url: 'https://earn.superteam.fun/project/content-writer',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      type: 'Project',
      skills: ['Content', 'Marketing'],
      geography: 'APAC',
      publishedAt: new Date(Date.now() - 11.8 * 60 * 60 * 1000), // ~12 hours ago
    },
    {
      id: 'listing-3',
      title: 'Solana Smart Contract Audit',
      sponsor: 'Anonymous Protocol',
      rewardToken: 'SOL',
      rewardValue: 10,
      usdValue: 1500,
      variableCompensation: false,
      rewardRange: {
        min: 10,
        max: 15,
      },
      url: 'https://earn.superteam.fun/bounty/smart-contract-audit',
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      type: 'Bounty',
      skills: ['Development', 'Security'],
      geography: null, // Global
      publishedAt: new Date(Date.now() - 12.5 * 60 * 60 * 1000), // ~12.5 hours ago
    },
  ];
}

// If this script is run directly
if (require.main === module) {
  processNewListingsJob()
    .then(() => {
      console.log('Job completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Job failed:', error);
      process.exit(1);
    });
}
