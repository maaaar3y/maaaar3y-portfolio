import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/site/theme-provider';
import { LanguageProvider } from '@/components/site/language-provider';
import { fetchPublicContent } from '@/lib/supabase/server-data';

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

export async function generateMetadata(): Promise<Metadata> {
  let seo = null;
  let siteSettings = null;
  try {
    const content = await fetchPublicContent();
    seo = content.seoSettings;
    siteSettings = content.siteSettings;
  } catch {
    // fallback to defaults below
  }

  const title = seo?.page_title_en ?? siteSettings?.site_title_en ?? 'Youssef M. Marey — English Language & Translation Graduate';
  const description = seo?.meta_description_en ?? siteSettings?.description_en ?? 'Personal brand platform of Youssef M. Marey — English Language and Translation graduate, career development specialist, and bilingual project coordinator from Kafr El-Sheikh, Egypt.';
  const keywords = seo?.keywords ?? [
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
  ];
  const ogTitle = seo?.og_title_en ?? title;
  const ogDescription = seo?.og_description_en ?? description;
  const ogImage = seo?.og_image_url ?? undefined;
  const canonical = seo?.canonical_url ?? 'https://maaaar3y.com';

  return {
    metadataBase: new URL(canonical),
    title: {
      default: title,
      template: `%s — ${siteSettings?.owner_name_en ?? 'Youssef M. Marey'}`,
    },
    description,
    keywords,
    authors: [{ name: siteSettings?.owner_name_en ?? 'Youssef M. Marey' }],
    creator: siteSettings?.owner_name_en ?? 'Youssef M. Marey',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: canonical,
      siteName: siteSettings?.owner_name_en ?? 'Youssef M. Marey',
      title: ogTitle,
      description: ogDescription,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      ...(ogImage ? { images: [ogImage] } : {}),
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
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5fbfa' },
    { media: '(prefers-color-scheme: dark)', color: '#0a1418' },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let appearanceStyle = '';
  try {
    const content = await fetchPublicContent();
    const a = content.appearanceSettings;
    if (a) {
      const vars: string[] = [];
      if (a.primary_color) vars.push(`--primary: ${a.primary_color}`);
      if (a.accent_color) vars.push(`--accent: ${a.accent_color}`);
      if (a.background_color) vars.push(`--background: ${a.background_color}`);
      if (a.text_color) vars.push(`--foreground: ${a.text_color}`);
      if (a.border_radius) vars.push(`--radius: ${a.border_radius}`);
      if (vars.length > 0) {
        appearanceStyle = `:root { ${vars.join('; ')} }`;
      }
    }
  } catch {
    // use defaults
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {appearanceStyle && <style dangerouslySetInnerHTML={{ __html: appearanceStyle }} />}
      </head>
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
