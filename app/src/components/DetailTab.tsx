import './DetailTab.css';

interface DetailTabProps {
  selectedItem: any;
  onUpdate: (field: string, value: string) => void;
}

export default function DetailTab({ selectedItem, onUpdate }: DetailTabProps) {
  if (!selectedItem) return null;

  return (
    <div className="detail-tab">
      <div className="form-field">
        <label>Certificate Number</label>
        <input
          type="text"
          value={selectedItem.certificateNumber}
          onChange={(e) => onUpdate('certificateNumber', e.target.value)}
        />
      </div>
      <div className="form-field">
        <label>Owner</label>
        <input
          type="text"
          value={selectedItem.owner}
          onChange={(e) => onUpdate('owner', e.target.value)}
        />
      </div>
      <div className="form-field">
        <label>Address</label>
        <input
          type="text"
          value={selectedItem.address}
          onChange={(e) => onUpdate('address', e.target.value)}
        />
      </div>
    </div>
  );
}
