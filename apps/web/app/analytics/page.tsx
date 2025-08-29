'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';

interface AnalyticsData {
  overview: {
    totalContacts: number;
    totalCampaigns: number;
    messagesSent: number;
    deliveryRate: number;
    readRate: number;
    responseRate: number;
  };
  campaigns: {
    id: string;
    name: string;
    status: string;
    sent: number;
    delivered: number;
    read: number;
    failed: number;
    responseRate: number;
  }[];
  recentActivity: {
    id: string;
    type: string;
    description: string;
    timestamp: string;
    status: string;
  }[];
  monthlyStats: {
    month: string;
    messagesSent: number;
    deliveryRate: number;
    readRate: number;
  }[];
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState('30d');

  const { data: campaignsData } = useSWR('/api/campaigns', fetcher);
  const { data: contactsData } = useSWR('/api/contacts', fetcher);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (campaignsData && contactsData) {
      // Generate mock analytics data based on real data
      const mockAnalytics: AnalyticsData = {
        overview: {
          totalContacts: contactsData.contacts?.length || 0,
          totalCampaigns: campaignsData.campaigns?.length || 0,
          messagesSent: Math.floor(Math.random() * 10000) + 1000,
          deliveryRate: 95.2,
          readRate: 78.6,
          responseRate: 12.3,
        },
        campaigns: (campaignsData.campaigns || []).map((campaign: any) => ({
          id: campaign.id,
          name: campaign.name,
          status: campaign.status,
          sent: campaign.stats?.sent || 0,
          delivered: campaign.stats?.delivered || 0,
          read: campaign.stats?.read || 0,
          failed: campaign.stats?.failed || 0,
          responseRate: Math.random() * 20,
        })),
        recentActivity: [
          {
            id: '1',
            type: 'CAMPAIGN_STARTED',
            description: 'Welcome Campaign started',
            timestamp: new Date().toISOString(),
            status: 'success',
          },
          {
            id: '2',
            type: 'MESSAGE_SENT',
            description: 'Bulk message sent to 500 contacts',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            status: 'success',
          },
          {
            id: '3',
            type: 'CAMPAIGN_COMPLETED',
            description: 'Holiday Promotion completed',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            status: 'success',
          },
        ],
        monthlyStats: [
          { month: 'Jan', messagesSent: 1200, deliveryRate: 94.5, readRate: 76.2 },
          { month: 'Feb', messagesSent: 1350, deliveryRate: 95.1, readRate: 78.9 },
          { month: 'Mar', messagesSent: 1100, deliveryRate: 93.8, readRate: 75.4 },
          { month: 'Apr', messagesSent: 1600, deliveryRate: 96.2, readRate: 81.3 },
          { month: 'May', messagesSent: 1800, deliveryRate: 95.8, readRate: 79.7 },
          { month: 'Jun', messagesSent: 2000, deliveryRate: 96.5, readRate: 82.1 },
        ],
      };
      setAnalyticsData(mockAnalytics);
    }
  }, [campaignsData, contactsData]);

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!analyticsData) {
    return <div className="flex items-center justify-center min-h-screen">Loading analytics...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics</h1>
            <p className="text-gray-400 mt-2">Track your WhatsApp marketing performance</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{analyticsData.overview.totalContacts}</div>
                <div className="text-gray-400">Total Contacts</div>
              </div>
              <div className="text-blue-400 text-3xl">👥</div>
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{analyticsData.overview.totalCampaigns}</div>
                <div className="text-gray-400">Total Campaigns</div>
              </div>
              <div className="text-green-400 text-3xl">📢</div>
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{analyticsData.overview.messagesSent.toLocaleString()}</div>
                <div className="text-gray-400">Messages Sent</div>
              </div>
              <div className="text-purple-400 text-3xl">💬</div>
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{analyticsData.overview.deliveryRate}%</div>
                <div className="text-gray-400">Delivery Rate</div>
              </div>
              <div className="text-yellow-400 text-3xl">📊</div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-4">Delivery Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Delivery Rate</span>
                  <span className="text-white">{analyticsData.overview.deliveryRate}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${analyticsData.overview.deliveryRate}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Read Rate</span>
                  <span className="text-white">{analyticsData.overview.readRate}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${analyticsData.overview.readRate}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Response Rate</span>
                  <span className="text-white">{analyticsData.overview.responseRate}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${analyticsData.overview.responseRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-4">Campaign Performance</h3>
            <div className="space-y-3">
              {analyticsData.campaigns.slice(0, 5).map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{campaign.name}</p>
                    <p className="text-gray-400 text-xs">{campaign.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm">{campaign.sent}</p>
                    <p className="text-gray-400 text-xs">{campaign.responseRate.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {analyticsData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm">{activity.description}</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Chart */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h3 className="text-lg font-medium text-white mb-4">Monthly Performance</h3>
          <div className="grid grid-cols-6 gap-4">
            {analyticsData.monthlyStats.map((stat) => (
              <div key={stat.month} className="text-center">
                <div className="text-white font-medium">{stat.month}</div>
                <div className="text-gray-400 text-sm">{stat.messagesSent}</div>
                <div className="text-blue-400 text-xs">{stat.deliveryRate}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign Details Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-medium text-white">Campaign Details</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Sent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Delivered
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Read
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Response Rate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {analyticsData.campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-white">{campaign.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        campaign.status === 'RUNNING' ? 'bg-blue-100 text-blue-800' :
                        campaign.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{campaign.sent}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{campaign.delivered}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{campaign.read}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{campaign.responseRate.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
