import React from "react";

const NotificationModal = ({ isOpen, onRequestClose, notificationMessage }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-white bg-opacity-50">
          <div className="w-96 p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-bold">
              {notificationMessage}
            </h2>
            <div className="flex justify-end">
              <button
                onClick={onRequestClose}
                className="bg-orange-500 text-white font-bold py-2 px-4 rounded-full"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationModal;
