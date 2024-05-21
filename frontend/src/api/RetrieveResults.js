import { useEffect, useState } from "react";
import axios from "./axios";

const useRetrieveResults = ({
    category,
    searchString,
    maxPrice,
    resultsPerPage,
    orderBy,
}) => {
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (
                    category != undefined &&
                    searchString != undefined &&
                    maxPrice != undefined &&
                    resultsPerPage != undefined &&
                    orderBy != undefined
                ) {
                    const body = {
                        category: category,
                        searchString: searchString,
                        maxPrice: maxPrice,
                        resultsPerPage: resultsPerPage,
                        orderBy: orderBy,
                    };
                    let response = await axios.post("/shop/search", body);

                    setResults(response.data);
                    setIsLoading(false);
                }

                // wait until body is full then stop loading
            } catch (e) {
                setHasError(true);
            }
        };
        fetchData();
    }, []);

    return { results, isLoading, hasError };
};

export default useRetrieveResults;
