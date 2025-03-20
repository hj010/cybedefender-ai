import React from 'react';
import { X } from 'lucide-react';

const ThreatDetailsModal = ({ isOpen, onClose, threatType, alerts }) => {
  if (!isOpen) return null;

  // Calculate total count for the selected threat type
  const threatCount = alerts.filter(alert => alert.threatType === threatType).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        
        <div className="mt-2">
          <h3 className="text-lg font-semibold mb-4">Threat Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Threat Type:</span>
              <span className="font-medium">{threatType}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Count:</span>
              <span className="font-medium">{threatCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatDetailsModal;