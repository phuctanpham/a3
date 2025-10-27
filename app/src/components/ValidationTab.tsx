import './ValidationTab.css';

interface ValidationTabProps {
  apiValid: boolean;
}

export default function ValidationTab({ apiValid }: ValidationTabProps) {
  return (
    <div className="validation-tab">
      {apiValid ? (
        <div>
          {/* Add validation content here */}
        </div>
      ) : (
        <div className="api-invalid-message">
          <p>This feature is currently disabled because the API endpoint is not configured.</p>
        </div>
      )}
    </div>
  );
}
