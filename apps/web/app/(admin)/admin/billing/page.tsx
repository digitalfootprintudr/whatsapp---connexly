import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from 'lib/auth';
import { requireRole } from 'lib/rbac';

export default async function AdminBillingPage() {
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
          <h1 className="text-3xl font-bold text-white mb-2">Billing Management</h1>
          <p className="text-gray-400">Manage vendor subscriptions and billing</p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Overview */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Revenue Overview</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Monthly Revenue</span>
                <span className="text-green-400 font-semibold">$12,450</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Active Subscriptions</span>
                <span className="text-blue-400 font-semibold">47</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Churn Rate</span>
                <span className="text-red-400 font-semibold">2.1%</span>
              </div>
            </div>
          </div>

          {/* Subscription Plans */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Subscription Plans</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Starter</span>
                <span className="text-xs bg-gray-600 px-2 py-1 rounded">$29/mo</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Professional</span>
                <span className="text-xs bg-blue-600 px-2 py-1 rounded">$99/mo</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Enterprise</span>
                <span className="text-xs bg-purple-600 px-2 py-1 rounded">$299/mo</span>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
            <div className="space-y-3">
              <div className="text-sm">
                <div className="flex justify-between">
                  <span>Acme Corp</span>
                  <span className="text-green-400">+$99</span>
                </div>
                <div className="text-gray-400 text-xs">2 hours ago</div>
              </div>
              <div className="text-sm">
                <div className="flex justify-between">
                  <span>Tech Solutions</span>
                  <span className="text-green-400">+$299</span>
                </div>
                <div className="text-gray-400 text-xs">1 day ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
