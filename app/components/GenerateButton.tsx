'use client';

import { useState } from 'react';
import { Wand2, Sparkles, Zap, RefreshCw } from 'lucide-react';

interface GenerateButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  text?: string;
}

export function GenerateButton({ 
  onClick, 
  isLoading = false, 
  disabled = false, 
  variant = 'primary',
  text = 'Generate'
}: GenerateButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const icons = [Wand2, Sparkles, Zap];
  const IconComponent = icons[Math.floor(Math.random() * icons.length)];

  const baseClasses = "relative overflow-hidden transition-all duration-200 flex items-center justify-center space-x-2 font-medium rounded-xl px-6 py-3";
  
  const variantClasses = {
    primary: "bg-accent text-white hover:opacity-90 shadow-lg hover:shadow-xl hover:scale-105",
    secondary: "bg-surface border border-border text-fg hover:bg-opacity-80"
  };

  const disabledClasses = "opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-lg";

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`${baseClasses} ${variantClasses[variant]} ${
        (disabled || isLoading) ? disabledClasses : ''
      }`}
    >
      {/* Background Animation */}
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transform -skew-x-12 transition-all duration-700 ${
        isHovered && !disabled && !isLoading ? 'opacity-20 translate-x-full' : '-translate-x-full'
      }`} />
      
      {/* Icon */}
      <div className="relative z-10">
        {isLoading ? (
          <RefreshCw className="w-5 h-5 animate-spin" />
        ) : (
          <IconComponent className="w-5 h-5" />
        )}
      </div>
      
      {/* Text */}
      <span className="relative z-10">
        {isLoading ? 'Generating...' : text}
      </span>
      
      {/* Sparkle Effects */}
      {isHovered && !disabled && !isLoading && (
        <>
          <div className="absolute top-1 right-2 w-1 h-1 bg-white rounded-full animate-ping" />
          <div className="absolute bottom-2 left-3 w-1 h-1 bg-white rounded-full animate-ping animation-delay-200" />
          <div className="absolute top-3 left-1/2 w-1 h-1 bg-white rounded-full animate-ping animation-delay-400" />
        </>
      )}
    </button>
  );
}
