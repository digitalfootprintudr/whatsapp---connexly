import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from 'lib/auth';
import { requireRole } from 'lib/rbac';

export default async function FlowiseAIBotPage() {
  const session = await getServerSession(authOptions);
  if (!session) { redirect('/login'); }
  requireRole(['VENDOR_ADMIN']);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Flowise AI Bot</h1>
          <p className="text-gray-400">Configure and manage your AI-powered chatbot using Flowise</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Bot Configuration */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Bot Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bot Name</label>
                <input
                  type="text"
                  placeholder="Enter bot name"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors">
                Save Configuration
              </button>
            </div>
          </div>

          {/* Bot Status & Monitoring */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Bot Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Connection Status</span>
                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Total Conversations</span>
                <span className="text-white font-semibold">1,247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Active Sessions</span>
                <span className="text-white font-semibold">23</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Response Time</span>
                <span className="text-white font-semibold">1.2s</span>
              </div>
            </div>
          </div>

          {/* AI Model Settings */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">AI Model Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Model Provider</label>
                <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>OpenAI GPT-4</option>
                  <option>OpenAI GPT-3.5</option>
                  <option>Anthropic Claude</option>
                  <option>Google Gemini</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Temperature</label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  defaultValue="0.7"
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Conservative (0)</span>
                  <span>Balanced (1)</span>
                  <span>Creative (2)</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Max Tokens</label>
                <input
                  type="number"
                  placeholder="1000"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Integration Options */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Integration Options</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">WhatsApp Integration</span>
                <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors">
                  Connected
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Web Chat Widget</span>
                <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors">
                  Configure
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">API Webhooks</span>
                <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors">
                  Configure
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Knowledge Base</span>
                <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors">
                  Upload
                </button>
              </div>
            </div>
          </div>

          {/* cURL Testing Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">cURL Testing</h2>
            
            {/* Configuration Section */}
            <div className="mb-6 p-4 bg-gray-700 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-3">Flowise Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Flowise Instance URL</label>
                  <input
                    type="url"
                    placeholder="https://your-flowise-instance.com"
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">API Key</label>
                  <input
                    type="password"
                    placeholder="Enter your Flowise API key"
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Flow ID</label>
                  <input
                    type="text"
                    placeholder="Enter your Flow ID"
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-end">
                  <button className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium transition-colors">
                    Update Commands
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Test Message</label>
                <input
                  type="text"
                  placeholder="Enter a test message"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-white">API Endpoints</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Chat Prediction</label>
                  <div className="bg-gray-900 p-3 rounded-lg border border-gray-600">
                    <code className="text-green-400 text-sm break-all">
                      curl -X POST https://your-flowise-instance.com/api/v1/prediction/YOUR_FLOW_ID \<br/>
                      &nbsp;&nbsp;-H "Content-Type: application/json" \<br/>
                      &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY" \<br/>
                      &nbsp;&nbsp;-d &apos;&#123;&quot;question&quot;: &quot;Hello, how can you help me?&quot;&#125;&apos;
                    </code>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Stream Chat</label>
                  <div className="bg-gray-900 p-3 rounded-lg border border-gray-600">
                    <code className="text-green-400 text-sm break-all">
                      curl -X POST https://your-flowise-instance.com/api/v1/prediction/YOUR_FLOW_ID/stream \<br/>
                      &nbsp;&nbsp;-H "Content-Type: application/json" \<br/>
                      &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY" \<br/>
                      &nbsp;&nbsp;-d &apos;&#123;&quot;question&quot;: &quot;Tell me about your services&quot;&#125;&apos;
                    </code>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Get Flow Details</label>
                  <div className="bg-gray-900 p-3 rounded-lg border border-gray-600">
                    <code className="text-green-400 text-sm break-all">
                      curl -X GET https://your-flowise-instance.com/api/v1/flows/YOUR_FLOW_ID \<br/>
                      &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY"
                    </code>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium transition-colors">
                  Test Chat
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors">
                  Test Stream
                </button>
                <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium transition-colors">
                  Get Flow Info
                </button>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Response</label>
                <div className="bg-gray-900 p-3 rounded-lg border border-gray-600 min-h-[100px]">
                  <p className="text-gray-400 text-sm">Response will appear here after testing...</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors">
              Test Bot
            </button>
            <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium transition-colors">
              Export Conversations
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium transition-colors">
              View Analytics
            </button>
            <button className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg font-medium transition-colors">
              Backup Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
