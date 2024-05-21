import React from "react";

const ConfirmCancelModal = ({
    confirmationIsOpen,
    onConfirm,
    onCancel,
    confirmationMessage,
}) => {
    return (
        <>
            {confirmationIsOpen && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-white bg-opacity-50 ">
                    <div className="w-96 p-6 bg-white rounded-lg border border-black border-opacity-50 shadow-2xl">
                        <h2 className="mb-4 text-xl text-center">
                            {confirmationMessage}
                        </h2>
                        <div className="flex justify-center space-x-8">
                            <button
                                className="bg-gray-400 text-white py-2 px-4 rounded-lg"
                                onClick={onCancel}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-500 text-white  py-2 px-4 rounded-lg"
                                onClick={onConfirm}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ConfirmCancelModal;
