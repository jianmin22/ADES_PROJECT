import SearchOptions from "../components/Shop/SearchOptions";
import SearchResults from "../components/Shop/SearchResults";
import { useEffect, useState } from "react";

import BackToTopButton from "../components/Utilities/BackToTop";

import Pagination from "../components/Utilities/Pagination";
import { useLocation } from "react-router-dom";
const Shop = () => {
    let { state } = useLocation();

    const [searchOptions, updateSearchOptions] = useState(null);
    const [maxPage, setMaxPage] = useState({
        max: 1,
    });

    // to get minmax value from searchResults when query is ran
    // Math.ceil(results.data/length / results per page)

    const [currentPage, setCurrentPage] = useState(1);
    // run serach results on currentPage state update

    useEffect(() => {
        setCurrentPage(1);
    }, [searchOptions]);

    return (
        <div className="h-screen flex flex-col justify-start">
            <h1 className="text-3xl self-center mt-8 text-mainOrange font-bold">
                Huang's Bakery Shop
            </h1>
            <div className="flex flex-col flex-grow px-12">
                <SearchOptions
                    updateSearchOptions={updateSearchOptions}
                    state={state}
                />
                <SearchResults
                    searchOptions={searchOptions}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    setMaxPage={setMaxPage}
                />
            </div>

            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                maxPage={maxPage}
            />

            <BackToTopButton />
        </div>
    );
};

export default Shop;
