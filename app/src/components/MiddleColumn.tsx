import { useState } from 'react';
import DetailTab from './DetailTab';
import ValidationTab from './ValidationTab';
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
  onUpdateItem: (id: string, field: string, value: string) => void;
  apiValid: boolean;
}

export default function MiddleColumn({
  selectedItem,
  onNavigate,
  onUpdateItem,
  apiValid,
}: MiddleColumnProps) {
  const [activeTab, setActiveTab] = useState('detail');

  if (!selectedItem) {
    return (
      <div className="middle-column empty-state-container">
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

  const handleUpdate = (field: string, value: string) => {
    onUpdateItem(selectedItem.id, field, value);
  };

  return (
    <div className="middle-column">
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'detail' ? 'active' : ''}`}
          onClick={() => setActiveTab('detail')}
        >
          Detail
        </button>
        <button
          className={`tab-button ${activeTab === 'validation' ? 'active' : ''}`}
          onClick={() => setActiveTab('validation')}
        >
          Validation
        </button>
      </div>
      <div className="tab-content">
        {activeTab === 'detail' && (
          <DetailTab selectedItem={selectedItem} onUpdate={handleUpdate} />
        )}
        {activeTab === 'validation' && <ValidationTab apiValid={apiValid} />}
      </div>
    </div>
  );
}
