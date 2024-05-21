import { useEffect, useState, useRef } from "react";
import useSearchOptions from "./hooks/useSearchOptions";
import LoadingSpinner from "../Utilities/Loading";

const SearchOptions = ({ updateSearchOptions, state }) => {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchString, setSearchString] = useState("");
    const [priceRange, setPriceRange] = useState({
        min: 0,
        max: 0,
        value: 0,
    });

    const { categoryData, productPrices, isLoading, hasError } =
        useSearchOptions();
    // Could be improved, use Min and Max of searched producut prices

    // Handling Form Inputs
    const handleTextInput = (e) => {
        setSearchString(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handlePriceSlider = (e) => {
        e.target.min = productPrices.min;
        e.target.max = productPrices.max;
        setPriceRange({
            value: e.target.value,
        });
    };

    const searchProductTimeoutRef = useRef(null);
    const searchProductDebounced = () => {
        if (!isLoading) {
            clearTimeout(searchProductTimeoutRef.current);
            searchProductTimeoutRef.current = setTimeout(() => {
                updateSearchOptions({
                    category: !categoryData[selectedCategory]
                        ? "All"
                        : categoryData[selectedCategory].categoryId,
                    searchString: searchString,
                    maxPrice:
                        priceRange.value >= productPrices.min &&
                        priceRange.value <= productPrices.max
                            ? priceRange.value
                            : productPrices.max,
                });
            }, 250);
        }
    };

    useEffect(() => {
        if (categoryData) {
            let cat = state && state.category ? state.category : null;

            updateSearchOptions({
                category: "All",
                searchString: searchString,
                maxPrice: priceRange.max,
            });

            if (cat) {
                let { categoryId } = categoryData.filter(
                    (c) => c.categoryName === cat
                )[0];
                updateSearchOptions({
                    category: categoryId,
                    searchString: searchString,
                    maxPrice: priceRange.max,
                });
                setSelectedCategory(categoryId - 1);
                cat = null;
            }
        }
    }, [categoryData]);

    useEffect(() => {
        searchProductDebounced();

        return () => {
            clearTimeout(searchProductTimeoutRef.current);
        };
    }, [selectedCategory, searchString, priceRange.value]);

    return (
        <div className="w-full max-w-5xl self-center pb-6">
            <div
                className={`bg-white rounded-lg mt-12 p-4 border ${
                    isLoading ? "flex justify-center p-12" : ""
                }`}
            >
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        <form className="flex flex-col items-center justify-center w-full space-y-4">
                            <div className="flex items-center justify-center space-x-4 w-full">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="input input-bordered input-primary w-full "
                                    value={searchString}
                                    onChange={handleTextInput}
                                />

                                <select
                                    className="select select-primary w-full max-w-xs"
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                >
                                    <option
                                        value="All"
                                        className="text-mainOrange"
                                    >
                                        All
                                    </option>
                                    {!categoryData
                                        ? ""
                                        : categoryData.map((c, index) => (
                                              <option
                                                  value={index}
                                                  key={c.categoryId}
                                                  className="text-mainOrange"
                                              >
                                                  {c.categoryName}
                                              </option>
                                          ))}
                                </select>
                            </div>

                            <div className="flex items-center justify-center w-full space-x-4">
                                <input
                                    type="range"
                                    min={!productPrices ? 0 : productPrices.min}
                                    max={!productPrices ? 0 : productPrices.max}
                                    value={priceRange.value}
                                    onChange={handlePriceSlider}
                                    className="range range-primary range-sm w-full min-w-xs"
                                />
                                <input
                                    type="text"
                                    disabled={true}
                                    value={
                                        priceRange.value === 0
                                            ? "Max"
                                            : priceRange.value
                                    }
                                    placeholder="Price"
                                    className="input input-bordered border text-right w-20"
                                />
                            </div>
                        </form>
                        {/* 
Main
1. Search string
2. Category
3. Price range


Aside
1. Order By
2. Records per page
*/}
                    </>
                )}
            </div>
        </div>
    );
};

export default SearchOptions;
