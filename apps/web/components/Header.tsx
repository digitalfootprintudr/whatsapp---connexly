'use client';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import useSWR from 'swr';

export default function Header() {
  const { data } = useSession();
  const { data: vendorData } = useSWR('/api/me/vendor', (url) => fetch(url).then(r => r.json()));
  const userRole = (data as any)?.role as string | undefined;
  const logo = vendorData?.vendor?.logoUrlLight as string | undefined;

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <Link href="/" className="text-white font-bold text-lg flex items-center gap-2 hover:text-blue-400 transition-colors">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="Logo" className="h-6 w-auto" />
          ) : null}
          <span>Connexly</span>
        </Link>
        {userRole && (
          <span className="text-gray-300 text-xs border border-gray-600 px-2 py-1 rounded bg-gray-700">
            {userRole}
          </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
        <Link href="/admin" className="text-gray-300 hover:text-white transition-colors">Admin</Link>
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="text-gray-300 hover:text-white transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}

