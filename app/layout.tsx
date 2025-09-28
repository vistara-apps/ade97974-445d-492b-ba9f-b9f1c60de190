import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ThemeProvider } from './components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LetterCraft - Transform Words into Art',
  description: 'Transform your words into captivating visuals, instantly.',
  openGraph: {
    title: 'LetterCraft',
    description: 'Transform your words into captivating visuals, instantly.',
    images: ['/og-image.png'],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${process.env.NEXT_PUBLIC_URL}/api/og`,
    'fc:frame:button:1': 'Generate Text',
    'fc:frame:button:1:action': 'post',
    'fc:frame:post_url': `${process.env.NEXT_PUBLIC_URL}/api/frame`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <Providers>
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
