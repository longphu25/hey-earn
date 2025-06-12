/**
 * Types for Superteam Earn API
 */

export interface SuperteamEarnProject {
  id: string;
  rewardAmount: number;
  deadline: string; // ISO date string
  type: string;
  title: string;
  token?: string;
  winnersAnnouncedAt?: string | null;
  slug: string;
  isWinnersAnnounced: boolean;
  isFeatured: boolean;
  compensationType: string;
  minRewardAsk?: number | null;
  maxRewardAsk?: number | null;
  status: string;
  _count: {
    Comments: number;
    Submission: number;
  };
  sponsor: {
    name: string;
    slug: string;
    logo?: string;
    isVerified: boolean;
    st: boolean;
  };
}

export interface SuperteamEarnResponse {
  data: SuperteamEarnProject[];
  total: number;
  page: number;
  limit: number;
}

// API URL constants
const LOCAL_API_URL = '/api/superteam-earn';
const SUPERTEAM_API_LISTINGS_URL = 'https://earn.superteam.fun/api/listings';

/**
 * Fetches projects directly from Superteam Earn API - for server components
 */
export async function fetchSuperteamEarnProjectsFromServer(
  page = 0,
  limit = 30
): Promise<SuperteamEarnResponse> {
  const url = `${SUPERTEAM_API_LISTINGS_URL}?type=project&limit=${limit}&page=${page}`;

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
    next: { revalidate: 60 }, // Cache for 1 minute on the server
  });

  if (!response.ok) {
    console.error(`API Error: ${response.status} ${response.statusText}`);
    try {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error(
        `Failed to fetch projects from Superteam Earn: ${errorData.message || response.statusText}`
      );
    } catch {
      // If we can't parse the error as JSON, just use the status text
      throw new Error(`Failed to fetch projects from Superteam Earn: ${response.statusText}`);
    }
  }

  return response.json();
}

/**
 * Fetches projects from Superteam Earn API
 */
export async function fetchSuperteamEarnProjects(
  page = 0,
  limit = 30
): Promise<SuperteamEarnResponse> {
  // Use our local API route to avoid CORS issues
  const url = `${LOCAL_API_URL}?type=project&limit=${limit}&page=${page}`;
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
    next: { revalidate: 0 },
    cache: 'no-store',
  }); // No cache for testing

  if (!response.ok) {
    console.error(`API Error: ${response.status} ${response.statusText}`);
    try {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error(
        `Failed to fetch projects from Superteam Earn: ${errorData.message || response.statusText}`
      );
    } catch {
      // If we can't parse the error as JSON, just use the status text
      throw new Error(`Failed to fetch projects from Superteam Earn: ${response.statusText}`);
    }
  }

  return response.json();
}

/**
 * Fetches a single project from Superteam Earn API by slug
 */
export async function fetchSuperteamEarnProjectBySlug(
  slug: string
): Promise<SuperteamEarnProject | null> {
  const url = `${LOCAL_API_URL}?type=project&slug=${slug}`;
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
    next: { revalidate: 0 },
    cache: 'no-store',
  }); // No cache for testing

  if (!response.ok) {
    console.error(`API Error: ${response.status} ${response.statusText}`);
    try {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error(
        `Failed to fetch project from Superteam Earn: ${errorData.message || response.statusText}`
      );
    } catch {
      // If we can't parse the error as JSON, just use the status text
      throw new Error(`Failed to fetch project from Superteam Earn: ${response.statusText}`);
    }
  }

  const data = await response.json();
  return data.data.length > 0 ? data.data[0] : null;
}
