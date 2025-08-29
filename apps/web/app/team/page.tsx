import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from 'lib/auth';
import { requireRole } from 'lib/rbac';

export default async function TeamPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  // Ensure user is a vendor admin or agent
  requireRole(['VENDOR_ADMIN', 'AGENT']);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Team Management</h1>
          <p className="text-gray-400">Manage your team members and their permissions</p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team Members */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Team Members</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">JD</span>
                  </div>
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-gray-400">john@example.com</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-600 text-xs rounded-full">Agent</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">JS</span>
                  </div>
                  <div>
                    <p className="font-medium">Jane Smith</p>
                    <p className="text-sm text-gray-400">jane@example.com</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-blue-600 text-xs rounded-full">Admin</span>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Role Permissions</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Send Messages</span>
                <span className="text-green-400">✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Create Campaigns</span>
                <span className="text-green-400">✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Manage Templates</span>
                <span className="text-green-400">✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">View Analytics</span>
                <span className="text-green-400">✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Manage Team</span>
                <span className="text-red-400">✗</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
