// {
//     "details": {
//         "productId": "115cad33-1be3-46b8-8fe6-477da2a89390",
//         "productDesc": "Stacked high with sliced turkey, crispy bacon, lettuce, tomato, and mayo, this triple-decker sandwich is a classic choice for a satisfying meal.",
//         "price": "10.00",
//         "stock": 100,
//         "productName": "Turkey Club Sandwich",
//         "categoryName": "Sandwich"
//     },
//     "reviews": {
//         "reviewId": "088a89e8-b360-4668-b95b-9e344f265867",
//         "createdAt": "2023-05-22T07:56:16.000Z",
//         "rating": "5.0",
//         "description": "s"
//     },
//     "images": {
//         "uri": "https://images.unsplash.com/photo-1670718278566-97d7b27f0c5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTE4MDV8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODQ3NjUxNjJ8&ixlib=rb-4.0.3&q=80&w=1080"
//     }
// }

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Review from "./Review";
import Pagination from "../Utilities/Pagination";
import { useEffect, useState } from "react";
import axiosPrivate from "../../api/axios";
import Loading from "../Utilities/Loading";
import LoadingError from "./LoadingError";

import axios from "../../api/axios";

const ProductReview = ({ data }) => {
    // Requried by Pagination Component
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPage, setMaxPage] = useState(
        data && data.reviews ? Math.floor(data.reviews.length / 5) : 1
    );

    // ProductReview States
    const [sortBy, setSortBy] = useState("Newest");
    const [reviews, setReviews] = useState(data);

    // Data Fetching States
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    const options = ["Newest", "Oldest", "Highest Rating", "Lowest Rating"];

    const handleOptionSelect = (e) => {
        setSortBy(options.includes(e.target.value) ? e.target.value : "Newest");
        setCurrentPage(1);
    };

    const retrieveReviews = async () => {
        try {
            setIsLoading(true);
            const [newData, avgRating] = await Promise.all([
                axiosPrivate.get(
                    `/shop/products/${data.details.productId}/reviews?sortBy=${sortBy}&page=${currentPage}`
                ),
                axiosPrivate.get(
                    `/shop/products/${data.details.productId}/reviews?avg=true`
                ),
            ]);

            setReviews({
                reviews: newData.data,
                avg: isNaN(avgRating.data) ? null : avgRating.data,
            });
        } catch (e) {
            console.log(e);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        retrieveReviews();
    }, [sortBy, currentPage]);
    return (
        <div>
            {hasError || !(reviews && reviews.reviews) ? (
                <LoadingError message={"Error Loading Review!"} />
            ) : (
                <div className="w-full h-auto flex flex-col items-center justify-center">
                    <div className="w-full flex flex-col md:flex-row justify-between items-center">
                        <h1 className="w-44"></h1>
                        <h1 className="text-mainOrange text-3xl font-bold my-4">
                            Reviews
                        </h1>
                        <select
                            className="w-44 border border-black p-2 px-3 py-1 rounded-lg"
                            value={sortBy}
                            onChange={handleOptionSelect}
                        >
                            {options.map((o) => (
                                <option
                                    key={o}
                                    value={o}
                                    className="text-mainOrange"
                                >
                                    {o}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center justify-center py-4">
                        <h1>
                            Average Rating:{" "}
                            {reviews && reviews.avg ? reviews.avg : "No Rating"}
                        </h1>
                        {reviews && reviews.avg ? (
                            <FontAwesomeIcon icon={faStar} color="orange" />
                        ) : (
                            ""
                        )}
                    </div>

                    {isLoading ? (
                        <div className="h-96 flex items-center justify-center">
                            <Loading />
                        </div>
                    ) : (reviews.reviews && reviews.reviews.length === 0) ||
                      hasError ? (
                        <div className="h-48 w-96 rounded-lg flex items-center justify-center ">
                            <h1 className="text-lg">
                                No reviews found for this product!
                            </h1>
                        </div>
                    ) : (
                        <div className="flex flex-col w-full space-y-4 pb-4">
                            {reviews.reviews.map((r) => (
                                <Review key={r.reviewId} reviewData={r} />
                            ))}
                            <Pagination
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                maxPage={maxPage}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductReview;
