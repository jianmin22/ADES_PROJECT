import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const LoadingModal = () => {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-white bg-opacity-50">
      <div className="bg-white p-12 rounded-lg shadow-lg">
        <div className="flex items-center justify-center">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-orange-500 text-4xl mr-4" />
          <span className="text-xl">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
