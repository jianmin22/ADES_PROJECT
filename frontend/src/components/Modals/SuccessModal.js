import React from "react";

const SuccessModal = ({ successIsOpen, onSuccessClose, successMessage }) => {
    return (
        <>
            {successIsOpen && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-white bg-opacity-50">
                    <div className="w-96 p-6 bg-white rounded-lg shadow-md">
                        <h2 className="mb-4 text-xl font-bold">
                            {successMessage}
                        </h2>
                        <div className="flex justify-end">
                            <button
                                onClick={onSuccessClose}
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

export default SuccessModal;
