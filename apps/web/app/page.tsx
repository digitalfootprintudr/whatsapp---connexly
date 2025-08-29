import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) {
    const role = (session as any).role as string | undefined;
    if (role === 'SUPER_ADMIN') redirect('/admin');
    redirect('/dashboard');
  }
  return (
    <main style={{ padding: 24 }}>
      <h1>Connexly</h1>
      <p>Welcome. Please sign in to continue.</p>
    </main>
  );
}

