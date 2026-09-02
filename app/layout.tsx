import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/site/theme-provider';
import { LanguageProvider } from '@/components/site/language-provider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://maaaar3y.com'),
  title: {
    default: 'Youssef M. Marey — English Language & Translation Graduate',
    template: '%s — Youssef M. Marey',
  },
  description:
    'Personal brand platform of Youssef M. Marey — English Language and Translation graduate, career development specialist, and bilingual project coordinator from Kafr El-Sheikh, Egypt.',
  keywords: [
    'Youssef Marey',
    'Youssef M. Marey',
    'English Translation',
    'Career Development',
    'Kafrelsheikh University',
    'UCCD',
    'Project Management',
    'Monitoring and Evaluation',
    'Bilingual Professional',
    'Egypt',
  ],
  authors: [{ name: 'Youssef M. Marey' }],
  creator: 'Youssef M. Marey',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://maaaar3y.com',
    siteName: 'Youssef M. Marey',
    title: 'Youssef M. Marey — Personal Brand Platform',
    description:
      'English Language & Translation graduate, career development specialist, and bilingual project coordinator.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Youssef M. Marey',
    description:
      'English Language & Translation graduate, career development specialist, and bilingual project coordinator.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5fbfa' },
    { media: '(prefers-color-scheme: dark)', color: '#0a1418' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
