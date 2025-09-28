'use client';

import { useState, useEffect } from 'react';
import { TextInput } from './TextInput';
import { StylizedText } from './StylizedText';
import { GenerateButton } from './GenerateButton';
import {
  TextTransformation,
  DEFAULT_TRANSFORMATION
} from '@/lib/types';
import {
  generateRandomTransformation,
  generateImageFromText,
  downloadImage
} from '@/lib/utils';

interface EmbeddableWidgetProps {
  theme?: 'light' | 'dark';
  maxLength?: number;
  placeholder?: string;
  showDownload?: boolean;
  showShare?: boolean;
  width?: string;
  height?: string;
  className?: string;
}

export function EmbeddableWidget({
  theme = 'dark',
  maxLength = 30,
  placeholder = 'Enter text...',
  showDownload = true,
  showShare = true,
  width = '100%',
  height = 'auto',
  className = '',
}: EmbeddableWidgetProps) {
  const [text, setText] = useState('');
  const [transformation, setTransformation] = useState<TextTransformation>(DEFAULT_TRANSFORMATION);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string>('');

  const handleGenerate = async () => {
    if (!text.trim()) return;

    setIsGenerating(true);

    setTimeout(() => {
      const newTransformation = generateRandomTransformation();
      setTransformation(newTransformation);
      setIsGenerating(false);
    }, 600);
  };

  const handleImageGenerated = (dataUrl: string) => {
    setGeneratedImage(dataUrl);
  };

  const handleDownload = () => {
    if (generatedImage) {
      downloadImage(generatedImage, `lettercraft-${text.toLowerCase()}.png`);
    }
  };

  const handleShare = () => {
    if (generatedImage) {
      // For embedded widget, copy to clipboard
      navigator.clipboard.writeText(generatedImage).then(() => {
        // Show temporary success message
        const notification = document.createElement('div');
        notification.textContent = 'Image copied!';
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #10b981;
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          z-index: 1000;
        `;
        document.body.appendChild(notification);
        setTimeout(() => document.body.removeChild(notification), 2000);
      });
    }
  };

  const widgetStyles: React.CSSProperties = {
    width,
    height,
    backgroundColor: theme === 'dark' ? '#1a2332' : '#ffffff',
    color: theme === 'dark' ? '#ffffff' : '#000000',
    borderRadius: '12px',
    padding: '20px',
    fontFamily: 'Inter, sans-serif',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: `1px solid ${theme === 'dark' ? '#4a5568' : '#e2e8f0'}`,
  };

  return (
    <div style={widgetStyles} className={`lettercraft-widget ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-1">LetterCraft</h2>
          <p className="text-sm opacity-70">Transform text into art</p>
        </div>

        {/* Text Input */}
        <TextInput
          value={text}
          onChange={setText}
          onGenerate={handleGenerate}
          placeholder={placeholder}
          maxLength={maxLength}
        />

        {/* Preview */}
        {text && (
          <div className="space-y-3">
            <div
              className="bg-surface rounded-lg p-3"
              style={{ backgroundColor: theme === 'dark' ? '#2d3748' : '#f7fafc' }}
            >
              <StylizedText
                text={text}
                transformation={transformation}
                animate={!isGenerating}
                onImageGenerated={handleImageGenerated}
              />
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              <GenerateButton
                onClick={handleGenerate}
                isLoading={isGenerating}
                variant="primary"
                text="Generate"
                className="flex-1"
              />

              <div className="flex gap-1">
                {showDownload && (
                  <button
                    onClick={handleDownload}
                    className="btn-secondary p-2 rounded-md"
                    title="Download"
                  >
                    📥
                  </button>
                )}

                {showShare && (
                  <button
                    onClick={handleShare}
                    className="btn-secondary p-2 rounded-md"
                    title="Copy Image"
                  >
                    📋
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-xs opacity-50">
          Powered by{' '}
          <a
            href="https://lettercraft.app"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-75"
          >
            LetterCraft
          </a>
        </div>
      </div>
    </div>
  );
}

