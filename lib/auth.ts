import { User } from './types';
import { getUser, createUser } from './database';

export interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  pfp?: string;
}

/**
 * Extract user information from Farcaster frame data
 */
export function extractFarcasterUser(untrustedData: any): FarcasterUser | null {
  try {
    if (!untrustedData?.fid) return null;

    return {
      fid: untrustedData.fid,
      username: untrustedData.username || `user_${untrustedData.fid}`,
      displayName: untrustedData.displayName || untrustedData.username || `User ${untrustedData.fid}`,
      pfp: untrustedData.pfp,
    };
  } catch (error) {
    console.error('Error extracting Farcaster user:', error);
    return null;
  }
}

/**
 * Get or create a user from Farcaster data
 */
export async function getOrCreateUser(farcasterUser: FarcasterUser): Promise<User> {
  const userId = farcasterUser.fid.toString();
  let user = await getUser(userId);

  if (!user) {
    // Create new user
    user = {
      userId,
      farcasterId: farcasterUser.fid.toString(),
      savedPresets: [],
      generatedStylesCount: 0,
    };

    user = await createUser(user);
  }

  return user;
}

/**
 * Validate Farcaster frame signature (basic validation)
 */
export function validateFrameSignature(untrustedData: any): boolean {
  try {
    // Basic validation - check if required fields are present
    if (!untrustedData?.fid || !untrustedData?.timestamp) {
      return false;
    }

    // Check if timestamp is within reasonable bounds (within last 5 minutes)
    const timestamp = parseInt(untrustedData.timestamp);
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (Math.abs(now - timestamp) > fiveMinutes) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error validating frame signature:', error);
    return false;
  }
}

/**
 * Middleware to authenticate Farcaster users
 */
export async function authenticateFarcasterUser(untrustedData: any): Promise<User | null> {
  try {
    // Validate frame data
    if (!validateFrameSignature(untrustedData)) {
      console.error('Invalid frame signature');
      return null;
    }

    // Extract user info
    const farcasterUser = extractFarcasterUser(untrustedData);
    if (!farcasterUser) {
      console.error('Could not extract Farcaster user');
      return null;
    }

    // Get or create user
    const user = await getOrCreateUser(farcasterUser);
    return user;
  } catch (error) {
    console.error('Error authenticating Farcaster user:', error);
    return null;
  }
}

