import React from "react";
import tick from "../../tickImage.png";
import { Link } from "react-router-dom";
const ConfirmationModal = ({ onRequestToCart, transactionId }) => {
  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-white bg-opacity-50">
        <div className="w-96 p-6 bg-white rounded-lg shadow-md">
          <div className="flex justify-center items-center mb-4">
            <img src={tick} alt="Tick" className="w-12 h-12 mr-2" />
            <h2 className="text-xl font-bold">Payment Success</h2>
          </div>
          <div className="flex justify-between">
            <Link to={`/userTransactionReceiptPage/${transactionId}`}>
              <h2 className="text-sm cursor-pointer text-blue-400 hover:text-blue-600 underline">
                Print Receipt
              </h2>
            </Link>
            <button
              onClick={onRequestToCart}
              className="bg-orange-500 text-white font-bold py-2 px-4 rounded-full"
            >
              Go To Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;
