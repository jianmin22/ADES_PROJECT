import { useEffect, useState } from "react";
import axios from "../../../api/axios";
const useProductDetails = (product_id) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(null);

    useEffect(() => {
        const retrieveProductData = async () => {
            try {
                // let product_id = 1;
                const productDetails = await axios.get(
                    `/shop/products/${product_id}/details`
                );
                if (productDetails.data) {
                    const [images, reviews, avgReview] = await Promise.all([
                        axios.get(`/shop/products/${product_id}/image`),
                        axios.get(
                            `/shop/products/${product_id}/reviews`
                        ),
                        axios.get(
                            `/shop/products/${product_id}/reviews?avg=true`
                        ),
                    ]);

                    setData({
                        details: productDetails.data,
                        reviews: reviews.data,
                        images: images.data,
                        avgReview: avgReview.data,
                    });

                    setIsLoading(false);
                }
            } catch (e) {
                setHasError(e);
                setIsLoading(false);
            }
        };

        retrieveProductData();
    }, []);

    return { data, isLoading, hasError };
};

export default useProductDetails;
