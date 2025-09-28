import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TextTransformation } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomTransformation(): TextTransformation {
  const colorPalettes = [
    ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'],
    ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'],
    ['#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'],
    ['#ff6348', '#2ed573', '#1e90ff', '#ffa502', '#ff4757'],
  ];

  const randomPalette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
  const animations: Array<'bounce' | 'rotate' | 'scale' | 'none'> = ['bounce', 'rotate', 'scale', 'none'];

  return {
    colors: randomPalette,
    rotationRange: Math.random() * 30 + 5, // 5-35 degrees
    scaleRange: Math.random() * 0.4 + 0.1, // 0.1-0.5
    animationType: animations[Math.floor(Math.random() * animations.length)],
    fontSize: Math.random() * 20 + 40, // 40-60px
    fontWeight: Math.random() > 0.5 ? 'bold' : 'normal',
    letterSpacing: Math.random() * 4 + 1, // 1-5px
    backgroundType: 'transparent',
  };
}

export function applyTransformationToLetter(
  letter: string,
  index: number,
  transformation: TextTransformation
): React.CSSProperties {
  const color = transformation.colors[index % transformation.colors.length];
  const rotation = (Math.random() - 0.5) * 2 * transformation.rotationRange;
  const scale = 1 + (Math.random() - 0.5) * 2 * transformation.scaleRange;
  
  return {
    color,
    transform: `rotate(${rotation}deg) scale(${scale})`,
    fontSize: `${transformation.fontSize}px`,
    fontWeight: transformation.fontWeight,
    letterSpacing: `${transformation.letterSpacing}px`,
    display: 'inline-block',
    margin: '0 2px',
    transition: 'all 0.3s ease-out',
  };
}

export function generateImageFromText(
  text: string,
  transformation: TextTransformation
): Promise<string> {
  return new Promise((resolve) => {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      resolve('');
      return;
    }

    // Set canvas size
    canvas.width = 800;
    canvas.height = 400;

    // Set background
    if (transformation.backgroundType === 'solid' && transformation.backgroundColor) {
      ctx.fillStyle = transformation.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (transformation.backgroundType === 'gradient' && transformation.gradientColors) {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, transformation.gradientColors[0]);
      gradient.addColorStop(1, transformation.gradientColors[1]);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Set font
    ctx.font = `${transformation.fontWeight} ${transformation.fontSize}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Calculate letter positions
    const letters = text.split('');
    const totalWidth = letters.length * (transformation.fontSize + transformation.letterSpacing);
    const startX = (canvas.width - totalWidth) / 2;

    // Draw each letter
    letters.forEach((letter, index) => {
      if (letter === ' ') return;
      
      const x = startX + index * (transformation.fontSize + transformation.letterSpacing);
      const y = canvas.height / 2;
      const color = transformation.colors[index % transformation.colors.length];
      const rotation = (Math.random() - 0.5) * 2 * transformation.rotationRange * (Math.PI / 180);
      const scale = 1 + (Math.random() - 0.5) * 2 * transformation.scaleRange;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.scale(scale, scale);
      ctx.fillStyle = color;
      ctx.fillText(letter, 0, 0);
      ctx.restore();
    });

    // Convert to data URL
    resolve(canvas.toDataURL('image/png'));
  });
}

export function downloadImage(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function shareToFarcaster(text: string, imageUrl: string) {
  const shareText = `Check out my stylized text: "${text}" created with LetterCraft! 🎨`;
  const shareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(imageUrl)}`;
  window.open(shareUrl, '_blank');
}
