import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from 'lib/auth';
import { requireRole } from 'lib/rbac';
import Link from 'next/link';
import {
  UserIcon,
  BellIcon,
  CogIcon,
  KeyIcon,
  GlobeAltIcon,
  CloudIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  // Ensure user is a vendor admin
  requireRole(['VENDOR_ADMIN']);

  const settingsSections = [
    {
      title: 'Profile',
      description: 'Manage your profile and account information',
      href: '/settings/profile',
      icon: UserIcon,
      color: 'bg-blue-600',
    },
    {
      title: 'WhatsApp Business',
      description: 'Setup and configure WhatsApp Business API',
      href: '/settings/whatsapp',
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-green-600',
    },
    {
      title: 'Notifications',
      description: 'Configure notification preferences',
      href: '/settings/notifications',
      icon: BellIcon,
      color: 'bg-green-600',
    },
    {
      title: 'General Settings',
      description: 'Basic platform configuration',
      href: '/settings/general',
      icon: CogIcon,
      color: 'bg-purple-600',
    },
    {
      title: 'API Keys',
      description: 'Manage your API access keys',
      href: '/settings/api-keys',
      icon: KeyIcon,
      color: 'bg-yellow-600',
    },
    {
      title: 'Integrations',
      description: 'Connect with third-party services',
      href: '/settings/integrations',
      icon: CloudIcon,
      color: 'bg-indigo-600',
    },
    {
      title: 'Webhooks',
      description: 'Configure webhook endpoints',
      href: '/settings/webhooks',
      icon: GlobeAltIcon,
      color: 'bg-red-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Configure your platform preferences and integrations</p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${section.color}`}>
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {section.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
