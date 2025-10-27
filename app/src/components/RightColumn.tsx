import { useState, useRef, useEffect } from 'react';
import './RightColumn.css';

interface CellItem {
  id: string;
  avatar: string;
  address: string;
  certificateNumber: string;
  owner: string;
}

interface RightColumnProps {
  items: CellItem[];
  selectedItemId: string | null;
  onSelectItem: (id: string) => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

export default function RightColumn({
  items,
  selectedItemId,
  onSelectItem,
  expanded = true,
  onToggleExpand,
}: RightColumnProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Virtual scrolling: load more items as user scrolls
  // For simplicity, we'll just show all items; in production, implement virtual list
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
