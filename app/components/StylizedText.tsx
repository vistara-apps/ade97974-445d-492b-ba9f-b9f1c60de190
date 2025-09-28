'use client';

import { useEffect, useState, useRef } from 'react';
import { TextTransformation } from '@/lib/types';
import { applyTransformationToLetter } from '@/lib/utils';

interface StylizedTextProps {
  text: string;
  transformation: TextTransformation;
  animate?: boolean;
  onImageGenerated?: (dataUrl: string) => void;
}

export function StylizedText({ 
  text, 
  transformation, 
  animate = true,
  onImageGenerated 
}: StylizedTextProps) {
  const [animationKey, setAnimationKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animate) {
      setAnimationKey(prev => prev + 1);
    }
  }, [text, transformation, animate]);

  useEffect(() => {
    // Generate image after a short delay to ensure rendering is complete
    const timer = setTimeout(() => {
      if (containerRef.current && onImageGenerated) {
        generateImage();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [text, transformation]);

  const generateImage = async () => {
    if (!containerRef.current || !onImageGenerated) return;

    try {
      // Use html2canvas if available, otherwise create a simple canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;

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

      // Draw text
      const letters = text.split('');
      const totalWidth = letters.length * (transformation.fontSize + transformation.letterSpacing);
      const startX = (canvas.width - totalWidth) / 2;

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

      const dataUrl = canvas.toDataURL('image/png');
      onImageGenerated(dataUrl);
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  const getBackgroundStyle = () => {
    if (transformation.backgroundType === 'solid' && transformation.backgroundColor) {
      return { backgroundColor: transformation.backgroundColor };
    } else if (transformation.backgroundType === 'gradient' && transformation.gradientColors) {
      return {
        background: `linear-gradient(135deg, ${transformation.gradientColors[0]}, ${transformation.gradientColors[1]})`
      };
    }
    return {};
  };

  return (
    <div 
      ref={containerRef}
      className="relative p-8 rounded-xl overflow-hidden"
      style={getBackgroundStyle()}
    >
      <div className="flex flex-wrap justify-center items-center gap-1">
        {text.split('').map((letter, index) => {
          if (letter === ' ') {
            return <span key={`${index}-${animationKey}`} className="w-4" />;
          }

          const style = applyTransformationToLetter(letter, index, transformation);
          const animationClass = animate ? `animate-letter-${transformation.animationType}` : '';
          const animationDelay = animate ? { animationDelay: `${index * 100}ms` } : {};

          return (
            <span
              key={`${index}-${animationKey}`}
              className={`letter-transform ${animationClass}`}
              style={{ ...style, ...animationDelay }}
            >
              {letter}
            </span>
          );
        })}
      </div>
    </div>
  );
}
