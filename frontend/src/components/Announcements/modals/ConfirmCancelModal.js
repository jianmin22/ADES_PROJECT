import { useEffect } from "react";
const ConfirmCancelModal = ({
    onConfirm,
    onCancel,
    isOpen,
    header,
    message,
}) => {
    useEffect(() => {
        if (isOpen) window.ConfirmCancelModal.showModal();
    }, [isOpen]);

    return (
        <dialog id="ConfirmCancelModal" className="modal">
            <form method="dialog" className="modal-box" onSubmit={onCancel}>
                <h3 className="font-bold text-xl">{!header ? "" : header}</h3>
                <p className="py-4">{!message ? "" : message}</p>

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onCancel}
                        className="btn btn-ghost font-normal capitalize"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="btn btn-error !bg-red-600 font-normal uppercase"
                    >
                        Confirm
                    </button>
                </div>
            </form>
            <form
                method="dialog"
                className="modal-backdrop"
                onSubmit={onCancel}
            >
                <button>close</button>
            </form>
        </dialog>
    );
};

export default ConfirmCancelModal;
