'use client';

import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon,
  KeyIcon,
  GlobeAltIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

interface Vendor {
  id: string;
  name: string;
  metaAppId?: string | null;
  wabaId?: string | null;
  phoneNumberId?: string | null;
  accessToken?: string | null;
  webhookUrl?: string | null;
  webhookVerifyToken?: string | null;
}

interface WhatsAppStatusProps {
  vendor: Vendor;
}

export default function WhatsAppStatus({ vendor }: WhatsAppStatusProps) {
  const isConfigured = vendor.metaAppId && vendor.wabaId && vendor.phoneNumberId && vendor.accessToken;
  const hasWebhook = vendor.webhookUrl && vendor.webhookVerifyToken;

  const getStatusColor = () => {
    if (isConfigured && hasWebhook) return 'text-green-400';
    if (isConfigured) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusText = () => {
    if (isConfigured && hasWebhook) return 'Fully Configured';
    if (isConfigured) return 'Partially Configured';
    return 'Not Configured';
  };

  const getStatusIcon = () => {
    if (isConfigured && hasWebhook) return <CheckCircleIcon className="w-6 h-6 text-green-400" />;
    if (isConfigured) return <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400" />;
    return <XCircleIcon className="w-6 h-6 text-red-400" />;
  };

  const configurationSteps = [
    {
      name: 'Meta App',
      status: !!vendor.metaAppId,
      description: 'Meta App ID configured',
      icon: KeyIcon,
    },
    {
      name: 'WhatsApp Business',
      status: !!vendor.wabaId,
      description: 'WABA ID configured',
      icon: ChatBubbleLeftRightIcon,
    },
    {
      name: 'Phone Number',
      status: !!vendor.phoneNumberId,
      description: 'Phone Number ID configured',
      icon: PhoneIcon,
    },
    {
      name: 'Access Token',
      status: !!vendor.accessToken,
      description: 'Access Token configured',
      icon: KeyIcon,
    },
    {
      name: 'Webhook',
      status: hasWebhook,
      description: 'Webhook configured',
      icon: GlobeAltIcon,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Integration Status</h3>
        
        <div className="flex items-center space-x-3 mb-4">
          {getStatusIcon()}
          <div>
            <p className={`font-medium ${getStatusColor()}`}>{getStatusText()}</p>
            <p className="text-sm text-gray-400">
              {isConfigured && hasWebhook 
                ? 'Your WhatsApp Business integration is ready to use'
                : isConfigured 
                ? 'Complete webhook setup to enable messaging'
                : 'Configure your WhatsApp Business API credentials'
              }
            </p>
          </div>
        </div>

        {isConfigured && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <p className="text-green-300 text-sm">
              ✅ WhatsApp Business API is connected and ready for messaging
            </p>
          </div>
        )}
      </div>

      {/* Configuration Steps */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Setup Progress</h3>
        
        <div className="space-y-3">
          {configurationSteps.map((step, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                step.status 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-600 text-gray-400'
              }`}>
                {step.status ? (
                  <CheckCircleIcon className="w-4 h-4" />
                ) : (
                  <ClockIcon className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  step.status ? 'text-white' : 'text-gray-400'
                }`}>
                  {step.name}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        
        <div className="space-y-3">
          <button className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Test Connection
          </button>
          
          <button className="w-full bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            View API Documentation
          </button>
          
          <button className="w-full bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Download Webhook Code
          </button>
        </div>
      </div>

      {/* Help & Support */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Need Help?</h3>
        
        <div className="space-y-3 text-sm text-gray-400">
          <p>
            Having trouble with your WhatsApp Business setup? Our team is here to help.
          </p>
          
          <div className="space-y-2">
            <a href="/help" className="block text-blue-400 hover:text-blue-300 transition-colors">
              📚 Setup Guide
            </a>
            <a href="/help" className="block text-blue-400 hover:text-blue-300 transition-colors">
              🎥 Video Tutorials
            </a>
            <a href="/help" className="block text-blue-400 hover:text-blue-300 transition-colors">
              💬 Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
