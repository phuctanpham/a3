import { useState, useRef, useEffect } from 'react';
import type { SyncStatus } from '../App';
import './RightColumn.css';

interface CellItem {
  id: string;
  avatar: string;
  address: string;
  certificateNumber: string;
  owner: string;
  syncStatus: SyncStatus;
}

interface RightColumnProps {
  items: CellItem[];
  selectedItemId: string | null;
  onSelectItem: (id: string) => void;
  onSync: (id: string) => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

export default function RightColumn({
  items,
  selectedItemId,
  onSelectItem,
  onSync,
  expanded = true,
  onToggleExpand,
}: RightColumnProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Virtual scrolling: load more items as user scrolls
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - scrollTop <= clientHeight * 1.5) {
        setVisibleCount((prev) => Math.min(prev + 20, items.length));
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [items.length]);

  if (items.length === 0) {
    return (
      <div className={`right-column ${expanded ? 'expanded' : 'collapsed'}`}>
        {onToggleExpand && (
          <button className="toggle-button" onClick={onToggleExpand} aria-label="Toggle column">
            {expanded ? '→' : '←'}
          </button>
        )}
        {expanded && (
          <div className="empty-state">
            <h3>No Items Yet</h3>
            <p>Click the '+' button to add an item.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`right-column ${expanded ? 'expanded' : 'collapsed'}`}>
      {onToggleExpand && (
        <button className="toggle-button" onClick={onToggleExpand} aria-label="Toggle column">
          {expanded ? '→' : '←'}
        </button>
      )}
      {expanded && (
        <>
          <div className="column-header">
            <h3>Items ({items.length})</h3>
          </div>
          <div className="items-list" ref={containerRef}>
            {items.slice(0, visibleCount).map((item) => (
              <div
                key={item.id}
                className={`item-cell ${selectedItemId === item.id ? 'selected' : ''}`}
                onClick={() => onSelectItem(item.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectItem(item.id);
                  }
                }}
              >
                <div className={`sync-status ${item.syncStatus}`}>
                  {item.syncStatus === 'pending' && (
                    <button
                      className="sync-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSync(item.id);
                      }}
                      aria-label="Sync item"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path
                          d="M21.5 2v6h-6M2.5 22v-6h6M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12z"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="item-avatar">
                  {item.avatar ? (
                    <img src={item.avatar} alt={item.owner} />
                  ) : (
                    <div className="avatar-placeholder">?</div>
                  )}
                </div>
                <div className="item-details">
                  <div className="item-field">
                    <strong>Address:</strong> {item.address}
                  </div>
                  <div className="item-field">
                    <strong>Cert #:</strong> {item.certificateNumber}
                  </div>
                  <div className="item-field">
                    <strong>Owner:</strong> {item.owner}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
