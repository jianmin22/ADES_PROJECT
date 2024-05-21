import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
const QtyInput = ({ max, qty, setQty }) => {
    const handleAdd = (e) => {
        setQty(!(qty + 1 > max) ? qty + 1 : qty);
    };

    const handleMinus = (e) => {
        setQty(!(qty - 1 < 1) ? qty - 1 : qty);
    };

    return (
        <div className="flex items-center justify-between w-32 ">
            <button
                onClick={handleMinus}
                className="border border-black px-2 py-1 rounded-l-lg text-mainOrange "
            >
                <FontAwesomeIcon icon={faMinus} />
            </button>
            <h1 className="border border-black w-full px-4 py-1 border-l-0 border-r-0 text-center">
                {qty}
            </h1>
            <button
                className="border border-black px-2 py-1 rounded-r-lg text-mainOrange "
                onClick={handleAdd}
            >
                <FontAwesomeIcon icon={faPlus} />
            </button>
        </div>
    );
};

export default QtyInput;
