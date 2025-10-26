import { useState } from 'react';
import './LeftColumn.css';

interface CellItem {
  id: string;
  avatar: string;
  address: string;
  certificateNumber: string;
  owner: string;
}

interface LeftColumnProps {
  selectedItem: CellItem | undefined;
  expanded?: boolean;
  onToggleExpand?: () => void;
  onNavigate?: () => void;
}

type Tab = 'chat' | 'changelog';

export default function LeftColumn({
  selectedItem,
  expanded = true,
  onToggleExpand,
  onNavigate,
}: LeftColumnProps) {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [chatMessage, setChatMessage] = useState('');

  // Mock data - in production, fetch from backend
  const chatHistory = selectedItem
    ? [
        { id: 1, sender: 'user', message: 'What is the status of this item?', timestamp: '10:30 AM' },
        { id: 2, sender: 'bot', message: 'This item is active and verified.', timestamp: '10:31 AM' },
      ]
    : [];

  const changelogEntries = selectedItem
    ? [
        { id: 1, action: 'Created', user: 'System', timestamp: '2025-10-20 09:00' },
        { id: 2, action: 'Updated certificate number', user: 'Admin', timestamp: '2025-10-22 14:30' },
      ]
    : [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    // TODO: Send message to bot backend via Service Worker proxy
    console.log('Sending message:', chatMessage);
    setChatMessage('');
  };

  if (!selectedItem) {
    return (
      <div className={`left-column ${expanded ? 'expanded' : 'collapsed'}`}>
        {onToggleExpand && (
          <button className="toggle-button" onClick={onToggleExpand} aria-label="Toggle column">
            {expanded ? '←' : '→'}
          </button>
        )}
        {expanded && (
          <div className="empty-state">
            <h3>No Item Selected</h3>
            <p>Select an item to view chat and activity</p>
            {onNavigate && (
              <button className="btn btn-primary" onClick={onNavigate}>
                Go to Items
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`left-column ${expanded ? 'expanded' : 'collapsed'}`}>
      {onToggleExpand && (
        <button className="toggle-button" onClick={onToggleExpand} aria-label="Toggle column">
          {expanded ? '←' : '→'}
        </button>
      )}
      {expanded && (
        <>
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
              aria-label="Chat tab"
            >
              Chat
            </button>
            <button
              className={`tab ${activeTab === 'changelog' ? 'active' : ''}`}
              onClick={() => setActiveTab('changelog')}
              aria-label="Changelog tab"
            >
              Activity
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'chat' ? (
              <div className="chat-view">
                <div className="chat-header">
                  <h4>Chat with Bot</h4>
                  <p className="chat-subtitle">Ask about {selectedItem.certificateNumber}</p>
                </div>
                <div className="chat-messages">
                  {chatHistory.map((msg) => (
                    <div key={msg.id} className={`chat-message ${msg.sender}`}>
                      <div className="message-content">{msg.message}</div>
                      <div className="message-timestamp">{msg.timestamp}</div>
                    </div>
                  ))}
                </div>
                <form className="chat-input-form" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="chat-input"
                    aria-label="Chat message"
                  />
                  <button type="submit" className="btn btn-primary" aria-label="Send message">
                    Send
                  </button>
                </form>
              </div>
            ) : (
              <div className="changelog-view">
                <div className="changelog-header">
                  <h4>Activity Log</h4>
                  <p className="changelog-subtitle">{selectedItem.certificateNumber}</p>
                </div>
                <div className="changelog-entries">
                  {changelogEntries.map((entry) => (
                    <div key={entry.id} className="changelog-entry">
                      <div className="entry-action">{entry.action}</div>
                      <div className="entry-meta">
                        <span className="entry-user">{entry.user}</span>
                        <span className="entry-timestamp">{entry.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}