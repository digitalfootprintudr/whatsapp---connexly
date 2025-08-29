'use client';

import { useState } from 'react';
import { 
  CheckCircleIcon, 
  KeyIcon,
  GlobeAltIcon,
  PhoneIcon,
  CogIcon
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

interface WhatsAppSetupFormProps {
  vendor: Vendor;
}

export default function WhatsAppSetupForm({ vendor }: WhatsAppSetupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [webhookStatus, setWebhookStatus] = useState<{
    isConfiguring: boolean;
    isConfigured: boolean;
    message: string;
  }>({
    isConfiguring: false,
    isConfigured: false,
    message: ''
  });

  // Manual setup form state
  const [manualForm, setManualForm] = useState({
    metaAppId: vendor.metaAppId || '',
    metaAppSecret: '',
    wabaId: vendor.wabaId || '',
    phoneNumberId: vendor.phoneNumberId || '',
    accessToken: vendor.accessToken || '',
  });

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setWebhookStatus({
      isConfiguring: true,
      isConfigured: false,
      message: 'Configuring webhook with Meta...'
    });

    try {
      // Step 1: Save basic configuration
      const response = await fetch('/api/settings/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(manualForm),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save configuration');
      }

      // Step 2: Configure webhook with Meta
      await configureWebhookWithMeta(manualForm.accessToken, manualForm.phoneNumberId);

      setMessage({ type: 'success', text: 'WhatsApp Business configuration saved and webhook configured successfully!' });
      
      // Update webhook status
      setWebhookStatus({
        isConfiguring: false,
        isConfigured: true,
        message: 'Webhook successfully configured with Meta'
      });

      // Refresh the page to show updated status
      setTimeout(() => window.location.reload(), 2000);

    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to save configuration' });
      setWebhookStatus({
        isConfiguring: false,
        isConfigured: false,
        message: 'Webhook configuration failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const configureWebhookWithMeta = async (accessToken: string, phoneNumberId: string) => {
    try {
      // Generate webhook URL and verify token
      const webhookUrl = `${window.location.origin}/api/webhooks/whatsapp/${vendor.id}`;
      const webhookVerifyToken = generateWebhookVerifyToken();

      // Configure webhook with Meta
      const response = await fetch('/api/settings/whatsapp/configure-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken,
          phoneNumberId,
          webhookUrl,
          webhookVerifyToken
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Webhook configuration failed: ${error.message}`);
      }

      // Update vendor's webhook configuration
      await fetch('/api/settings/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...manualForm,
          webhookUrl,
          webhookVerifyToken
        }),
      });

    } catch (error) {
      console.error('Webhook configuration error:', error);
      throw error;
    }
  };

  const generateWebhookVerifyToken = (): string => {
    // Generate a secure random token for webhook verification
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  };

  return (
    <div className="space-y-6">
      {/* Manual Setup Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">WhatsApp Business Configuration</h2>
        <p className="text-gray-400 mb-6">
          Enter your existing WhatsApp Business API credentials. Webhook URL and verification token will be automatically configured.
        </p>

        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <KeyIcon className="w-4 h-4 inline mr-2" />
                Meta App ID
              </label>
              <input
                type="text"
                value={manualForm.metaAppId}
                onChange={(e) => setManualForm({ ...manualForm, metaAppId: e.target.value })}
                placeholder="Enter your Meta App ID"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <KeyIcon className="w-4 h-4 inline mr-2" />
                Meta App Secret
              </label>
              <input
                type="password"
                value={manualForm.metaAppSecret}
                onChange={(e) => setManualForm({ ...manualForm, metaAppSecret: e.target.value })}
                placeholder="Enter your Meta App Secret"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <GlobeAltIcon className="w-4 h-4 inline mr-2" />
                WhatsApp Business Account ID
              </label>
              <input
                type="text"
                value={manualForm.wabaId}
                onChange={(e) => setManualForm({ ...manualForm, wabaId: e.target.value })}
                placeholder="Enter your WABA ID"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <PhoneIcon className="w-4 h-4 inline mr-2" />
                Phone Number ID
              </label>
              <input
                type="text"
                value={manualForm.phoneNumberId}
                onChange={(e) => setManualForm({ ...manualForm, phoneNumberId: e.target.value })}
                placeholder="Enter your Phone Number ID"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <KeyIcon className="w-4 h-4 inline mr-2" />
              Access Token
            </label>
            <input
              type="password"
              value={manualForm.accessToken}
              onChange={(e) => setManualForm({ ...manualForm, accessToken: e.target.value })}
              placeholder="Enter your Access Token"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Webhook Configuration Info */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <CogIcon className="w-5 h-5 text-blue-400" />
              <h4 className="font-medium text-blue-300">Automatic Webhook Configuration</h4>
            </div>
            <div className="text-sm text-blue-200 space-y-1">
              <p>• Webhook URL will be automatically generated: <code className="bg-blue-800 px-2 py-1 rounded">/api/webhooks/whatsapp/{vendor.id}</code></p>
              <p>• Verification token will be automatically generated and configured with Meta</p>
              <p>• Webhook will be automatically set up in your Meta app</p>
            </div>
          </div>

          {/* Webhook Status */}
          {webhookStatus.isConfiguring && (
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-yellow-300">{webhookStatus.message}</span>
              </div>
            </div>
          )}

          {webhookStatus.isConfigured && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                <span className="text-green-300">{webhookStatus.message}</span>
              </div>
            </div>
          )}

          {/* Message Display */}
          {message && (
            <div className={`p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-900/20 border border-green-500/30 text-green-300' 
                : 'bg-red-900/20 border border-red-500/30 text-red-300'
            }`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving Configuration...</span>
              </>
            ) : (
              <>
                <span>Save Configuration & Configure Webhook</span>
                <CheckCircleIcon className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Embedded Signup Info */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Need Embedded Signup?</h3>
        <p className="text-gray-400 mb-4">
          If you don't have WhatsApp Business API credentials yet, you can use our embedded signup process 
          to create and configure your account through Meta.
        </p>
        <a
          href="/onboarding/start"
          className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
        >
          Start Embedded Signup
        </a>
      </div>
    </div>
  );
}
