import React, { useState, useEffect } from 'react';
import { Plus, MessageSquare, Clock } from 'lucide-react';

const ConversationSidebar = ({ 
  isOpen, 
  onClose, 
  onSelectConversation, 
  onNewConversation,
  currentConversationId,
  selectedAdvisor 
}) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchConversations();
    }
  }, [isOpen]);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('mmc_token');
      const response = await fetch('/api/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getAdvisorColor = (advisor) => {
    if (advisor === 'dr-kai') return '#4FA6A6';
    if (advisor === 'maya') return '#B87333';
    if (advisor === 'michael') return '#8A8F98';
    if (advisor === 'giselle') return '#7A5C9E';
    if (advisor === 'jasmine') return '#A24D8F';
    if (advisor === 'sensei') return '#5E8F7B';
    return '#8A8F98';
  };

  const getAdvisorImage = (advisor) => {
    return `/images/${advisor}.png`;
  };

  const getAdvisorName = (advisor) => {
    if (advisor === 'dr-kai') return 'Dr. Kai';
    if (advisor === 'maya') return 'Maya';
    if (advisor === 'michael') return 'Michael';
    if (advisor === 'giselle') return 'Giselle';
    if (advisor === 'jasmine') return 'Jasmine';
    if (advisor === 'sensei') return 'Sensei';
    return advisor;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-gray-900 to-black border-r border-gray-800 z-50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <button
            onClick={onNewConversation}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-ivory-primary rounded-lg font-medium hover:from-cyan-400 hover:to-purple-500 transition-all"
          >
            <Plus size={20} />
            New Conversation
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="text-center text-gray-400 py-8">
              Loading conversations...
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
              <p>No conversations yet</p>
              <p className="text-sm mt-2">Start a new conversation!</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`w-full text-left p-3 rounded-lg transition-all flex items-start gap-3 ${
                  currentConversationId === conv.id
                    ? 'bg-gray-800/80 border-2'
                    : 'bg-gray-800/50 hover:bg-gray-800 border-2 border-transparent'
                }`}
                style={{ borderColor: currentConversationId === conv.id ? getAdvisorColor(conv.advisor) : 'transparent' }}
              >
                {/* Advisor photo */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden" style={{ border: `2px solid ${getAdvisorColor(conv.advisor)}` }}>
                  <img 
                    src={getAdvisorImage(conv.advisor)}
                    alt={getAdvisorName(conv.advisor)}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  {/* Advisor name */}
                  <div className="text-sm font-medium mb-1" style={{ color: getAdvisorColor(conv.advisor) }}>
                    {getAdvisorName(conv.advisor)}
                  </div>

                {/* Conversation title */}
                <div className="text-ivory-primary text-sm line-clamp-2 mb-2">
                  {conv.title}
                </div>

                {/* Timestamp and mode */}
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {formatTimestamp(conv.last_message_at)}
                  </span>
                  <span className="capitalize">{conv.mode}</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 text-center text-xs text-gray-500">
          {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
        </div>
      </div>
    </>
  );
};

export default ConversationSidebar;
