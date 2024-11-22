import React from 'react';

interface NoticeProps {
  percentageCharge: number;
  onCancel: () => void;
  onContinue: () => void;
}

const Notice: React.FC<NoticeProps> = ({ percentageCharge, onCancel, onContinue }) => {
  return (
    <div className="absolute bottom-0 px-1 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        {/* Notice Content */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Reservation Charge Notice
        </h2>
        <p className="text-gray-700 mb-6">
          Please note that reserving this property will incur a non-refundable charge of 
          <span className="font-bold text-blue-600"> {percentageCharge}% </span>
          of the total cost. Do you wish to proceed?
        </p>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-4 py-2 rounded-md transition"
          >
            Cancel
          </button>
          <button
            onClick={onContinue}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notice;
