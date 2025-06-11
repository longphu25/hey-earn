/**
 * Helper functions for bot database operations
 * Currently using in-memory storage for development
 * TODO: Replace with proper database implementation
 */

// In-memory storage for development
const userBalances: Record<number, number> = {};
const transactions: Array<{
  userId: number;
  type: 'earn' | 'spend';
  amount: number;
  description: string;
  timestamp: Date;
}> = [];

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
export async function getUserTransactions(userId: number, limit = 5): Promise<Array<any>> {
  return transactions
    .filter((t) => t.userId === userId)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
}
