'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  CheckCircleIcon, 
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface OnboardingSuccessData {
  businessName: string;
  phoneNumber: string;
  displayName: string;
  wabaId: string;
  phoneNumberId: string;
}

export default function OnboardingSuccessPage() {
  const searchParams = useSearchParams();
  const [onboardingData, setOnboardingData] = useState<OnboardingSuccessData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get('sessionId');
    const vendorId = searchParams.get('vendorId');

    if (sessionId && vendorId) {
      loadOnboardingData(sessionId, vendorId);
    } else {
      setIsLoading(false);
    }
  }, [searchParams]);

  const loadOnboardingData = async (sessionId: string, vendorId: string) => {
    try {
      const response = await fetch(`/api/onboarding/success-data?sessionId=${sessionId}&vendorId=${vendorId}`);
      if (response.ok) {
        const data = await response.json();
        setOnboardingData(data);
      }
    } catch (error) {
      console.error('Failed to load onboarding data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h1 className="text-2xl font-semibold text-white mb-2">Completing Setup...</h1>
          <p className="text-gray-400">Please wait while we finalize your WhatsApp Business integration.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">🎉 Setup Complete!</h1>
          <p className="text-xl text-gray-400">
            Your WhatsApp Business API integration is now active and ready to use.
          </p>
        </div>

        {/* Integration Details */}
        <div className="bg-gray-800 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            Integration Summary
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <BuildingOfficeIcon className="w-6 h-6 text-blue-400" />
                <h3 className="font-semibold text-white">Business Information</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-400">Business Name:</span>
                  <span className="text-white ml-2">{onboardingData?.businessName || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Display Name:</span>
                  <span className="text-white ml-2">{onboardingData?.displayName || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <PhoneIcon className="w-6 h-6 text-green-400" />
                <h3 className="font-semibold text-white">Phone Number</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-400">Phone:</span>
                  <span className="text-white ml-2">{onboardingData?.phoneNumber || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-400 ml-2">✅ Verified</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-purple-400" />
                <h3 className="font-semibold text-white">WhatsApp Business</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-400">WABA ID:</span>
                  <span className="text-white ml-2 font-mono text-xs">
                    {onboardingData?.wabaId || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Phone Number ID:</span>
                  <span className="text-white ml-2 font-mono text-xs">
                    {onboardingData?.phoneNumberId || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <CheckCircleIcon className="w-6 h-6 text-green-400" />
                <h3 className="font-semibold text-white">Integration Status</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-400">API Status:</span>
                  <span className="text-green-400 ml-2">✅ Active</span>
                </div>
                <div>
                  <span className="text-gray-400">Webhook:</span>
                  <span className="text-green-400 ml-2">✅ Configured</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">🚀 What's Next?</h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <div>
                <h4 className="font-medium text-white">Send Your First Message</h4>
                <p className="text-gray-400 text-sm">
                  Test your integration by sending a WhatsApp message to your contacts.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <div>
                <h4 className="font-medium text-white">Configure Webhooks</h4>
                <p className="text-gray-400 text-sm">
                  Set up webhooks to receive incoming messages and delivery receipts.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <div>
                <h4 className="font-medium text-white">Import Contacts</h4>
                <p className="text-gray-400 text-sm">
                  Add your business contacts to start building your WhatsApp audience.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/whatsapp"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
            Go to WhatsApp Dashboard
          </a>
          
          <a
            href="/contacts"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
          >
            <ArrowRightIcon className="w-5 h-5 mr-2" />
            Manage Contacts
          </a>
        </div>

        {/* Support Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 mb-4">
            Need help getting started? Our support team is here to assist you.
          </p>
          <div className="flex justify-center space-x-4">
            <a href="/help" className="text-blue-400 hover:text-blue-300 transition-colors">
              📚 Documentation
            </a>
            <a href="/help" className="text-blue-400 hover:text-blue-300 transition-colors">
              💬 Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
