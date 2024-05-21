import { useEffect } from "react";

function GeneralModal({ isOpen, setIsOpen, header, message }) {
    useEffect(() => {
        if (isOpen) window.General_Modal.showModal();

    }, [isOpen]);


    const handleFormClose = (e) => {
        setIsOpen(false)
    }
    
    return (
        <dialog id="General_Modal" className="modal">
            <form method="dialog" className="modal-box" onSubmit={handleFormClose}>
                <h3 className="font-bold text-xl">{!header ? "" : header}</h3>
                <p className="py-4">{!message ? "" : message}</p>
            </form>
            <form method="dialog" className="modal-backdrop" onSubmit={handleFormClose}>
                <button>close</button>
            </form>
        </dialog>
    );
}

export default GeneralModal;
