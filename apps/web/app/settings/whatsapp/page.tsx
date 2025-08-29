import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from 'lib/auth';
import { requireRole } from 'lib/rbac';
import { prisma } from '@whatsjet/db/src';
import WhatsAppSetupForm from './components/WhatsAppSetupForm';
import WhatsAppStatus from './components/WhatsAppStatus';

export default async function WhatsAppSetupPage() {
  const session = await getServerSession(authOptions);
  if (!session) { redirect('/login'); }
  requireRole(['VENDOR_ADMIN']);

  // Get current vendor's WhatsApp configuration
  const vendor = await prisma.vendor.findUnique({
    where: { id: (session as any).vendorId },
    select: {
      id: true,
      name: true,
      metaAppId: true,
      wabaId: true,
      phoneNumberId: true,
      accessToken: true,
      webhookUrl: true,
      webhookVerifyToken: true,
    },
  });

  if (!vendor) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">WhatsApp Business Setup</h1>
          <p className="text-gray-400">Configure your WhatsApp Business API integration</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Setup Section */}
          <div className="lg:col-span-2">
            <WhatsAppSetupForm vendor={vendor} />
          </div>

          {/* Status and Info */}
          <div className="lg:col-span-1">
            <WhatsAppStatus vendor={vendor} />
          </div>
        </div>
      </div>
    </div>
  );
}
