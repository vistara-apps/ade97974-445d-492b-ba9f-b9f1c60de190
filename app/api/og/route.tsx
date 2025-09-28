import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get('text') || 'LETTERCRAFT';

    // Create a simple SVG for the OG image
    const svg = `
      <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1a2332;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#2d3748;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="800" height="400" fill="url(#bg)"/>
        <text x="400" y="200" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="#ff6b6b">
          ${text}
        </text>
        <text x="400" y="280" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="#a0aec0">
          Transform your words into captivating visuals
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
