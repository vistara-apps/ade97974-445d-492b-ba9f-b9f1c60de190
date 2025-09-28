'use client';

import { useState, useEffect } from 'react';
import { AppShell } from './components/AppShell';
import { TextInput } from './components/TextInput';
import { ColorPicker } from './components/ColorPicker';
import { PresetCard } from './components/PresetCard';
import { GenerateButton } from './components/GenerateButton';
import { ShareButton } from './components/ShareButton';
import { StylizedText } from './components/StylizedText';
import { 
  TextTransformation, 
  Preset, 
  DEFAULT_TRANSFORMATION, 
  PRESET_TRANSFORMATIONS 
} from '@/lib/types';
import { 
  generateRandomTransformation, 
  generateImageFromText, 
  downloadImage, 
  shareToFarcaster 
} from '@/lib/utils';
import { Save, Shuffle, Sliders, Eye, EyeOff, Crown, Zap } from 'lucide-react';

export default function HomePage() {
  const [text, setText] = useState('HELLO');
  const [transformation, setTransformation] = useState<TextTransformation>(DEFAULT_TRANSFORMATION);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [showPreview, setShowPreview] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [availableFeatures, setAvailableFeatures] = useState({
    basic: [],
    premium: [],
    hasPremium: false
  });

  // Initialize with some default presets and check premium status
  useEffect(() => {
    const defaultPresets: Preset[] = Object.entries(PRESET_TRANSFORMATIONS).map(([name, transform], index) => ({
      presetId: `preset-${index}`,
      userId: 'demo-user',
      name: name.charAt(0).toUpperCase() + name.slice(1),
      transformations: transform,
      createdAt: new Date(),
    }));
    setPresets(defaultPresets);

    // Check premium status (mock for demo)
    const checkPremium = async () => {
      const premium = await hasPremiumAccess('demo-user');
      setIsPremium(premium);

      const features = await getAvailableFeatures('demo-user');
      setAvailableFeatures(features);
    };

    checkPremium();
  }, []);

  const handleGenerate = async () => {
    if (!text.trim()) return;
    
    setIsGenerating(true);
    
    // Add a small delay for better UX
    setTimeout(() => {
      const newTransformation = generateRandomTransformation();
      setTransformation(newTransformation);
      setIsGenerating(false);
    }, 800);
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
      shareToFarcaster(text, generatedImage);
    }
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}?text=${encodeURIComponent(text)}`;
    await navigator.clipboard.writeText(url);
  };

  const handleSavePreset = () => {
    const presetName = prompt('Enter a name for this preset:');
    if (!presetName) return;

    const newPreset: Preset = {
      presetId: `preset-${Date.now()}`,
      userId: 'demo-user',
      name: presetName,
      transformations: transformation,
      createdAt: new Date(),
    };

    setPresets(prev => [newPreset, ...prev]);
  };

  const handleApplyPreset = (preset: Preset) => {
    setTransformation(preset.transformations);
  };

  const handleDeletePreset = (presetId: string) => {
    setPresets(prev => prev.filter(p => p.presetId !== presetId));
  };

  const handleRenamePreset = (presetId: string, newName: string) => {
    setPresets(prev => prev.map(p => 
      p.presetId === presetId ? { ...p, name: newName } : p
    ));
  };

  const updateTransformation = (updates: Partial<TextTransformation>) => {
    setTransformation(prev => ({ ...prev, ...updates }));
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-fg">
            Transform Words into Art
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Create stunning stylized text visuals instantly. Perfect for social media, 
            presentations, or just having fun with typography.
          </p>
        </div>

        {/* Text Input */}
        <div className="glass-card p-6">
          <TextInput
            value={text}
            onChange={setText}
            onGenerate={handleGenerate}
            placeholder="Enter your text to stylize..."
            maxLength={50}
          />
        </div>

        {/* Preview */}
        {text && (
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-fg">Preview</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="btn-secondary flex items-center space-x-1"
                >
                  {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{showPreview ? 'Hide' : 'Show'}</span>
                </button>
                
                <GenerateButton
                  onClick={handleGenerate}
                  isLoading={isGenerating}
                  variant="secondary"
                  text="Randomize"
                />
              </div>
            </div>

            {showPreview && (
              <div className="bg-surface rounded-xl p-4 mb-4">
                <StylizedText
                  text={text}
                  transformation={transformation}
                  animate={!isGenerating}
                  onImageGenerated={handleImageGenerated}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSavePreset}
                className="btn-secondary flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Preset</span>
              </button>

              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Sliders className="w-4 h-4" />
                <span>Advanced</span>
              </button>

              <ShareButton
                onShare={handleShare}
                onDownload={handleDownload}
                onCopyLink={handleCopyLink}
              />
            </div>
          </div>
        )}

        {/* Advanced Controls */}
        {showAdvanced && (
          <div className="space-y-4">
            <ColorPicker
              colors={transformation.colors}
              onChange={(colors) => updateTransformation({ colors })}
            />

            <div className="glass-card p-4">
              <h3 className="font-medium text-fg mb-4">Transform Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-fg mb-2">
                    Font Size: {transformation.fontSize}px
                  </label>
                  <input
                    type="range"
                    min="24"
                    max="72"
                    value={transformation.fontSize}
                    onChange={(e) => updateTransformation({ fontSize: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-fg mb-2">
                    Rotation Range: ±{transformation.rotationRange}°
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="45"
                    value={transformation.rotationRange}
                    onChange={(e) => updateTransformation({ rotationRange: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-fg mb-2">
                    Scale Range: ±{(transformation.scaleRange * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="0.5"
                    step="0.05"
                    value={transformation.scaleRange}
                    onChange={(e) => updateTransformation({ scaleRange: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-fg mb-2">
                    Animation Type
                  </label>
                  <select
                    value={transformation.animationType}
                    onChange={(e) => updateTransformation({ animationType: e.target.value as any })}
                    className="text-input"
                  >
                    <option value="bounce">Bounce</option>
                    <option value="rotate">Rotate</option>
                    <option value="scale">Scale</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Presets */}
        {presets.length > 0 && (
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-fg mb-4">Saved Presets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {presets.map((preset) => (
                <PresetCard
                  key={preset.presetId}
                  preset={preset}
                  onApply={handleApplyPreset}
                  onDelete={handleDeletePreset}
                  onRename={handleRenamePreset}
                />
              ))}
            </div>
          </div>
        )}

        {/* Getting Started */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-fg mb-4">How to Use LetterCraft</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="font-medium text-fg">Enter Text</h3>
              <p className="text-sm text-gray-400">Type any word or phrase you want to stylize</p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="font-medium text-fg">Generate Style</h3>
              <p className="text-sm text-gray-400">Click generate or use presets to create unique styles</p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="font-medium text-fg">Share & Save</h3>
              <p className="text-sm text-gray-400">Download your creation or share it on Farcaster</p>
            </div>
          </div>
        </div>

        {/* Premium Features */}
        {!isPremium && (
          <div className="glass-card p-6 border-2 border-accent/50">
            <div className="flex items-center space-x-3 mb-4">
              <Crown className="w-6 h-6 text-accent" />
              <h2 className="text-xl font-semibold text-fg">Unlock Premium Features</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <h3 className="font-medium text-fg flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-accent" />
                  <span>Advanced Colors & Effects</span>
                </h3>
                <p className="text-sm text-gray-400">Access exclusive color palettes and premium animations</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-fg flex items-center space-x-2">
                  <Shuffle className="w-4 h-4 text-accent" />
                  <span>Unlimited Generation</span>
                </h3>
                <p className="text-sm text-gray-400">Remove daily limits and generate as much as you want</p>
              </div>
            </div>

            <button className="btn-primary w-full flex items-center justify-center space-x-2">
              <Crown className="w-4 h-4" />
              <span>Upgrade to Premium - $0.99/month</span>
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
