'use client';

import { useState, useEffect } from 'react';
import { 
  CheckCircleIcon, 
  KeyIcon,
  GlobeAltIcon,
  CogIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface WhatsAppConfig {
  appId: string;
  appSecret: string;
  configId: string;
  isConfigured: boolean;
}

export default function WhatsAppAdminConfig() {
  const [config, setConfig] = useState<WhatsAppConfig>({
    appId: '',
    appSecret: '',
    configId: '',
    isConfigured: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/admin/whatsapp/config');
      if (response.ok) {
        const data = await response.json();
        setConfig(data.config);
      }
    } catch (error) {
      console.error('Failed to load config:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/whatsapp/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'WhatsApp Business configuration saved successfully!' });
        await loadConfig(); // Reload to get updated status
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Failed to save configuration' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/whatsapp/test', {
        method: 'POST',
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Connection test successful! WhatsApp Business API is working correctly.' });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Connection test failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to test connection' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration Form */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">WhatsApp Business API Configuration</h2>
        <p className="text-gray-400 mb-6">
          Configure the WhatsApp Business API credentials that will be used for embedded signup. 
          These settings will be applied to all vendor accounts using the embedded signup process.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <KeyIcon className="w-4 h-4 inline mr-2" />
                Meta App ID
              </label>
              <input
                type="text"
                value={config.appId}
                onChange={(e) => setConfig({ ...config, appId: e.target.value })}
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
                value={config.appSecret}
                onChange={(e) => setConfig({ ...config, appSecret: e.target.value })}
                placeholder="Enter your Meta App Secret"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <CogIcon className="w-4 h-4 inline mr-2" />
              Config ID
            </label>
            <input
              type="text"
              value={config.configId}
              onChange={(e) => setConfig({ ...config, configId: e.target.value })}
              placeholder="Enter your Config ID for embedded signup"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              This is the configuration ID that will be used for all vendor embedded signups.
            </p>
          </div>

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

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Save Configuration</span>
                  <CheckCircleIcon className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={testConnection}
              disabled={isLoading || !config.isConfigured}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors"
            >
              Test Connection
            </button>
          </div>
        </form>
      </div>

      {/* Status and Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Configuration Status */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Configuration Status</h3>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                config.appId ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-400'
              }`}>
                {config.appId ? <CheckCircleIcon className="w-4 h-4" /> : <ExclamationTriangleIcon className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-sm font-medium text-white">Meta App ID</p>
                <p className="text-xs text-gray-400">
                  {config.appId ? 'Configured' : 'Not configured'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                config.appSecret ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-400'
              }`}>
                {config.appSecret ? <CheckCircleIcon className="w-4 h-4" /> : <ExclamationTriangleIcon className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-sm font-medium text-white">Meta App Secret</p>
                <p className="text-xs text-gray-400">
                  {config.appSecret ? 'Configured' : 'Not configured'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                config.configId ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-400'
              }`}>
                {config.configId ? <CheckCircleIcon className="w-4 h-4" /> : <ExclamationTriangleIcon className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-sm font-medium text-white">Config ID</p>
                <p className="text-xs text-gray-400">
                  {config.configId ? 'Configured' : 'Not configured'}
                </p>
              </div>
            </div>
          </div>

          {config.isConfigured && (
            <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
              <p className="text-green-300 text-sm">
                ✅ WhatsApp Business API is fully configured and ready for embedded signup
              </p>
            </div>
          )}
        </div>

        {/* Usage Information */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">How It Works</h3>
          
          <div className="space-y-3 text-sm text-gray-400">
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
              <h4 className="font-medium text-blue-300 mb-2">For Vendors:</h4>
              <ol className="list-decimal list-inside space-y-1 text-blue-200">
                <li>Click "Start Embedded Signup" in their settings</li>
                <li>Get redirected to Meta's embedded signup flow</li>
                <li>Complete the setup using your configured credentials</li>
                <li>Integration is automatically configured</li>
              </ol>
            </div>

            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
              <h4 className="font-medium text-green-300 mb-2">For Super Admins:</h4>
              <ul className="list-disc list-inside space-y-1 text-green-200">
                <li>Configure Meta App ID, Secret, and Config ID</li>
                <li>Test the connection to ensure it works</li>
                <li>Monitor vendor onboarding progress</li>
                <li>Manage all WhatsApp Business integrations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        
        <div className="flex flex-wrap gap-4">
          <a
            href="https://developers.facebook.com/docs/whatsapp/embedded-signup"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            View Meta Documentation
          </a>
          
          <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors">
            View Onboarding Logs
          </button>
          
          <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors">
            Export Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
