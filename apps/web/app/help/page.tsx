'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const helpSections = [
  {
    title: 'Getting Started',
    icon: '🚀',
    items: [
      { question: 'How do I create my first campaign?', answer: 'Navigate to the Campaigns page and click "Create Campaign". Fill in the required details including name, target audience, and message content.' },
      { question: 'How do I import contacts?', answer: 'Go to the Contacts page and click "Import Contacts". You can upload a CSV file with your contact information.' },
      { question: 'What are the different campaign types?', answer: 'We support three types: Bulk Message (simple text), Template Message (using approved WhatsApp templates), and Bot Flow (automated conversation flows).' },
    ]
  },
  {
    title: 'Contacts Management',
    icon: '👥',
    items: [
      { question: 'How do I organize my contacts?', answer: 'Create contact groups to categorize your contacts. You can assign multiple tags and organize them by company, location, or any custom criteria.' },
      { question: 'Can I export my contacts?', answer: 'Yes! Use the Export button on the Contacts page to download your contact list in CSV format.' },
      { question: 'How do I handle opt-outs?', answer: 'Contacts can opt out of messages, and they will be automatically marked as opted-out. You cannot send messages to opted-out contacts.' },
    ]
  },
  {
    title: 'Campaigns & Messaging',
    icon: '📢',
    items: [
      { question: 'How do I schedule a campaign?', answer: 'When creating a campaign, choose "Scheduled" and set your desired date and time. The campaign will automatically start at the scheduled time.' },
      { question: 'What are delivery rates?', answer: 'Delivery rate shows the percentage of messages that were successfully delivered to recipients. This is tracked automatically by WhatsApp.' },
      { question: 'Can I pause a running campaign?', answer: 'Yes, you can pause any running campaign. Paused campaigns can be resumed later, and you can also stop them completely.' },
    ]
  },
  {
    title: 'Templates & Compliance',
    icon: '📋',
    items: [
      { question: 'What are WhatsApp templates?', answer: 'Templates are pre-approved message formats that comply with WhatsApp Business API policies. They\'re required for non-session messages.' },
      { question: 'How long does template approval take?', answer: 'Template approval typically takes 24-48 hours. We\'ll notify you once your template is approved or if changes are needed.' },
      { question: 'What makes a template compliant?', answer: 'Templates must follow WhatsApp\'s messaging policy, avoid promotional language for non-marketing categories, and use appropriate formatting.' },
    ]
  },
  {
    title: 'Analytics & Reporting',
    icon: '📊',
    items: [
      { question: 'What metrics do you track?', answer: 'We track message delivery, read rates, response rates, campaign performance, and contact engagement across all your campaigns.' },
      { question: 'Can I export reports?', answer: 'Yes, you can export detailed reports in various formats including CSV and PDF for further analysis.' },
      { question: 'How often are analytics updated?', answer: 'Analytics are updated in real-time as messages are sent and responses are received.' },
    ]
  },
  {
    title: 'Technical Support',
    icon: '🔧',
    items: [
      { question: 'What browsers are supported?', answer: 'We support all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, use the latest version.' },
      { question: 'Is my data secure?', answer: 'Yes, we use industry-standard encryption and security practices. Your data is stored securely and we never share it with third parties.' },
      { question: 'How do I get help?', answer: 'You can contact our support team through the support chat, email us at support@connexly.com, or check our detailed documentation.' },
    ]
  }
];

export default function HelpPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  const toggleItem = (itemKey: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemKey)) {
      newExpanded.delete(itemKey);
    } else {
      newExpanded.add(itemKey);
    }
    setExpandedItems(newExpanded);
  };

  const filteredSections = helpSections.map(section => ({
    ...section,
    items: section.items.filter(item => 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Help & Support</h1>
          <p className="text-gray-400 text-lg">Everything you need to know about Connexly</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search help articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>

        {/* Help Sections */}
        <div className="space-y-8">
          {filteredSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{section.icon}</span>
                <h2 className="text-2xl font-bold text-white">{section.title}</h2>
              </div>
              
              <div className="space-y-4">
                {section.items.map((item, itemIndex) => {
                  const itemKey = `${sectionIndex}-${itemIndex}`;
                  const isExpanded = expandedItems.has(itemKey);
                  
                  return (
                    <div key={itemIndex} className="border border-gray-700 rounded-lg">
                      <button
                        onClick={() => toggleItem(itemKey)}
                        className="w-full px-4 py-4 text-left flex items-center justify-between hover:bg-gray-700 transition-colors"
                      >
                        <span className="text-white font-medium">{item.question}</span>
                        <span className="text-gray-400 text-xl">
                          {isExpanded ? '−' : '+'}
                        </span>
                      </button>
                      
                      {isExpanded && (
                        <div className="px-4 pb-4">
                          <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="bg-blue-600 rounded-lg p-8 text-center mt-12">
          <h3 className="text-2xl font-bold text-white mb-4">Still need help?</h3>
          <p className="text-blue-100 mb-6">
            Our support team is here to help you get the most out of Connexly
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Live Chat Support
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
              Email Support
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-white mb-2">Documentation</h3>
            <p className="text-gray-400 text-sm mb-4">Detailed guides and API references</p>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              View Documentation →
            </button>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <div className="text-4xl mb-4">🎥</div>
            <h3 className="text-lg font-medium text-white mb-2">Video Tutorials</h3>
            <p className="text-gray-400 text-sm mb-4">Step-by-step video guides</p>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              Watch Videos →
            </button>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-lg font-medium text-white mb-2">Best Practices</h3>
            <p className="text-gray-400 text-sm mb-4">Tips for successful campaigns</p>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              Learn More →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
