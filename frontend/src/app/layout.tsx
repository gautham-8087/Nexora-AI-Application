import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { ThemeProvider } from '../context/ThemeContext';
import { SearchProvider } from '../context/SearchContext';
import ErrorBoundary from '../components/ErrorBoundary';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nexora AI - Search Smarter. Understand Deeper.',
  description: 'SaaS-grade conversational research engine returning cited answers and statistics.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2225%22 fill=%22%2310b981%22/><text y=%2270%22 x=%2250%22 font-family=%22sans-serif%22 font-size=%2260%22 font-weight=%22bold%22 fill=%22white%22 text-anchor=%22middle%22%3EN%3C/text%3E%3C/svg%3E',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="antialiased selection:bg-emerald-500/30 font-sans">
        <ErrorBoundary>
          <ThemeProvider>
            <SearchProvider>
              {children}
            </SearchProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
