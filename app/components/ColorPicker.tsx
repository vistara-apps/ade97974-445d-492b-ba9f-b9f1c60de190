'use client';

import { useState } from 'react';
import { Palette, Plus, X } from 'lucide-react';

interface ColorPickerProps {
  colors: string[];
  onChange: (colors: string[]) => void;
  variant?: 'default';
}

export function ColorPicker({ colors, onChange, variant = 'default' }: ColorPickerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newColor, setNewColor] = useState('#ff6b6b');

  const presetPalettes = [
    { name: 'Warm', colors: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff'] },
    { name: 'Cool', colors: ['#5f27cd', '#00d2d3', '#2ed573', '#3742fa'] },
    { name: 'Sunset', colors: ['#ff9500', '#ff6b35', '#f7931e', '#ffb142'] },
    { name: 'Ocean', colors: ['#0077be', '#00a8cc', '#4dd0e1', '#80deea'] },
    { name: 'Forest', colors: ['#27ae60', '#2ecc71', '#58d68d', '#82e0aa'] },
  ];

  const addColor = () => {
    if (colors.length < 8 && !colors.includes(newColor)) {
      onChange([...colors, newColor]);
    }
  };

  const removeColor = (index: number) => {
    if (colors.length > 1) {
      onChange(colors.filter((_, i) => i !== index));
    }
  };

  const applyPalette = (palette: string[]) => {
    onChange(palette);
  };

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Palette className="w-5 h-5 text-accent" />
          <span className="font-medium text-fg">Color Palette</span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-accent hover:text-opacity-80 transition-colors duration-200"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {/* Current Colors */}
      <div className="flex flex-wrap gap-2 mb-4">
        {colors.map((color, index) => (
          <div key={index} className="relative group">
            <div
              className="w-10 h-10 rounded-lg border-2 border-border cursor-pointer hover:scale-110 transition-transform duration-200"
              style={{ backgroundColor: color }}
            />
            {colors.length > 1 && (
              <button
                onClick={() => removeColor(index)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Add Custom Color */}
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="w-10 h-10 rounded-lg border border-border cursor-pointer"
            />
            <button
              onClick={addColor}
              disabled={colors.length >= 8 || colors.includes(newColor)}
              className="btn-secondary flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          {/* Preset Palettes */}
          <div>
            <div className="text-sm font-medium text-fg mb-2">Preset Palettes</div>
            <div className="space-y-2">
              {presetPalettes.map((palette) => (
                <div key={palette.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-fg w-16">{palette.name}</span>
                    <div className="flex space-x-1">
                      {palette.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded border border-border"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => applyPalette(palette.colors)}
                    className="text-xs text-accent hover:text-opacity-80 transition-colors duration-200"
                  >
                    Apply
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
