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
  onAddItem: (item: Omit<CellItem, 'id'>) => void;
  uploadEnabled: boolean;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

export default function RightColumn({
  items,
  selectedItemId,
  onSelectItem,
  onAddItem,
  uploadEnabled,
  expanded = true,
  onToggleExpand,
}: RightColumnProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    avatar: '',
    address: '',
    certificateNumber: '',
    owner: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadEnabled) {
      alert('Upload is currently disabled. App under maintenance.');
      return;
    }

    // TODO: If UPLOAD_API_CONFIG is true, call the upload endpoint via Service Worker proxy
    if (imageFile) {
      const uploadData = new FormData();
      uploadData.append('address', formData.address);
      uploadData.append('certificateNumber', formData.certificateNumber);
      uploadData.append('owner', formData.owner);
      uploadData.append('image', imageFile, imageFile.name);
      // Example: await fetch('/sw-proxy?targetKey=uploadEndpoint', { method: 'POST', body: uploadData });
    }
    
    onAddItem(formData);
    setFormData({ avatar: '', address: '', certificateNumber: '', owner: '' });
    setImageFile(null);
    setShowAddForm(false);
  };

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
            <p>Upload an image to get started</p>
            <form onSubmit={handleSubmit} className="add-form">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                required
                aria-label="Upload image"
              />
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Certificate Number"
                value={formData.certificateNumber}
                onChange={(e) => setFormData({ ...formData, certificateNumber: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Owner"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                required
              />
              <button type="submit" className="btn btn-primary">Add Item</button>
            </form>
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

          {showAddForm && (
            <div className="add-form-modal">
              <div className="modal-content">
                <h3>Add New Item</h3>
                <form onSubmit={handleSubmit} className="add-form">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    required
                    aria-label="Upload image"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Certificate Number"
                    value={formData.certificateNumber}
                    onChange={(e) => setFormData({ ...formData, certificateNumber: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Owner"
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    required
                  />
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">Add</button>
                    <button type="button" className="btn" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
