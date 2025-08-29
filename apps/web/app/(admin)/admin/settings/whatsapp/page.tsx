import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from 'lib/auth';
import { requireRole } from 'lib/rbac';
import WhatsAppAdminConfig from './components/WhatsAppAdminConfig';

export default async function WhatsAppAdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) { redirect('/login'); }
  requireRole(['SUPER_ADMIN']);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">WhatsApp Business Admin</h1>
          <p className="text-gray-400">Manage WhatsApp Business API configuration for embedded signup</p>
        </div>

        <WhatsAppAdminConfig />
      </div>
    </div>
  );
}
