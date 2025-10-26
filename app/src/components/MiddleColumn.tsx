import './MiddleColumn.css';

interface CellItem {
  id: string;
  avatar: string;
  address: string;
  certificateNumber: string;
  owner: string;
}

interface MiddleColumnProps {
  selectedItem: CellItem | undefined;
  onNavigate?: () => void;
}

export default function MiddleColumn({ selectedItem, onNavigate }: MiddleColumnProps) {
  if (!selectedItem) {
    return (
      <div className="middle-column">
        <div className="empty-state">
          <h2>No Item Selected</h2>
          <p>Select an item from the right panel to view details</p>
          {onNavigate && (
            <button className="btn btn-primary" onClick={onNavigate}>
              Go to Items
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="middle-column">
      <div className="item-detail">
        <div className="detail-header">
          <h2>Item Details</h2>
        </div>
        <div className="detail-content">
          <div className="detail-avatar-large">
            {selectedItem.avatar ? (
              <img src={selectedItem.avatar} alt={selectedItem.owner} />
            ) : (
              <div className="avatar-placeholder-large">No Image</div>
            )}
          </div>
          <div className="detail-fields">
            <div className="detail-field">
              <label>Address</label>
              <p>{selectedItem.address}</p>
            </div>
            <div className="detail-field">
              <label>Certificate Number</label>
              <p>{selectedItem.certificateNumber}</p>
            </div>
            <div className="detail-field">
              <label>Owner</label>
              <p>{selectedItem.owner}</p>
            </div>
            <div className="detail-field">
              <label>Item ID</label>
              <p className="item-id">{selectedItem.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}