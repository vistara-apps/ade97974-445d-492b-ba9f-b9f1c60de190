import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { untrustedData } = body;
    
    // Handle frame button interactions
    const buttonIndex = untrustedData?.buttonIndex;
    
    if (buttonIndex === 1) {
      // Generate Text button clicked
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL}/api/og?text=HELLO" />
            <meta property="fc:frame:button:1" content="Try Different Text" />
            <meta property="fc:frame:button:1:action" content="post" />
            <meta property="fc:frame:button:2" content="Open App" />
            <meta property="fc:frame:button:2:action" content="link" />
            <meta property="fc:frame:button:2:target" content="${process.env.NEXT_PUBLIC_URL}" />
            <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL}/api/frame" />
          </head>
          <body>
            <h1>LetterCraft Frame</h1>
          </body>
        </html>`,
        {
          status: 200,
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );
    }

    // Default response
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL}/api/og" />
          <meta property="fc:frame:button:1" content="Generate Text" />
          <meta property="fc:frame:button:1:action" content="post" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL}/api/frame" />
        </head>
        <body>
          <h1>LetterCraft</h1>
        </body>
      </html>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    console.error('Frame API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return new NextResponse(
    `<!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL}/api/og" />
        <meta property="fc:frame:button:1" content="Generate Text" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL}/api/frame" />
      </head>
      <body>
        <h1>LetterCraft Frame</h1>
      </body>
    </html>`,
    {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    }
  );
}
