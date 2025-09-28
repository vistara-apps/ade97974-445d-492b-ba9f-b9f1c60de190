export interface User {
  userId: string;
  farcasterId: string;
  savedPresets: string[];
  generatedStylesCount: number;
}

export interface Preset {
  presetId: string;
  userId: string;
  name: string;
  transformations: TextTransformation;
  createdAt: Date;
}

export interface TextTransformation {
  colors: string[];
  rotationRange: number;
  scaleRange: number;
  animationType: 'bounce' | 'rotate' | 'scale' | 'none';
  fontSize: number;
  fontWeight: 'normal' | 'bold' | 'light';
  letterSpacing: number;
  backgroundType: 'solid' | 'gradient' | 'transparent';
  backgroundColor?: string;
  gradientColors?: string[];
}

export interface GeneratedText {
  id: string;
  text: string;
  transformation: TextTransformation;
  imageUrl?: string;
  createdAt: Date;
}

export const DEFAULT_TRANSFORMATION: TextTransformation = {
  colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'],
  rotationRange: 15,
  scaleRange: 0.2,
  animationType: 'bounce',
  fontSize: 48,
  fontWeight: 'bold',
  letterSpacing: 2,
  backgroundType: 'transparent',
};

export const PRESET_TRANSFORMATIONS: Record<string, TextTransformation> = {
  rainbow: {
    colors: ['#ff0000', '#ff8000', '#ffff00', '#00ff00', '#0080ff', '#8000ff'],
    rotationRange: 10,
    scaleRange: 0.1,
    animationType: 'bounce',
    fontSize: 52,
    fontWeight: 'bold',
    letterSpacing: 3,
    backgroundType: 'transparent',
  },
  neon: {
    colors: ['#ff00ff', '#00ffff', '#ffff00', '#ff0080'],
    rotationRange: 20,
    scaleRange: 0.3,
    animationType: 'rotate',
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 4,
    backgroundType: 'solid',
    backgroundColor: '#000000',
  },
  ocean: {
    colors: ['#0077be', '#00a8cc', '#4dd0e1', '#80deea'],
    rotationRange: 8,
    scaleRange: 0.15,
    animationType: 'scale',
    fontSize: 44,
    fontWeight: 'normal',
    letterSpacing: 2,
    backgroundType: 'gradient',
    gradientColors: ['#001f3f', '#003d7a'],
  },
  fire: {
    colors: ['#ff4444', '#ff6600', '#ffaa00', '#ffdd00'],
    rotationRange: 25,
    scaleRange: 0.4,
    animationType: 'bounce',
    fontSize: 50,
    fontWeight: 'bold',
    letterSpacing: 1,
    backgroundType: 'gradient',
    gradientColors: ['#330000', '#660000'],
  },
};
