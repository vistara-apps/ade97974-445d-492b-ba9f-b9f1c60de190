'use client';

import { useState } from 'react';
import { Share2, Download, Copy, ExternalLink } from 'lucide-react';

interface ShareButtonProps {
  onShare: () => void;
  onDownload: () => void;
  onCopyLink: () => void;
  variant?: 'default';
}

export function ShareButton({ 
  onShare, 
  onDownload, 
  onCopyLink, 
  variant = 'default' 
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    await onCopyLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-secondary flex items-center space-x-2"
      >
        <Share2 className="w-5 h-5" />
        <span>Share</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute bottom-full mb-2 left-0 w-48 glass-card p-2 z-50">
            <div className="space-y-1">
              <button
                onClick={() => {
                  onShare();
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-fg hover:bg-surface rounded-lg transition-colors duration-200"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Share to Farcaster</span>
              </button>
              
              <button
                onClick={() => {
                  onDownload();
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-fg hover:bg-surface rounded-lg transition-colors duration-200"
              >
                <Download className="w-4 h-4" />
                <span>Download Image</span>
              </button>
              
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-fg hover:bg-surface rounded-lg transition-colors duration-200"
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
