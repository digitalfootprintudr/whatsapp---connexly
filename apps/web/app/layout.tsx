import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './styles.css';
import Providers from './providers';
import Shell from './shell';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Connexly - WhatsApp Marketing Platform',
  description: 'Professional WhatsApp marketing platform for businesses',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Shell>
            {children}
          </Shell>
        </Providers>
      </body>
    </html>
  );
}

