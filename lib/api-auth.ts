import { NextRequest } from 'next/server';

export interface APIKey {
  id: string;
  userId: string;
  key: string;
  name: string;
  createdAt: Date;
  lastUsed?: Date;
  rateLimit: number; // requests per hour
  permissions: string[];
}

/**
 * Validate API key from request headers
 */
export async function validateAPIKey(req: NextRequest): Promise<APIKey | null> {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const apiKey = authHeader.substring(7); // Remove 'Bearer ' prefix

  // In production, this would check against a database
  // For now, we'll use a simple validation
  if (!apiKey || apiKey.length < 20) {
    return null;
  }

  // Mock API key validation - replace with actual database lookup
  return {
    id: 'key-1',
    userId: 'user-123',
    key: apiKey,
    name: 'Default API Key',
    createdAt: new Date(),
    rateLimit: 1000,
    permissions: ['generate', 'presets:read'],
  };
}

/**
 * Check rate limit for API key
 */
export async function checkRateLimit(apiKey: APIKey, req: NextRequest): Promise<boolean> {
  // In production, implement proper rate limiting with Redis
  // For now, always allow
  return true;
}

/**
 * Update API key last used timestamp
 */
export async function updateAPIKeyUsage(apiKey: APIKey): Promise<void> {
  // In production, update database
  apiKey.lastUsed = new Date();
}

/**
 * Generate a new API key
 */
export function generateAPIKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'lc_'; // LetterCraft prefix

  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

/**
 * Middleware to authenticate API requests
 */
export async function authenticateAPIRequest(req: NextRequest): Promise<{
  apiKey: APIKey | null;
  error: string | null;
}> {
  const apiKey = await validateAPIKey(req);

  if (!apiKey) {
    return {
      apiKey: null,
      error: 'Invalid or missing API key',
    };
  }

  // Check rate limit
  const withinLimit = await checkRateLimit(apiKey, req);
  if (!withinLimit) {
    return {
      apiKey: null,
      error: 'Rate limit exceeded',
    };
  }

  // Update usage
  await updateAPIKeyUsage(apiKey);

  return {
    apiKey,
    error: null,
  };
}

/**
 * Check if API key has required permission
 */
export function hasPermission(apiKey: APIKey, permission: string): boolean {
  return apiKey.permissions.includes(permission) ||
         apiKey.permissions.includes('*') ||
         apiKey.permissions.includes(`${permission.split(':')[0]}:*`);
}

