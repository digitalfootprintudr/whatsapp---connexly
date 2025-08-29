import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from 'lib/auth';
import { requireRole } from 'lib/rbac';

export default async function EmbeddedSignupPage() {
  const session = await getServerSession(authOptions);
  if (!session) { redirect('/login'); }
  requireRole(['VENDOR_ADMIN']);

  // Redirect vendor to start the embedded signup process
  // The actual configuration will be handled by super admin
  redirect('/onboarding/start');
}
