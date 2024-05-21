import { useEffect, useRef } from "react";

function CustomModalOK({ isOpen, onClose, children }) {
    const modalRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            modalRef.current.showModal();
        }
    }, [isOpen]);

    const handleModalClose = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <dialog ref={modalRef} className="modal">
            <div className="modal-box">{children}</div>
            <form
                method="dialog"
                className="modal-backdrop"
                onSubmit={handleModalClose}
            >
                <button type="button" onClick={handleModalClose}>
                    Close
                </button>
            </form>
        </dialog>
    );
}

export default CustomModalOK;
