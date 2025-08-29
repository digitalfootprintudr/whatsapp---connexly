'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';

interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: 'DRAFT' | 'SCHEDULED' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'FAILED';
  type: 'BULK_MESSAGE' | 'TEMPLATE_MESSAGE' | 'BOT_FLOW';
  targetAudience: {
    type: 'ALL_CONTACTS' | 'CONTACT_GROUP' | 'CUSTOM_FILTER';
    value?: string;
  };
  message: {
    text?: string;
    templateId?: string;
    flowId?: string;
    mediaUrl?: string;
  };
  schedule: {
    type: 'IMMEDIATE' | 'SCHEDULED' | 'RECURRING';
    scheduledAt?: string;
    recurringPattern?: string;
  };
  stats: {
    totalContacts: number;
    sent: number;
    delivered: number;
    read: number;
    failed: number;
    pending: number;
  };
  createdAt: string;
  updatedAt: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function CampaignsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: campaignsData, mutate: mutateCampaigns } = useSWR('/api/campaigns', fetcher);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (campaignsData) {
      setCampaigns(campaignsData.campaigns || []);
    }
  }, [campaignsData]);

  const handleCampaignSelect = (campaignId: string) => {
    setSelectedCampaigns(prev => 
      prev.includes(campaignId) 
        ? prev.filter(id => id !== campaignId)
        : [...prev, campaignId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCampaigns.length === campaigns.length) {
      setSelectedCampaigns([]);
    } else {
      setSelectedCampaigns(campaigns.map(c => c.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (!confirm(`Delete ${selectedCampaigns.length} selected campaigns?`)) return;
    
    try {
      await fetch('/api/campaigns', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignIds: selectedCampaigns }),
      });
      
      setSelectedCampaigns([]);
      mutateCampaigns();
    } catch (error) {
      console.error('Error deleting campaigns:', error);
    }
  };

  const handleStatusChange = async (campaignId: string, newStatus: string) => {
    try {
      await fetch(`/api/campaigns/${campaignId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      mutateCampaigns();
    } catch (error) {
      console.error('Error updating campaign status:', error);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = 
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'RUNNING': return 'bg-green-100 text-green-800';
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-purple-100 text-purple-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'BULK_MESSAGE': return '📢';
      case 'TEMPLATE_MESSAGE': return '📋';
      case 'BOT_FLOW': return '🤖';
      default: return '📝';
    }
  };

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Campaigns</h1>
            <p className="text-gray-400 mt-2">Create and manage your WhatsApp marketing campaigns</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Create Campaign
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-2xl font-bold text-white">{campaigns.length}</div>
            <div className="text-gray-400">Total Campaigns</div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-2xl font-bold text-white">
              {campaigns.filter(c => c.status === 'RUNNING').length}
            </div>
            <div className="text-gray-400">Active</div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-2xl font-bold text-white">
              {campaigns.filter(c => c.status === 'SCHEDULED').length}
            </div>
            <div className="text-gray-400">Scheduled</div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-2xl font-bold text-white">
              {campaigns.filter(c => c.status === 'COMPLETED').length}
            </div>
            <div className="text-gray-400">Completed</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="RUNNING">Running</option>
            <option value="PAUSED">Paused</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>

        {/* Actions Bar */}
        {selectedCampaigns.length > 0 && (
          <div className="bg-gray-800 p-4 rounded-lg mb-6 flex items-center justify-between">
            <span className="text-white">
              {selectedCampaigns.length} campaign(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteSelected}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedCampaigns([])}
                className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <div key={campaign.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getTypeIcon(campaign.type)}</span>
                  <div>
                    <h3 className="font-medium text-white">{campaign.name}</h3>
                    <p className="text-sm text-gray-400">{campaign.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedCampaigns.includes(campaign.id)}
                  onChange={() => handleCampaignSelect(campaign.id)}
                  className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                />
              </div>

              {campaign.description && (
                <p className="text-gray-300 text-sm mb-4">{campaign.description}</p>
              )}

              <div className="mb-4">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                  {campaign.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Target:</span>
                  <span className="text-white">
                    {campaign.targetAudience.type === 'ALL_CONTACTS' 
                      ? 'All Contacts' 
                      : campaign.targetAudience.type === 'CONTACT_GROUP'
                      ? 'Contact Group'
                      : 'Custom Filter'
                    }
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Schedule:</span>
                  <span className="text-white">
                    {campaign.schedule.type === 'IMMEDIATE' 
                      ? 'Immediate' 
                      : campaign.schedule.type === 'SCHEDULED'
                      ? 'Scheduled'
                      : 'Recurring'
                    }
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                <div className="text-center">
                  <div className="text-white font-medium">{campaign.stats.totalContacts}</div>
                  <div className="text-gray-400">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-medium">{campaign.stats.sent}</div>
                  <div className="text-gray-400">Sent</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-medium">{campaign.stats.delivered}</div>
                  <div className="text-gray-400">Delivered</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-medium">{campaign.stats.read}</div>
                  <div className="text-gray-400">Read</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {campaign.status === 'DRAFT' && (
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium transition-colors">
                    Edit
                  </button>
                )}
                {campaign.status === 'SCHEDULED' && (
                  <button 
                    onClick={() => handleStatusChange(campaign.id, 'RUNNING')}
                    className="flex-1 bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm font-medium transition-colors"
                  >
                    Start Now
                  </button>
                )}
                {campaign.status === 'RUNNING' && (
                  <button 
                    onClick={() => handleStatusChange(campaign.id, 'PAUSED')}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 px-3 py-2 rounded text-sm font-medium transition-colors"
                  >
                    Pause
                  </button>
                )}
                {campaign.status === 'PAUSED' && (
                  <button 
                    onClick={() => handleStatusChange(campaign.id, 'RUNNING')}
                    className="flex-1 bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm font-medium transition-colors"
                  >
                    Resume
                  </button>
                )}
                <button className="px-3 py-2 text-gray-400 hover:text-white transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No campaigns found</div>
            <p className="text-gray-500">Create your first campaign to get started</p>
          </div>
        )}
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-white mb-4">Create New Campaign</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  placeholder="Enter campaign name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  rows={3}
                  placeholder="Enter campaign description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Campaign Type
                </label>
                <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white">
                  <option value="BULK_MESSAGE">Bulk Message</option>
                  <option value="TEMPLATE_MESSAGE">Template Message</option>
                  <option value="BOT_FLOW">Bot Flow</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Audience
                </label>
                <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white">
                  <option value="ALL_CONTACTS">All Contacts</option>
                  <option value="CONTACT_GROUP">Contact Group</option>
                  <option value="CUSTOM_FILTER">Custom Filter</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  rows={4}
                  placeholder="Enter your message"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Schedule
                </label>
                <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white">
                  <option value="IMMEDIATE">Send Immediately</option>
                  <option value="SCHEDULED">Schedule for Later</option>
                  <option value="RECURRING">Recurring</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Create Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
