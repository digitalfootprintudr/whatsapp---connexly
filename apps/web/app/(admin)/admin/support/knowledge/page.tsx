import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from 'lib/auth';
import { requireRole } from 'lib/rbac';

export default async function AdminSupportKnowledgePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  // Ensure user is a super admin
  requireRole(['SUPER_ADMIN']);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Knowledge Base Management</h1>
          <p className="text-gray-400">Manage support documentation and help articles</p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Articles */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Help Articles</h2>
            <div className="space-y-4">
              <div className="p-3 bg-gray-700 rounded">
                <h3 className="font-medium mb-1">Getting Started Guide</h3>
                <p className="text-sm text-gray-400 mb-2">Complete setup guide for new vendors</p>
                <div className="flex space-x-2">
                  <span className="text-xs bg-blue-600 px-2 py-1 rounded">Published</span>
                  <span className="text-xs bg-gray-600 px-2 py-1 rounded">Beginner</span>
                </div>
              </div>
              
              <div className="p-3 bg-gray-700 rounded">
                <h3 className="font-medium mb-1">API Integration</h3>
                <p className="text-sm text-gray-400 mb-2">How to integrate with external systems</p>
                <div className="flex space-x-2">
                  <span className="text-xs bg-blue-600 px-2 py-1 rounded">Published</span>
                  <span className="text-xs bg-yellow-600 px-2 py-1 rounded">Advanced</span>
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Categories</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Getting Started</span>
                <span className="text-xs bg-gray-600 px-2 py-1 rounded">12 articles</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Campaigns</span>
                <span className="text-xs bg-gray-600 px-2 py-1 rounded">8 articles</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Templates</span>
                <span className="text-xs bg-gray-600 px-2 py-1 rounded">6 articles</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">API & Integrations</span>
                <span className="text-xs bg-gray-600 px-2 py-1 rounded">4 articles</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
