import React from "react";
import { useParams } from "react-router-dom";
import useProductDetails from "../components/Shop/hooks/useProductDetails";
import Loading from "../components/Utilities/Loading";
import ProductDetails from "../components/Shop/ProductDetails";
import ProductReview from "../components/Shop/ProductReview";
import Back from "../components/Utilities/Back";
import LoadingError from "../components/Shop/LoadingError";

import BackToTopButton from "../components/Utilities/BackToTop";

function Product() {
    const { product_id } = useParams();
    const { data, isLoading, error } = useProductDetails(product_id);

    return (
        <div
            className={
                isLoading ? `flex flex-grow justify-center items-center` : ""
            }
        >
            {isLoading ? (
                <Loading />
            ) : error ? (
                <LoadingError message={"This product does not exist. "} />
            ) : (
                <div className="px-6 pt-6 md:px-12 h-full">
                    <Back />
                    <div className="flex flex-col space-y-8 divide-y-2">
                        <ProductDetails data={data} />
                        <ProductReview data={data} />
                    </div>
                </div>
            )}

            <BackToTopButton />
        </div>
    );
}

export default Product;
