import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleDoubleLeft,
    faAngleDoubleRight,
} from "@fortawesome/free-solid-svg-icons";

const Pagination = ({ currentPage, setCurrentPage, maxPage }) => {
    const handleFirst = () => {
        setCurrentPage(1);
    };

    const handleLast = () => {
        setCurrentPage(maxPage);
    };

    const handleNext = () => {
        if (!(currentPage + 1 > maxPage)) setCurrentPage(currentPage + 1);
    };

    const handlePrev = () => {
        if (!(currentPage - 1 < 1)) setCurrentPage(currentPage - 1);
    };

    return (
        <div className="flex flex-row justify-center mb-8 py-4">
            <div className="flex items-center border border-slate-900 border-opacity-25 rounded-lg">
                <button
                    className="shadow-lg px-4 py-2 text-sm font-medium text-mainOrange border-r bg-white border-0 border-slate-400 rounded-l-lg hover:bg-mainOrange hover:text-white transition-all"
                    onClick={handleFirst}
                >
                    <FontAwesomeIcon icon={faAngleDoubleLeft} />
                </button>
                <button
                    className="shadow-lg px-4 py-2 text-sm font-medium text-mainOrange bg-white border-0 border-mainOrange rounded-r-lg hover:bg-mainOrange hover:text-white transition-all"
                    onClick={handlePrev}
                >
                    Prev
                </button>
            </div>
            <div className="inline-flex items-center px-4 py-2 mx-1 rounded text-sm text-black font-bold border border-mainOrange bg-white shadow-lg">
                {currentPage}
            </div>
            <div className="flex items-center border border-slate-900 border-opacity-25 rounded-lg">
                <button
                    className="shadow-lg px-4 py-2 text-sm font-medium text-mainOrange bg-white border-0 border-mainOrange rounded-l-lg hover:bg-mainOrange hover:text-white transition-all"
                    onClick={handleNext}
                >
                    Next
                </button>
                <button
                    className="shadow-lg px-4 py-2 text-sm font-medium text-mainOrange border-l bg-white border-0 border-slate-400 rounded-r-lg hover:bg-mainOrange hover:text-white transition-all"
                    onClick={handleLast}
                >
                    <FontAwesomeIcon icon={faAngleDoubleRight} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
