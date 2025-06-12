/**
 * Helper functions for bot database operations
 * Currently using in-memory storage for development
 * TODO: Replace with proper database implementation
 */

// Type definitions for Superteam Earn notification preferences
export type ListingType = 'Bounty' | 'Project' | 'All';
export type UserPreferences = {
  minUsdValue: number;
  maxUsdValue: number | null; // null means no upper limit
  listingTypes: ListingType;
  skills: string[];
  geography: string | null; // User's geography, null means global
  active: boolean; // Whether the user wants to receive notifications
};

// In-memory storage for development
const userBalances: Record<number, number> = {};
const transactions: Array<{
  userId: number;
  type: 'earn' | 'spend';
  amount: number;
  description: string;
  timestamp: Date;
}> = [];

// User preferences for notifications
const userNotificationPreferences: Record<number, UserPreferences> = {};

// Available skills in Superteam Earn
export const availableSkills = [
  'Design',
  'Development',
  'Content',
  'Marketing',
  'Community',
  'BD',
  'Operations',
  'Product',
  'Legal',
  'Finance',
  'Other',
];

/**
 * Get user balance
 */
export async function getUserBalance(userId: number): Promise<number> {
  return userBalances[userId] || 0;
}

/**
 * Record an earning
 */
export async function recordEarning(
  userId: number,
  amount: number,
  description: string
): Promise<number> {
  // Initialize if user doesn't exist
  if (!userBalances[userId]) {
    userBalances[userId] = 0;
  }

  // Update balance
  userBalances[userId] += amount;

  // Record transaction
  transactions.push({
    userId,
    type: 'earn',
    amount,
    description,
    timestamp: new Date(),
  });

  return userBalances[userId];
}

/**
 * Record a spending
 */
export async function recordSpending(
  userId: number,
  amount: number,
  description: string
): Promise<number> {
  // Initialize if user doesn't exist
  if (!userBalances[userId]) {
    userBalances[userId] = 0;
  }

  // Update balance
  userBalances[userId] -= amount;

  // Record transaction
  transactions.push({
    userId,
    type: 'spend',
    amount,
    description,
    timestamp: new Date(),
  });

  return userBalances[userId];
}

/**
 * Get user transaction history
 */
type Transaction = {
  userId: number;
  type: 'earn' | 'spend';
  amount: number;
  description: string;
  timestamp: Date;
};

export async function getUserTransactions(userId: number, limit = 5): Promise<Transaction[]> {
  return transactions
    .filter((t) => t.userId === userId)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
}

/**
 * Get user's notification preferences
 */
export async function getUserPreferences(userId: number): Promise<UserPreferences | null> {
  return userNotificationPreferences[userId] || null;
}

/**
 * Set user's notification preferences
 */
export async function setUserPreferences(
  userId: number,
  preferences: Partial<UserPreferences>
): Promise<UserPreferences> {
  // Initialize default preferences if user doesn't exist
  if (!userNotificationPreferences[userId]) {
    userNotificationPreferences[userId] = {
      minUsdValue: 0,
      maxUsdValue: null,
      listingTypes: 'All',
      skills: [],
      geography: null,
      active: true,
    };
  }

  // Update preferences with new values
  userNotificationPreferences[userId] = {
    ...userNotificationPreferences[userId],
    ...preferences,
  };

  return userNotificationPreferences[userId];
}

/**
 * Check if user has active notification preferences
 */
export async function hasActivePreferences(userId: number): Promise<boolean> {
  return (
    userNotificationPreferences[userId] !== undefined && userNotificationPreferences[userId].active
  );
}

/**
 * Get users who should be notified based on listing criteria
 */
export async function getUsersForNotification(listing: {
  usdValue: number;
  type: 'Bounty' | 'Project';
  skills: string[];
  geography: string | null; // null means global
}): Promise<number[]> {
  return Object.entries(userNotificationPreferences)
    .filter(([, prefs]) => {
      // Check if notifications are active
      if (!prefs.active) return false;

      // Check USD value range
      if (listing.usdValue < prefs.minUsdValue) return false;
      if (prefs.maxUsdValue !== null && listing.usdValue > prefs.maxUsdValue) return false;

      // Check listing type
      if (prefs.listingTypes !== 'All' && prefs.listingTypes !== listing.type) return false;

      // Check skills (if user has preferences, at least one should match)
      if (
        prefs.skills.length > 0 &&
        !prefs.skills.some((skill) => listing.skills.includes(skill))
      ) {
        return false;
      }

      // Check geography
      if (
        listing.geography !== null &&
        prefs.geography !== null &&
        prefs.geography !== listing.geography
      ) {
        return false;
      }

      return true;
    })
    .map(([userId]) => parseInt(userId));
}

// Export existing functions
