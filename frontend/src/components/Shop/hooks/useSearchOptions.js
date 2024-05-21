import axios from "../../../api/axios";
import { useState, useEffect } from "react";

const useSearchOptions = () => {
    // Search Option States
    const [categoryData, setCategoryData] = useState(null);
    const [productPrices, setProductPrices] = useState(null);

    // Other States
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                let [catResponse, minmaxResponse] = await Promise.all([
                    axios.get("/shop/categories"),
                    axios.get("/shop/prices/minmax"),
                ]);
                setCategoryData(catResponse.data);
                setProductPrices(minmaxResponse.data);

                console.log(minmaxResponse);
            } catch (e) {
                setHasError(e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return { categoryData, productPrices, isLoading, hasError };
};

export default useSearchOptions;
