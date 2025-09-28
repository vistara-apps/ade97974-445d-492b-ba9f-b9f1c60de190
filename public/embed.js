/**
 * LetterCraft Embeddable Widget
 *
 * Usage:
 * <div id="lettercraft-widget"></div>
 * <script src="https://your-domain.com/embed.js"></script>
 * <script>
 *   LetterCraft.init('lettercraft-widget', {
 *     theme: 'dark',
 *     maxLength: 30,
 *     placeholder: 'Enter your text...',
 *     showDownload: true,
 *     showShare: true
 *   });
 * </script>
 */

(function() {
  'use strict';

  // Configuration
  const API_BASE = 'https://lettercraft.app'; // Replace with your domain
  const WIDGET_VERSION = '1.0.0';

  // Main widget class
  class LetterCraftWidget {
    constructor(containerId, config = {}) {
      this.containerId = containerId;
      this.config = {
        theme: 'dark',
        maxLength: 30,
        placeholder: 'Enter text...',
        showDownload: true,
        showShare: true,
        width: '100%',
        height: 'auto',
        ...config
      };

      this.state = {
        text: '',
        transformation: null,
        isGenerating: false,
        generatedImage: ''
      };

      this.init();
    }

    async init() {
      const container = document.getElementById(this.containerId);
      if (!container) {
        console.error('LetterCraft: Container element not found');
        return;
      }

      // Load required styles
      this.loadStyles();

      // Create widget HTML
      container.innerHTML = this.createWidgetHTML();

      // Bind events
      this.bindEvents();

      // Load initial transformation
      this.generateTransformation();
    }

    loadStyles() {
      if (document.getElementById('lettercraft-styles')) return;

      const styles = document.createElement('style');
      styles.id = 'lettercraft-styles';
      styles.textContent = `
        .lettercraft-widget {
          font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .lettercraft-input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #4a5568;
          border-radius: 8px;
          background: transparent;
          color: inherit;
          font-size: 16px;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .lettercraft-input:focus {
          border-color: #ff6b6b;
        }

        .lettercraft-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .lettercraft-btn-primary {
          background: #ff6b6b;
          color: white;
        }

        .lettercraft-btn-primary:hover {
          background: #e55a5a;
        }

        .lettercraft-btn-secondary {
          background: #4a5568;
          color: white;
        }

        .lettercraft-btn-secondary:hover {
          background: #2d3748;
        }

        .lettercraft-preview {
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          padding: 16px;
        }

        .lettercraft-loading {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #ff6b6b;
          border-radius: 50%;
          animation: lettercraft-spin 1s linear infinite;
        }

        @keyframes lettercraft-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .lettercraft-letter {
          display: inline-block;
          margin: 0 1px;
          transition: all 0.3s ease-out;
        }

        .lettercraft-animate-bounce {
          animation: lettercraft-bounce 0.6s ease-in-out;
        }

        .lettercraft-animate-rotate {
          animation: lettercraft-rotate 0.6s ease-in-out;
        }

        .lettercraft-animate-scale {
          animation: lettercraft-scale 0.6s ease-in-out;
        }

        @keyframes lettercraft-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes lettercraft-rotate {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(180deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes lettercraft-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
      `;
      document.head.appendChild(styles);
    }

    createWidgetHTML() {
      const { theme, placeholder, showDownload, showShare } = this.config;

      return `
        <div class="lettercraft-widget" style="
          background: ${theme === 'dark' ? '#1a2332' : '#ffffff'};
          color: ${theme === 'dark' ? '#ffffff' : '#000000'};
          width: ${this.config.width};
          height: ${this.config.height};
        ">
          <div style="padding: 20px;">
            <div style="text-align: center; margin-bottom: 16px;">
              <h2 style="font-size: 18px; font-weight: 600; margin: 0 0 4px 0;">LetterCraft</h2>
              <p style="font-size: 14px; opacity: 0.7; margin: 0;">Transform text into art</p>
            </div>

            <div style="margin-bottom: 16px;">
              <input
                type="text"
                id="lettercraft-text-input"
                class="lettercraft-input"
                placeholder="${placeholder}"
                maxlength="${this.config.maxLength}"
                style="background: ${theme === 'dark' ? '#2d3748' : '#f7fafc'};"
              />
            </div>

            <div id="lettercraft-preview" class="lettercraft-preview" style="
              background: ${theme === 'dark' ? '#2d3748' : '#f7fafc'};
              display: none;
            ">
              <div id="lettercraft-text-display"></div>
            </div>

            <div style="display: flex; gap: 8px; margin-top: 16px;">
              <button id="lettercraft-generate-btn" class="lettercraft-btn lettercraft-btn-primary" style="flex: 1;">
                <span id="lettercraft-generate-text">Generate</span>
                <div id="lettercraft-loading" class="lettercraft-loading" style="display: none;"></div>
              </button>

              ${showDownload ? `
                <button id="lettercraft-download-btn" class="lettercraft-btn lettercraft-btn-secondary" title="Download" style="display: none;">
                  📥
                </button>
              ` : ''}

              ${showShare ? `
                <button id="lettercraft-share-btn" class="lettercraft-btn lettercraft-btn-secondary" title="Copy Image" style="display: none;">
                  📋
                </button>
              ` : ''}
            </div>

            <div style="text-align: center; margin-top: 16px; font-size: 12px; opacity: 0.5;">
              Powered by <a href="https://lettercraft.app" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;">LetterCraft</a>
            </div>
          </div>
        </div>
      `;
    }

    bindEvents() {
      const textInput = document.getElementById('lettercraft-text-input');
      const generateBtn = document.getElementById('lettercraft-generate-btn');
      const downloadBtn = document.getElementById('lettercraft-download-btn');
      const shareBtn = document.getElementById('lettercraft-share-btn');

      if (textInput) {
        textInput.addEventListener('input', (e) => {
          this.state.text = e.target.value;
          this.updatePreview();
        });

        textInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            this.generate();
          }
        });
      }

      if (generateBtn) {
        generateBtn.addEventListener('click', () => this.generate());
      }

      if (downloadBtn) {
        downloadBtn.addEventListener('click', () => this.download());
      }

      if (shareBtn) {
        shareBtn.addEventListener('click', () => this.share());
      }
    }

    updatePreview() {
      const preview = document.getElementById('lettercraft-preview');
      const textDisplay = document.getElementById('lettercraft-text-display');
      const downloadBtn = document.getElementById('lettercraft-download-btn');
      const shareBtn = document.getElementById('lettercraft-share-btn');

      if (!preview || !textDisplay) return;

      if (this.state.text.trim()) {
        preview.style.display = 'flex';
        textDisplay.innerHTML = this.renderText(this.state.text, this.state.transformation);

        if (downloadBtn) downloadBtn.style.display = 'block';
        if (shareBtn) shareBtn.style.display = 'block';
      } else {
        preview.style.display = 'none';
        if (downloadBtn) downloadBtn.style.display = 'none';
        if (shareBtn) shareBtn.style.display = 'none';
      }
    }

    renderText(text, transformation) {
      if (!transformation) return text;

      return text.split('').map((letter, index) => {
        if (letter === ' ') return ' ';

        const color = transformation.colors[index % transformation.colors.length];
        const rotation = (Math.random() - 0.5) * 2 * transformation.rotationRange;
        const scale = 1 + (Math.random() - 0.5) * 2 * transformation.scaleRange;

        return `<span
          class="lettercraft-letter lettercraft-animate-${transformation.animationType}"
          style="
            color: ${color};
            transform: rotate(${rotation}deg) scale(${scale});
            font-size: ${transformation.fontSize}px;
            font-weight: ${transformation.fontWeight};
            letter-spacing: ${transformation.letterSpacing}px;
            animation-delay: ${index * 100}ms;
          "
        >${letter}</span>`;
      }).join('');
    }

    async generate() {
      if (!this.state.text.trim()) return;

      this.setGenerating(true);
      await this.generateTransformation();
      this.updatePreview();
      await this.generateImage();
      this.setGenerating(false);
    }

    setGenerating(isGenerating) {
      this.state.isGenerating = isGenerating;

      const generateText = document.getElementById('lettercraft-generate-text');
      const loading = document.getElementById('lettercraft-loading');
      const generateBtn = document.getElementById('lettercraft-generate-btn');

      if (generateText) generateText.style.display = isGenerating ? 'none' : 'inline';
      if (loading) loading.style.display = isGenerating ? 'inline-block' : 'none';
      if (generateBtn) generateBtn.disabled = isGenerating;
    }

    async generateTransformation() {
      // Simple random transformation generation
      const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
      const animations = ['bounce', 'rotate', 'scale'];

      this.state.transformation = {
        colors: colors.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 3),
        rotationRange: Math.random() * 20 + 5,
        scaleRange: Math.random() * 0.3 + 0.1,
        animationType: animations[Math.floor(Math.random() * animations.length)],
        fontSize: Math.random() * 20 + 40,
        fontWeight: Math.random() > 0.5 ? 'bold' : 'normal',
        letterSpacing: Math.random() * 3 + 1,
        backgroundType: 'transparent'
      };
    }

    async generateImage() {
      // For embedded widget, we'll use a simple approach
      // In production, this would call the API
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx || !this.state.transformation) return;

      canvas.width = 800;
      canvas.height = 400;

      ctx.font = `${this.state.transformation.fontWeight} ${this.state.transformation.fontSize}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const letters = this.state.text.split('');
      const totalWidth = letters.length * (this.state.transformation.fontSize + this.state.transformation.letterSpacing);
      const startX = canvas.width / 2 - totalWidth / 2;

      letters.forEach((letter, index) => {
        if (letter === ' ') return;

        const x = startX + index * (this.state.transformation.fontSize + this.state.transformation.letterSpacing);
        const y = canvas.height / 2;
        const color = this.state.transformation.colors[index % this.state.transformation.colors.length];
        const rotation = (Math.random() - 0.5) * 2 * this.state.transformation.rotationRange * (Math.PI / 180);
        const scale = 1 + (Math.random() - 0.5) * 2 * this.state.transformation.scaleRange;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.scale(scale, scale);
        ctx.fillStyle = color;
        ctx.fillText(letter, 0, 0);
        ctx.restore();
      });

      this.state.generatedImage = canvas.toDataURL('image/png');
    }

    download() {
      if (!this.state.generatedImage) return;

      const link = document.createElement('a');
      link.download = `lettercraft-${this.state.text.toLowerCase()}.png`;
      link.href = this.state.generatedImage;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    share() {
      if (!this.state.generatedImage) return;

      navigator.clipboard.writeText(this.state.generatedImage).then(() => {
        this.showNotification('Image copied to clipboard!');
      }).catch(() => {
        this.showNotification('Failed to copy image');
      });
    }

    showNotification(message) {
      const notification = document.createElement('div');
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 14px;
        z-index: 10000;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 3000);
    }
  }

  // Global API
  window.LetterCraft = {
    init: function(containerId, config) {
      return new LetterCraftWidget(containerId, config);
    },

    // Utility functions
    generateRandomTransformation: function() {
      return {
        colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'],
        rotationRange: Math.random() * 20 + 5,
        scaleRange: Math.random() * 0.3 + 0.1,
        animationType: 'bounce',
        fontSize: Math.random() * 20 + 40,
        fontWeight: 'bold',
        letterSpacing: Math.random() * 3 + 1,
        backgroundType: 'transparent'
      };
    }
  };

})();

