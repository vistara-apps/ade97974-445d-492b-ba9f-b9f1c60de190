import { NextRequest, NextResponse } from 'next/server';
import { generateRandomTransformation, generateImageFromText } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get('text') || 'LETTERCRAFT';

    // For frame previews, generate a stylized image
    if (text && text !== 'LETTERCRAFT') {
      const transformation = generateRandomTransformation();
      const imageDataUrl = await generateImageFromText(text, transformation);

      // Convert data URL to buffer for response
      const base64Data = imageDataUrl.replace(/^data:image\/png;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');

      return new NextResponse(imageBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=300', // 5 minutes cache
        },
      });
    }

    // Default OG image - create a styled SVG
    const svg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1a2332;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#2d3748;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:1" />
            <stop offset="25%" style="stop-color:#4ecdc4;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#45b7d1;stop-opacity:1" />
            <stop offset="75%" style="stop-color:#96ceb4;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#feca57;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="1200" height="630" fill="url(#bg)"/>
        <text x="600" y="280" font-family="Inter, sans-serif" font-size="72" font-weight="bold" text-anchor="middle" fill="url(#textGrad)">
          LETTERCRAFT
        </text>
        <text x="600" y="360" font-family="Inter, sans-serif" font-size="24" text-anchor="middle" fill="#a0aec0">
          Transform your words into captivating visuals
        </text>
        <text x="600" y="400" font-family="Inter, sans-serif" font-size="18" text-anchor="middle" fill="#718096">
          Create stunning stylized text art instantly
        </text>
        <circle cx="200" cy="500" r="8" fill="#ff6b6b"/>
        <circle cx="240" cy="500" r="8" fill="#4ecdc4"/>
        <circle cx="280" cy="500" r="8" fill="#45b7d1"/>
        <circle cx="320" cy="500" r="8" fill="#96ceb4"/>
        <circle cx="360" cy="500" r="8" fill="#feca57"/>
        <text x="600" y="520" font-family="Inter, sans-serif" font-size="16" text-anchor="middle" fill="#a0aec0">
          Dynamic colors • Random transformations • Instant generation
        </text>
      </svg>
    `;

    return new NextResponse(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('OG API error:', error);

    // Fallback SVG on error
    const fallbackSvg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="630" fill="#1a2332"/>
        <text x="600" y="315" font-family="Inter, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="#ff6b6b">
          LetterCraft
        </text>
      </svg>
    `;

    return new NextResponse(fallbackSvg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=60',
      },
    });
  }
}
