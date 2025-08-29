'use client';

import { usePathname } from 'next/navigation';
import Header from '../components/Header';
import Navigation from '../components/Navigation';

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't show header and navigation on login page
  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <Navigation />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

