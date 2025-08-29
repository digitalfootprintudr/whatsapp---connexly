import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

export async function requireRole(roles: string[]) {
  const session = await getServerSession(authOptions);
  if (!session || !(roles as any).includes((session as any).role)) {
    throw new Error('Forbidden');
  }
  return session as any;
}

export async function getSessionVendor() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');
  return { vendorId: (session as any).vendorId, role: (session as any).role };
}

