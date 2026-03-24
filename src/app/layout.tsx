import type { Metadata } from 'next';
// eslint-disable-next-line camelcase
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'AI Resume-to-Job Match',
  description: 'AI-powered resume scoring against job descriptions',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans min-h-screen bg-gray-50 flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
