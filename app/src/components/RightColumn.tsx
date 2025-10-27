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
  onSelectItem: (id: string | null) => void;
  onSync: (id: string) => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
  onBulkEdit: (ids: string[]) => void;
}

const BulkEditingBar = () => (
  <div className="bulk-editing-bar">
    {/* Add bulk editing actions here */}
  </div>
);

export default function RightColumn({
  items,
  selectedItemId,
  onSelectItem,
  onSync,
  expanded = true,
  onToggleExpand,
  onBulkEdit,
}: RightColumnProps) {
  const [multiSelect, setMultiSelect] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const longPressTimer = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - scrollTop <= clientHeight * 1.5) {
        setVisibleCount(prev => Math.min(prev + 20, items.length));
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [items.length]);

  const handleTouchStart = (id: string) => {
    longPressTimer.current = window.setTimeout(() => {
      setMultiSelect(true);
      setSelectedItems([id]);
      onBulkEdit([id]);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleClick = (id: string) => {
    if (multiSelect) {
      const newSelectedItems = selectedItems.includes(id)
        ? selectedItems.filter(item => item !== id)
        : [...selectedItems, id];
      setSelectedItems(newSelectedItems);
      onBulkEdit(newSelectedItems);
    } else {
      onSelectItem(id);
    }
  };

  useEffect(() => {
    if (multiSelect && selectedItems.length === 0) {
      setMultiSelect(false);
      onBulkEdit([]);
    }
  }, [selectedItems, multiSelect, onBulkEdit]);

  return (
    <div className={`right-column ${expanded ? 'expanded' : 'collapsed'}`}>
      {onToggleExpand && <button className="toggle-button" onClick={onToggleExpand}>{expanded ? '→' : '←'}</button>}
      {expanded && (
        <>
          {multiSelect && <BulkEditingBar />}
          <div className="column-header">
            <h3>Items ({items.length})</h3>
          </div>
          <div className="items-list" ref={containerRef}>
            {items.slice(0, visibleCount).map(item => (
              <div
                key={item.id}
                className={`item-cell ${selectedItemId === item.id ? 'selected' : ''} ${selectedItems.includes(item.id) ? 'multi-selected' : ''}`}
                onClick={() => handleClick(item.id)}
                onTouchStart={() => handleTouchStart(item.id)}
                onTouchEnd={handleTouchEnd}
              >
                {item.syncStatus === 'pending' && <div className="sync-status" onClick={(e) => { e.stopPropagation(); onSync(item.id); }} />}
                <div className="item-avatar">
                  {item.avatar ? <img src={item.avatar} alt={item.owner} /> : <div className="avatar-placeholder">?</div>}
                </div>
                <div className="item-details">
                  <div className="item-field">{item.certificateNumber}</div>
                  <div className="item-field">{item.owner}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
