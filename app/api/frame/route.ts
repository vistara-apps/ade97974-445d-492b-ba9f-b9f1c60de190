import { NextRequest, NextResponse } from 'next/server';
import { generateRandomTransformation, generateImageFromText } from '@/lib/utils';

interface FrameState {
  text?: string;
  step?: 'input' | 'generated';
  imageUrl?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { untrustedData } = body;

    const buttonIndex = untrustedData?.buttonIndex;
    const inputText = untrustedData?.inputText;
    const state: FrameState = untrustedData?.state ? JSON.parse(untrustedData.state) : {};

    // Handle different frame states
    if (state.step === 'input' && inputText) {
      // User provided text, generate image
      const transformation = generateRandomTransformation();
      const imageUrl = await generateImageFromText(inputText, transformation);

      const newState: FrameState = {
        text: inputText,
        step: 'generated',
        imageUrl
      };

      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${imageUrl}" />
            <meta property="fc:frame:button:1" content="🎨 New Style" />
            <meta property="fc:frame:button:1:action" content="post" />
            <meta property="fc:frame:button:2" content="📝 Change Text" />
            <meta property="fc:frame:button:2:action" content="post" />
            <meta property="fc:frame:button:3" content="🌐 Open App" />
            <meta property="fc:frame:button:3:action" content="link" />
            <meta property="fc:frame:button:3:target" content="${process.env.NEXT_PUBLIC_URL}" />
            <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL}/api/frame" />
            <meta property="fc:frame:state" content="${JSON.stringify(newState)}" />
          </head>
          <body>
            <p>Your stylized text: "${inputText}"</p>
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

    if (state.step === 'generated') {
      if (buttonIndex === 1) {
        // New Style - regenerate with same text
        const transformation = generateRandomTransformation();
        const imageUrl = await generateImageFromText(state.text!, transformation);

        const newState: FrameState = {
          text: state.text,
          step: 'generated',
          imageUrl
        };

        return new NextResponse(
          `<!DOCTYPE html>
          <html>
            <head>
              <meta property="fc:frame" content="vNext" />
              <meta property="fc:frame:image" content="${imageUrl}" />
              <meta property="fc:frame:button:1" content="🎨 New Style" />
              <meta property="fc:frame:button:1:action" content="post" />
              <meta property="fc:frame:button:2" content="📝 Change Text" />
              <meta property="fc:frame:button:2:action" content="post" />
              <meta property="fc:frame:button:3" content="🌐 Open App" />
              <meta property="fc:frame:button:3:action" content="link" />
              <meta property="fc:frame:button:3:target" content="${process.env.NEXT_PUBLIC_URL}" />
              <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL}/api/frame" />
              <meta property="fc:frame:state" content="${JSON.stringify(newState)}" />
            </head>
            <body>
              <p>Your stylized text: "${state.text}"</p>
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

      if (buttonIndex === 2) {
        // Change Text - go back to input
        const inputState: FrameState = { step: 'input' };

        return new NextResponse(
          `<!DOCTYPE html>
          <html>
            <head>
              <meta property="fc:frame" content="vNext" />
              <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL}/api/og?text=Enter+your+text" />
              <meta property="fc:frame:input:text" content="Enter your text to stylize..." />
              <meta property="fc:frame:button:1" content="🎨 Generate Style" />
              <meta property="fc:frame:button:1:action" content="post" />
              <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL}/api/frame" />
              <meta property="fc:frame:state" content="${JSON.stringify(inputState)}" />
            </head>
            <body>
              <p>Enter text to create stylized art!</p>
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
    }

    // Default/Initial state - show input form
    const initialState: FrameState = { step: 'input' };

    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL}/api/og" />
          <meta property="fc:frame:input:text" content="Enter your text to stylize..." />
          <meta property="fc:frame:button:1" content="🎨 Generate Style" />
          <meta property="fc:frame:button:1:action" content="post" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL}/api/frame" />
          <meta property="fc:frame:state" content="${JSON.stringify(initialState)}" />
        </head>
        <body>
          <p>Transform your words into captivating visuals with LetterCraft! 🎨</p>
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
