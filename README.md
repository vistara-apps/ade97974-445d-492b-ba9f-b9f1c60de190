# LetterCraft - Transform Words into Art

A Base Mini App for creating stylized text visuals with dynamic transformations and animations.

## Features

- **Instant Text Styling**: Transform any text into visually appealing art with random styling
- **Customizable Presets**: Save and reuse your favorite text transformation settings
- **Multiple Themes**: Support for Base, Celo, Solana, Coinbase, and custom themes
- **Farcaster Integration**: Share your creations directly to Farcaster
- **Advanced Controls**: Fine-tune colors, animations, fonts, and transformations
- **Export Options**: Download as PNG or share via link

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Blockchain**: OnchainKit for Base integration
- **Social**: Farcaster Frame support
- **TypeScript**: Full type safety throughout

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Enter Text**: Type any word or phrase you want to stylize
2. **Generate**: Click the generate button to create a random stylized version
3. **Customize**: Use advanced controls to fine-tune colors, animations, and effects
4. **Save Presets**: Save your favorite combinations for future use
5. **Share**: Download your creation or share it on Farcaster

## Themes

LetterCraft supports multiple blockchain-inspired themes:

- **Social**: Warm coral accents with dark teal background
- **Celo**: Bold black and yellow design
- **Solana**: Purple gradients with modern aesthetics
- **Base**: Clean blue theme for Base ecosystem
- **Coinbase**: Professional navy with Coinbase blue

## API Endpoints

- `/api/frame` - Farcaster Frame integration
- `/api/og` - Open Graph image generation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
