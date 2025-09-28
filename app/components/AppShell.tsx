'use client';

import { ReactNode } from 'react';
import { Palette, Settings2, Share2 } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface AppShellProps {
  children: ReactNode;
  variant?: 'default' | 'compact';
}

export function AppShell({ children, variant = 'default' }: AppShellProps) {
  const { theme, setTheme } = useTheme();

  const themes = [
    { key: 'default', name: 'Social', color: '#ff6b6b' },
    { key: 'celo', name: 'Celo', color: '#fbcc5c' },
    { key: 'solana', name: 'Solana', color: '#9945ff' },
    { key: 'base', name: 'Base', color: '#0052ff' },
    { key: 'coinbase', name: 'Coinbase', color: '#0052ff' },
  ] as const;

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="glass-card m-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-fg">LetterCraft</h1>
              <p className="text-sm text-gray-400">Transform words into art</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative group">
              <button className="p-2 hover:bg-surface rounded-lg transition-colors duration-200">
                <Settings2 className="w-5 h-5 text-fg" />
              </button>
              
              {/* Theme Selector Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-48 glass-card p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="text-sm font-medium text-fg mb-2">Theme</div>
                <div className="space-y-1">
                  {themes.map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setTheme(t.key as any)}
                      className={`w-full flex items-center space-x-2 px-2 py-1 rounded-lg text-sm transition-colors duration-200 ${
                        theme === t.key ? 'bg-accent text-white' : 'hover:bg-surface text-fg'
                      }`}
                    >
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: t.color }}
                      />
                      <span>{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={variant === 'compact' ? 'px-2' : 'px-4'}>
        {children}
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-gray-400">
        <p>Built on Base • Powered by OnchainKit</p>
      </footer>
    </div>
  );
}
