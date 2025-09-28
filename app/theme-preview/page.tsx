'use client';

import { AppShell } from '../components/AppShell';
import { StylizedText } from '../components/StylizedText';
import { useTheme } from '../components/ThemeProvider';
import { DEFAULT_TRANSFORMATION } from '@/lib/types';

export default function ThemePreviewPage() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { key: 'default', name: 'Social', description: 'Warm and inviting with coral accents' },
    { key: 'celo', name: 'Celo', description: 'Bold black and yellow design' },
    { key: 'solana', name: 'Solana', description: 'Purple gradient with modern feel' },
    { key: 'base', name: 'Base', description: 'Clean blue theme for Base ecosystem' },
    { key: 'coinbase', name: 'Coinbase', description: 'Professional navy with Coinbase blue' },
  ] as const;

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-fg">Theme Preview</h1>
          <p className="text-lg text-gray-400">
            Explore different visual themes for LetterCraft
          </p>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-fg mb-4">Current Theme: {theme}</h2>
          <div className="bg-surface rounded-xl p-8">
            <StylizedText
              text="LETTERCRAFT"
              transformation={DEFAULT_TRANSFORMATION}
              animate={false}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-fg">Available Themes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {themes.map((t) => (
              <div
                key={t.key}
                className={`glass-card p-4 cursor-pointer transition-all duration-200 hover:scale-105 ${
                  theme === t.key ? 'ring-2 ring-accent' : ''
                }`}
                onClick={() => setTheme(t.key as any)}
              >
                <h3 className="font-medium text-fg mb-2">{t.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{t.description}</p>
                <div className="text-xs text-accent">
                  {theme === t.key ? 'Currently Active' : 'Click to Apply'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-fg mb-4">Theme Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-fg mb-2">Design Tokens</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Background:</span>
                  <div className="w-6 h-6 bg-bg rounded border border-border"></div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Surface:</span>
                  <div className="w-6 h-6 bg-surface rounded border border-border"></div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Accent:</span>
                  <div className="w-6 h-6 bg-accent rounded border border-border"></div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Primary:</span>
                  <div className="w-6 h-6 bg-primary rounded border border-border"></div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-fg mb-2">Typography</h3>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-fg">Heading Text</div>
                <div className="text-base text-fg">Body text with normal weight</div>
                <div className="text-sm text-gray-400">Caption text in muted color</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
