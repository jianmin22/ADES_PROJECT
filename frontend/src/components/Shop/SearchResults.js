import { useState, useEffect, useRef } from "react";
import SortOptions from "./SortByEnum";
import PageResults from "./PageResultsEnum";
import LoadingSpinner from "../Utilities/Loading";
import Product from "./Product";
import axios from "../../api/axios";

import axiosPrivate from "../../api/axios";

const SearchResults = ({
    searchOptions,
    currentPage,
    setMaxPage,
    setCurrentPage,
}) => {
    const [resultsPerPage, setResultsPerPage] = useState(5);
    const [orderBy, setOrderBy] = useState(SortOptions.RELEVANT);

    const [searchResultOptions, setSearchResultOptions] = useState({
        resultsPerPage: resultsPerPage,
        orderBy: orderBy,
    });

    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const retrieveResults = async ({
        category,
        searchString,
        maxPrice,
        resultsPerPage,
        orderBy,
    }) => {
        const body = {
            category: category,
            searchString: searchString,
            maxPrice: maxPrice,
            resultsPerPage: resultsPerPage,
            orderBy: orderBy,
            currentPage,
        };

        try {
            let response = await axios.post("/shop/search", body);
            setResults(response.data);
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    const updateMinMaxPage = async ({
        category,
        searchString,
        maxPrice,
        resultsPerPage,
        orderBy,
    }) => {
        const body = {
            category: category,
            searchString: searchString,
            maxPrice: maxPrice,
            resultsPerPage: resultsPerPage,
            orderBy: orderBy,
        };

        try {
            let { data } = await axios.post("/shop/search/count", body);
            setMaxPage(data.maxPage);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        const { category, searchString, maxPrice, resultsPerPage, orderBy } =
            searchResultOptions;
        if (
            category !== undefined &&
            searchString !== undefined &&
            maxPrice !== undefined &&
            resultsPerPage !== undefined &&
            orderBy !== undefined &&
            currentPage !== undefined
        ) {
            setIsLoading(true);
            updateMinMaxPage(searchResultOptions);
            retrieveResults(searchResultOptions);
        }
    }, [searchResultOptions, currentPage]);

    const handleResultsPerPage = (e) => {
        setResultsPerPage(e.target.value);
    };

    const handleOrderBy = (e) => {
        setOrderBy(e.target.value);
    };

    const resultOption = useRef(null);
    const searchResultsDebounced = () => {
        clearTimeout(resultOption.current);
        resultOption.current = setTimeout(() => {
            setSearchResultOptions({
                ...searchOptions,
                resultsPerPage:
                    PageResults[resultsPerPage] === undefined
                        ? PageResults[5]
                        : PageResults[resultsPerPage],
                orderBy: Object.values(SortOptions).includes(orderBy)
                    ? orderBy
                    : SortOptions.RELEVANT,
            });
        }, 250);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [resultsPerPage, orderBy]);

    useEffect(() => {
        searchResultsDebounced();

        return () => {
            clearTimeout(resultOption.current);
        };
    }, [resultsPerPage, orderBy, searchOptions]);

    return (
        <div className="flex-grow w-full max-w-5xl self-center">
            <div className="flex justify-center md:justify-end pt-4 pb-8 md:pt-0 md:pb-0">
                <div className="flex space-x-8 items-center mb-4">
                    <div className="space-x-2">
                        <label>Per Page</label>
                        <select
                            className="border border-black p-2 px-3 py-1 rounded-lg "
                            onChange={handleResultsPerPage}
                        >
                            <option
                                value={PageResults[5]}
                                className="text-mainOrange"
                            >
                                5
                            </option>
                            <option
                                value={PageResults[10]}
                                className="text-mainOrange"
                            >
                                10
                            </option>
                            <option
                                value={PageResults[15]}
                                className="text-mainOrange"
                            >
                                15
                            </option>
                        </select>
                    </div>

                    <div className="space-x-2">
                        <label>Order by</label>
                        <select
                            className="border border-black p-2 px-3 py-1 rounded-lg"
                            onChange={handleOrderBy}
                        >
                            <option
                                value={SortOptions.RELEVANT}
                                className="text-mainOrange"
                            >
                                Most Relevant
                            </option>
                            <option
                                value={SortOptions.ASCENDING}
                                className="text-mainOrange"
                            >
                                Price Ascending
                            </option>
                            <option
                                value={SortOptions.DESCENDING}
                                className="text-mainOrange"
                            >
                                Price Descending
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            <div
                className={`${
                    isLoading
                        ? `flex justify-center items-center flex-grow h-full`
                        : ""
                }`}
            >
                {isLoading ? (
                    <div className="bg-white p-4 rounded-lg">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <div
                        className={
                            results.length === 0
                                ? "flex items-center justify-center h-64"
                                : ""
                        }
                    >
                        {!results?.length === false ? (
                            results.map((r) => (
                                <Product
                                    productId={r.productId}
                                    key={r.productId}
                                />
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-64">
                                <h1 className="text-bold italic">
                                    Sorry! There are no results for your search.
                                </h1>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
