'use client';

import { useState, forwardRef } from 'react';
import { Type, Wand2 } from 'lucide-react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  variant?: 'default' | 'textarea';
  placeholder?: string;
  maxLength?: number;
}

export const TextInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, TextInputProps>(
  ({ value, onChange, onGenerate, variant = 'default', placeholder = 'Enter your text...', maxLength = 100 }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onGenerate();
      }
    };

    const InputComponent = variant === 'textarea' ? 'textarea' : 'input';

    return (
      <div className="space-y-4">
        <div className="relative">
          <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
            isFocused ? 'text-accent' : 'text-gray-400'
          }`}>
            <Type className="w-5 h-5" />
          </div>
          
          <InputComponent
            ref={ref as any}
            type={variant === 'default' ? 'text' : undefined}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            maxLength={maxLength}
            className={`text-input pl-12 pr-4 ${
              variant === 'textarea' ? 'min-h-[120px] resize-none' : 'h-14'
            }`}
            {...(variant === 'textarea' && { rows: 4 })}
          />
          
          <div className="absolute right-3 bottom-3 text-xs text-gray-400">
            {value.length}/{maxLength}
          </div>
        </div>

        <button
          onClick={onGenerate}
          disabled={!value.trim()}
          className={`btn-primary w-full flex items-center justify-center space-x-2 ${
            !value.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
          }`}
        >
          <Wand2 className="w-5 h-5" />
          <span>Generate Stylized Text</span>
        </button>
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';
