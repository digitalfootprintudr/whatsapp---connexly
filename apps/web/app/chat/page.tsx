'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { 
  PaperAirplaneIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  BuildingOfficeIcon,
  ClockIcon,
  CheckIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface ChatContact {
  id: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email?: string;
  company?: string;
  lastMessage?: {
    id: string;
    content: any;
    direction: 'INBOUND' | 'OUTBOUND';
    timestamp: string;
    status: string;
    type: string;
  } | null;
  unreadCount: number;
  isOnline: boolean;
  lastActivity: string;
}

interface ChatMessage {
  id: string;
  content: any;
  type: string;
  direction: 'INBOUND' | 'OUTBOUND';
  timestamp: string;
  status: string;
  contact?: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [messageOffset, setMessageOffset] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);

  // Fetch contacts
  const { data: contactsData, mutate: mutateContacts } = useSWR('/api/chat/contacts', fetcher);

  // Fetch messages for selected contact
  const { data: messagesData, mutate: mutateMessages } = useSWR(
    selectedContact ? `/api/chat/history?contactId=${selectedContact.id}&limit=50&offset=${messageOffset}` : null,
    fetcher
  );

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (contactsData?.contacts) {
      setContacts(contactsData.contacts);
    }
  }, [contactsData]);

  useEffect(() => {
    if (messagesData?.messages) {
      if (messageOffset === 0) {
        setMessages(messagesData.messages);
      } else {
        setMessages(prev => [...messagesData.messages, ...prev]);
      }
      setHasMoreMessages(messagesData.pagination.hasMore);
    }
  }, [messagesData, messageOffset]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMoreMessages = () => {
    if (hasMoreMessages && selectedContact) {
      setMessageOffset(prev => prev + 50);
    }
  };

  const handleContactSelect = (contact: ChatContact) => {
    setSelectedContact(contact);
    setMessageOffset(0);
    setMessages([]);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedContact || isSending) return;

    setIsSending(true);
    const messageText = newMessage.trim();
    setNewMessage('');

    // Optimistically add message to UI
    const optimisticMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      content: { text: messageText },
      type: 'TEXT',
      direction: 'OUTBOUND',
      timestamp: new Date().toISOString(),
      status: 'PENDING',
    };

    setMessages(prev => [...prev, optimisticMessage]);

    try {
      const response = await fetch('/api/chat/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactId: selectedContact.id,
          message: messageText,
          messageType: 'TEXT'
        })
      });

      const result = await response.json();

      if (result.success) {
        // Update the optimistic message with real data
        setMessages(prev => 
          prev.map(msg => 
            msg.id === optimisticMessage.id 
              ? { ...msg, id: result.messageId, status: 'SENT' }
              : msg
          )
        );

        // Refresh contacts to update last message
        mutateContacts();
      } else {
        // Mark message as failed
        setMessages(prev => 
          prev.map(msg => 
            msg.id === optimisticMessage.id 
              ? { ...msg, status: 'FAILED' }
              : msg
          )
        );
        console.error('Failed to send message:', result.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Mark message as failed
      setMessages(prev => 
        prev.map(msg => 
          msg.id === optimisticMessage.id 
            ? { ...msg, status: 'FAILED' }
            : msg
        )
      );
    } finally {
      setIsSending(false);
    }
  };

  const getMessageContent = (message: ChatMessage) => {
    if (message.type === 'TEXT') {
      return message.content.text || 'Text message';
    } else if (message.type === 'IMAGE') {
      return message.content.image?.caption || '📷 Image';
    } else if (message.type === 'VIDEO') {
      return message.content.video?.caption || '🎥 Video';
    } else if (message.type === 'AUDIO') {
      return message.content.audio?.voice ? '🎤 Voice message' : '🔊 Audio';
    } else if (message.type === 'DOCUMENT') {
      return message.content.document?.filename || '📄 Document';
    }
    return 'Unsupported message type';
  };

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <ClockIcon className="w-3 h-3" />;
      case 'SENT':
        return <CheckIcon className="w-3 h-3" />;
      case 'DELIVERED':
        return <CheckIcon className="w-3 h-3" />;
      case 'READ':
        return <CheckCircleIcon className="w-3 h-3" />;
      case 'FAILED':
        return <ExclamationCircleIcon className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const filteredContacts = contacts.filter(contact => {
    if (!searchTerm) return true;
    
    const fullName = `${contact.firstName || ''} ${contact.lastName || ''}`.trim();
    return fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           contact.phoneNumber.includes(searchTerm) ||
           (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex">
      {/* Contacts Sidebar */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        {/* Search */}
        <div className="p-4 border-b border-gray-700">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => handleContactSelect(contact)}
              className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors ${
                selectedContact?.id === contact.id ? 'bg-gray-700' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                    {(contact.firstName?.[0] || '?')}{(contact.lastName?.[0] || '?')}
                  </div>
                  {contact.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-white font-medium truncate">
                      {contact.firstName || 'Unknown'} {contact.lastName || ''}
                    </p>
                    {(contact.unreadCount || 0) > 0 && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                        {contact.unreadCount || 0}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm truncate">
                    {contact.lastMessage ? getMessageContent(contact.lastMessage) : 'No messages yet'}
                  </p>
                  <div className="flex items-center space-x-2 text-gray-500 text-xs mt-1">
                    <ClockIcon className="w-3 h-3" />
                    <span>
                      {contact.lastActivity ? new Date(contact.lastActivity).toLocaleTimeString() : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="bg-gray-800 border-b border-gray-700 p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                  {(selectedContact.firstName?.[0] || '?')}{(selectedContact.lastName?.[0] || '?')}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">
                    {selectedContact.firstName || 'Unknown'} {selectedContact.lastName || ''}
                  </h3>
                  <div className="flex items-center space-x-4 text-gray-400 text-sm">
                    <div className="flex items-center space-x-1">
                      <PhoneIcon className="w-3 h-3" />
                      <span>{selectedContact.phoneNumber}</span>
                    </div>
                    {selectedContact.email && (
                      <div className="flex items-center space-x-1">
                        <EnvelopeIcon className="w-3 h-3" />
                        <span>{selectedContact.email}</span>
                      </div>
                    )}
                    {selectedContact.company && (
                      <div className="flex items-center space-x-1">
                        <BuildingOfficeIcon className="w-3 h-3" />
                        <span>{selectedContact.company}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {hasMoreMessages && (
                <div className="text-center">
                  <button
                    onClick={loadMoreMessages}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Load more messages...
                  </button>
                </div>
              )}
              
              {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.direction === 'OUTBOUND' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.direction === 'OUTBOUND'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    <p>{getMessageContent(message)}</p>
                    <div className={`text-xs mt-1 flex items-center justify-between ${
                      message.direction === 'OUTBOUND' ? 'text-blue-200' : 'text-gray-400'
                    }`}>
                      <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                      {message.direction === 'OUTBOUND' && (
                        <span className="flex items-center space-x-1">
                          {getMessageStatusIcon(message.status)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-gray-800 border-t border-gray-700 p-4">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  disabled={isSending}
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isSending}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                  <span>{isSending ? 'Sending...' : 'Send'}</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-medium mb-2">Welcome to WhatsApp Chat</h3>
              <p>Select a contact to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
