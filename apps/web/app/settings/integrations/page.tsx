import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from 'lib/auth';
import { requireRole } from 'lib/rbac';

export default async function IntegrationsSettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  // Ensure user is a vendor admin
  requireRole(['VENDOR_ADMIN']);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Integrations</h1>
          <p className="text-gray-400">Connect with third-party services and tools</p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* WhatsApp Business */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">WhatsApp Business</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-2">Connect your WhatsApp Business account</p>
                <span className="text-sm text-green-400">✓ Connected</span>
              </div>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                Manage
              </button>
            </div>
          </div>

          {/* CRM Integration */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">CRM Integration</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-2">Connect with popular CRM systems</p>
                <span className="text-sm text-gray-400">Not connected</span>
              </div>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                Connect
              </button>
            </div>
          </div>

          {/* Email Marketing */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Email Marketing</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-2">Integrate with email marketing platforms</p>
                <span className="text-sm text-gray-400">Not connected</span>
              </div>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                Connect
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
