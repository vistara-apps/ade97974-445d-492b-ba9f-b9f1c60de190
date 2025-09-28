import { hasPremiumAccess, PREMIUM_FEATURES } from './payments';
import { TextTransformation } from './types';

// Premium color palettes
export const PREMIUM_COLOR_PALETTES = [
  ['#ff0080', '#ff4000', '#ff8000', '#ffb000', '#ffff00'], // Hot pink to yellow
  ['#8000ff', '#4000ff', '#0000ff', '#0040ff', '#0080ff'], // Purple to blue
  ['#ff00ff', '#8000ff', '#0000ff', '#0080ff', '#00ffff'], // Magenta to cyan
  ['#ff4444', '#ff8844', '#ffcc44', '#ffff44', '#ccff44'], // Red to yellow-green
  ['#4444ff', '#8844ff', '#cc44ff', '#ff44ff', '#ff4488'], // Blue to pink
];

// Premium animation types
export const PREMIUM_ANIMATIONS = [
  'bounce',
  'rotate',
  'scale',
  'pulse',
  'glow',
  'rainbow',
] as const;

// Premium background options
export const PREMIUM_BACKGROUNDS = [
  { type: 'gradient' as const, colors: ['#ff6b6b', '#4ecdc4'] },
  { type: 'gradient' as const, colors: ['#667eea', '#764ba2'] },
  { type: 'gradient' as const, colors: ['#f093fb', '#f5576c'] },
  { type: 'gradient' as const, colors: ['#4facfe', '#00f2fe'] },
  { type: 'solid' as const, color: '#000000' },
  { type: 'solid' as const, color: '#ffffff' },
];

/**
 * Check if a transformation uses premium features
 */
export function isPremiumTransformation(transformation: TextTransformation): boolean {
  // Check for premium colors
  const hasPremiumColors = transformation.colors.some(color =>
    !['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#ff6348', '#2ed573', '#1e90ff', '#ffa502', '#ff4757'].includes(color)
  );

  // Check for premium animations
  const hasPremiumAnimation = ['pulse', 'glow', 'rainbow'].includes(transformation.animationType);

  // Check for premium backgrounds
  const hasPremiumBackground = transformation.backgroundType === 'gradient' ||
    (transformation.backgroundType === 'solid' && transformation.backgroundColor &&
     !['#000000', '#ffffff'].includes(transformation.backgroundColor));

  return hasPremiumColors || hasPremiumAnimation || hasPremiumBackground;
}

/**
 * Get available features for a user based on their premium status
 */
export async function getAvailableFeatures(userId: string): Promise<{
  basic: string[];
  premium: string[];
  hasPremium: boolean;
}> {
  const hasPremium = await hasPremiumAccess(userId);

  return {
    basic: [
      'basic_generation',
      'basic_presets',
      'basic_colors',
      'basic_animations',
    ],
    premium: hasPremium ? [
      'premium_styles',
      'premium_colors',
      'premium_animations',
      'premium_backgrounds',
      'advanced_presets',
      'unlimited_generation',
    ] : [],
    hasPremium,
  };
}

/**
 * Generate a premium transformation
 */
export function generatePremiumTransformation(): TextTransformation {
  const randomPalette = PREMIUM_COLOR_PALETTES[Math.floor(Math.random() * PREMIUM_COLOR_PALETTES.length)];
  const randomAnimation = PREMIUM_ANIMATIONS[Math.floor(Math.random() * PREMIUM_ANIMATIONS.length)];
  const randomBackground = PREMIUM_BACKGROUNDS[Math.floor(Math.random() * PREMIUM_BACKGROUNDS.length)];

  return {
    colors: randomPalette,
    rotationRange: Math.random() * 45 + 5, // 5-50 degrees
    scaleRange: Math.random() * 0.6 + 0.2, // 0.2-0.8
    animationType: randomAnimation,
    fontSize: Math.random() * 30 + 50, // 50-80px
    fontWeight: Math.random() > 0.7 ? 'bold' : 'normal',
    letterSpacing: Math.random() * 6 + 2, // 2-8px
    backgroundType: randomBackground.type,
    backgroundColor: randomBackground.type === 'solid' ? randomBackground.color : undefined,
    gradientColors: randomBackground.type === 'gradient' ? randomBackground.colors : undefined,
  };
}

/**
 * Apply premium restrictions to a transformation
 */
export async function applyPremiumRestrictions(
  userId: string,
  transformation: TextTransformation
): Promise<TextTransformation> {
  const hasPremium = await hasPremiumAccess(userId);

  if (hasPremium) {
    return transformation; // No restrictions for premium users
  }

  // Apply basic restrictions
  const basicTransformation: TextTransformation = {
    ...transformation,
    // Limit to basic colors
    colors: transformation.colors.slice(0, 5).map(color =>
      ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'].includes(color)
        ? color
        : '#ff6b6b' // fallback to basic color
    ),
    // Limit animation types
    animationType: ['bounce', 'rotate', 'scale'].includes(transformation.animationType)
      ? transformation.animationType
      : 'bounce',
    // Remove premium backgrounds
    backgroundType: 'transparent',
    backgroundColor: undefined,
    gradientColors: undefined,
  };

  return basicTransformation;
}

/**
 * Check if user can access a specific feature
 */
export async function canAccessFeature(userId: string, featureId: string): Promise<boolean> {
  const features = await getAvailableFeatures(userId);

  if (features.basic.includes(featureId)) {
    return true;
  }

  return features.premium.includes(featureId);
}

/**
 * Get premium upgrade prompt for restricted features
 */
export function getPremiumUpgradePrompt(featureId: string): string {
  const feature = PREMIUM_FEATURES[featureId];

  if (!feature) {
    return 'Upgrade to premium for access to advanced features!';
  }

  return `Unlock ${feature.name} for $${(feature.price / 100).toFixed(2)} - ${feature.description}`;
}

