import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ball4Life Arena',
  description: 'Football turf booking system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} relative min-h-screen bg-black`}>
        {/* Test with regular img tag */}
        <div className="fixed inset-0 pointer-events-none">
          <img
            src="/background-logo.png"
            alt="Ball4Life Logo"
            className="mx-auto mt-20 w-[400px] h-[400px] object-contain z-50"
          />
        </div>

        <div className="relative z-10">
          <Header />
          <main className="min-h-[calc(100vh-160px)]">{children}</main>
        </div>
      </body>
    </html>
  );
}
