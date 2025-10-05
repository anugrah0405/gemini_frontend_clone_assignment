'use client';

import { Inter } from 'next/font/google';
import { Provider } from 'react-redux';
import { store } from '@/src/lib/store';
import { ThemeProvider } from '@/src/components/providers/ThemeProvider';
import { Toaster as HotToaster } from 'react-hot-toast';
import './globals.css';
import { useEffect } from 'react';
import normalizeStorage from '@/src/lib/storage';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    normalizeStorage();
  }, []);
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Provider store={store}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <HotToaster position="top-center" />
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}