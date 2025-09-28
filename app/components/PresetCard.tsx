'use client';

import { useState } from 'react';
import { Trash2, Edit3, Copy, Heart } from 'lucide-react';
import { Preset } from '@/lib/types';

interface PresetCardProps {
  preset: Preset;
  onApply: (preset: Preset) => void;
  onDelete: (presetId: string) => void;
  onRename: (presetId: string, newName: string) => void;
  variant?: 'default' | 'compact';
}

export function PresetCard({ 
  preset, 
  onApply, 
  onDelete, 
  onRename, 
  variant = 'default' 
}: PresetCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(preset.name);
  const [isLiked, setIsLiked] = useState(false);

  const handleRename = () => {
    if (editName.trim() && editName !== preset.name) {
      onRename(preset.presetId, editName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setEditName(preset.name);
      setIsEditing(false);
    }
  };

  const copyPreset = () => {
    navigator.clipboard.writeText(JSON.stringify(preset.transformations));
    // You could add a toast notification here
  };

  return (
    <div className={`glass-card p-4 hover:bg-opacity-80 transition-all duration-200 ${
      variant === 'compact' ? 'p-3' : 'p-4'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        {isEditing ? (
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleRename}
            onKeyPress={handleKeyPress}
            className="text-input text-sm py-1 px-2 flex-1 mr-2"
            autoFocus
          />
        ) : (
          <h3 className="font-medium text-fg truncate flex-1">{preset.name}</h3>
        )}
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-1 rounded transition-colors duration-200 ${
              isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-gray-400 hover:text-accent rounded transition-colors duration-200"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          
          <button
            onClick={copyPreset}
            className="p-1 text-gray-400 hover:text-accent rounded transition-colors duration-200"
          >
            <Copy className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onDelete(preset.presetId)}
            className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Color Preview */}
      <div className="flex space-x-1 mb-3">
        {preset.transformations.colors.slice(0, 6).map((color, index) => (
          <div
            key={index}
            className="w-6 h-6 rounded border border-border"
            style={{ backgroundColor: color }}
          />
        ))}
        {preset.transformations.colors.length > 6 && (
          <div className="w-6 h-6 rounded border border-border bg-surface flex items-center justify-center text-xs text-gray-400">
            +{preset.transformations.colors.length - 6}
          </div>
        )}
      </div>

      {/* Properties */}
      <div className="text-xs text-gray-400 space-y-1 mb-3">
        <div className="flex justify-between">
          <span>Animation:</span>
          <span className="capitalize">{preset.transformations.animationType}</span>
        </div>
        <div className="flex justify-between">
          <span>Font Size:</span>
          <span>{preset.transformations.fontSize}px</span>
        </div>
        <div className="flex justify-between">
          <span>Rotation:</span>
          <span>±{preset.transformations.rotationRange}°</span>
        </div>
      </div>

      {/* Apply Button */}
      <button
        onClick={() => onApply(preset)}
        className="btn-primary w-full text-sm py-2"
      >
        Apply Preset
      </button>

      {/* Created Date */}
      <div className="text-xs text-gray-500 mt-2 text-center">
        Created {new Date(preset.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}
