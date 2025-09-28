import { Redis } from '@upstash/redis';
import { User, Preset, GeneratedText } from './types';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// User management
export async function getUser(userId: string): Promise<User | null> {
  try {
    const userData = await redis.get(`user:${userId}`);
    return userData as User | null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function createUser(user: User): Promise<User> {
  try {
    await redis.set(`user:${user.userId}`, user);
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  try {
    const existingUser = await getUser(userId);
    if (!existingUser) return null;

    const updatedUser = { ...existingUser, ...updates };
    await redis.set(`user:${userId}`, updatedUser);
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
}

// Preset management
export async function getUserPresets(userId: string): Promise<Preset[]> {
  try {
    const presetIds = await redis.smembers(`user:${userId}:presets`);
    if (!presetIds.length) return [];

    const presets = await Promise.all(
      presetIds.map(async (presetId) => {
        const preset = await redis.get(`preset:${presetId}`);
        return preset as Preset;
      })
    );

    return presets.filter(Boolean).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Error getting user presets:', error);
    return [];
  }
}

export async function createPreset(preset: Preset): Promise<Preset> {
  try {
    await redis.set(`preset:${preset.presetId}`, preset);
    await redis.sadd(`user:${preset.userId}:presets`, preset.presetId);
    return preset;
  } catch (error) {
    console.error('Error creating preset:', error);
    throw new Error('Failed to create preset');
  }
}

export async function deletePreset(userId: string, presetId: string): Promise<boolean> {
  try {
    const preset = await redis.get(`preset:${presetId}`) as Preset;
    if (!preset || preset.userId !== userId) return false;

    await redis.del(`preset:${presetId}`);
    await redis.srem(`user:${userId}:presets`, presetId);
    return true;
  } catch (error) {
    console.error('Error deleting preset:', error);
    return false;
  }
}

export async function updatePreset(presetId: string, updates: Partial<Preset>): Promise<Preset | null> {
  try {
    const existingPreset = await redis.get(`preset:${presetId}`) as Preset;
    if (!existingPreset) return null;

    const updatedPreset = { ...existingPreset, ...updates };
    await redis.set(`preset:${presetId}`, updatedPreset);
    return updatedPreset;
  } catch (error) {
    console.error('Error updating preset:', error);
    return null;
  }
}

// Generated content tracking
export async function saveGeneratedText(generatedText: GeneratedText): Promise<GeneratedText> {
  try {
    const id = `generated:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
    const textWithId = { ...generatedText, id };

    await redis.set(`generated:${id}`, textWithId);
    await redis.sadd(`user:${generatedText.userId}:generated`, id);

    // Update user stats
    const user = await getUser(generatedText.userId);
    if (user) {
      await updateUser(generatedText.userId, {
        generatedStylesCount: user.generatedStylesCount + 1
      });
    }

    return textWithId;
  } catch (error) {
    console.error('Error saving generated text:', error);
    throw new Error('Failed to save generated text');
  }
}

export async function getUserGeneratedTexts(userId: string, limit = 50): Promise<GeneratedText[]> {
  try {
    const generatedIds = await redis.smembers(`user:${userId}:generated`);
    if (!generatedIds.length) return [];

    const generatedTexts = await Promise.all(
      generatedIds.slice(0, limit).map(async (id) => {
        const text = await redis.get(`generated:${id}`);
        return text as GeneratedText;
      })
    );

    return generatedTexts
      .filter(Boolean)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error getting user generated texts:', error);
    return [];
  }
}

// Premium features
export async function checkPremiumStatus(userId: string): Promise<boolean> {
  try {
    const premiumExpiry = await redis.get(`user:${userId}:premium_expiry`);
    if (!premiumExpiry) return false;

    const expiryDate = new Date(premiumExpiry as string);
    return expiryDate > new Date();
  } catch (error) {
    console.error('Error checking premium status:', error);
    return false;
  }
}

export async function setPremiumStatus(userId: string, expiryDate: Date): Promise<void> {
  try {
    await redis.set(`user:${userId}:premium_expiry`, expiryDate.toISOString());
  } catch (error) {
    console.error('Error setting premium status:', error);
    throw new Error('Failed to set premium status');
  }
}

// Analytics
export async function incrementUsage(userId: string, action: string): Promise<void> {
  try {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    await redis.incr(`usage:${date}:${action}`);
    await redis.incr(`user:${userId}:usage:${action}`);
  } catch (error) {
    console.error('Error incrementing usage:', error);
  }
}

export async function getUsageStats(date?: string): Promise<Record<string, number>> {
  try {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const keys = await redis.keys(`usage:${targetDate}:*`);

    const stats: Record<string, number> = {};
    for (const key of keys) {
      const action = key.split(':').pop()!;
      const count = await redis.get(key) as number;
      stats[action] = count;
    }

    return stats;
  } catch (error) {
    console.error('Error getting usage stats:', error);
    return {};
  }
}

