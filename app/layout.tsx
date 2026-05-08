import type { Metadata } from 'next';
import { Syne, Space_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthProvider';
import Topbar from '@/components/layout/Topbar';
import BottomNav from '@/components/layout/BottomNav';
import Toast from '@/components/ui/Toast';

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-syne',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
});

export const metadata: Metadata = {
  title: 'XAU/USD Live Price Tracker',
  description: 'Track live XAU/USD gold spot prices in real time.',
  themeColor: '#070c12',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${spaceMono.variable}`}>
        <AuthProvider>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100dvh',
              maxWidth: '480px',
              margin: '0 auto',
              position: 'relative',
            }}
          >
            <Topbar />
            <main
              style={{
                flex: 1,
                overflowX: 'hidden',
                paddingBottom: 'calc(var(--nav-h) + 12px)',
              }}
            >
              {children}
            </main>
            <BottomNav />
          </div>
          <Toast />
        </AuthProvider>
      </body>
    </html>
  );
}
