// {
//     "productId": "115cad33-1be3-46b8-8fe6-477da2a89390",
//     "productDesc": "Stacked high with sliced turkey, crispy bacon, lettuce, tomato, and mayo, this triple-decker sandwich is a classic choice for a satisfying meal.",
//     "price": "10.00",
//     "productName": "Turkey Club Sandwich",
//     "category": "Sandwiches"
// }

import noimage from "../../assets/noimage.png";
import Loading from "../Utilities/Loading";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import colors from "../Utilities/Colors";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import useProductDetails from "./hooks/useProductDetails";
import QtyInput from "../Utilities/QtyInput";
import useAuth from "../../hooks/useAuth";
import ErrorModal from "../Modals/ErrorModal";
import SuccessModal from "../Modals/SuccessModal";
import axios from "../../api/axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
const Product = ({ productId }) => {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();

    const [qty, setQty] = useState(1);

    const { data, isLoading, hasError } = useProductDetails(productId);

    const [isOpen, setIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const onRequestClose = () => {
        setIsOpen(false);
        // window.location.assign("/login");
        navigate("/login");
    };
    // need to update to chcek for image presence in DB

    const [successIsOpen, setSuccessIsOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const onSuccessClose = () => {
        setSuccessIsOpen(false);
    };

    const handleAddToCart = async () => {
        if (!auth.userId) {
            setErrorMessage("Login to add this item to Cart...");
            setIsOpen(true);
            return;
        }

        try {
            const { userId } = auth;
            const cartResponse = await axiosPrivate.get(
                `cart/${userId}/cartId`
            );
            const addToCart = await axiosPrivate.post(
                `cart/${cartResponse.data.cart_id}/add/${productId}`,
                {
                    userId: userId,
                    qty: qty,
                }
            );

            if (addToCart.data.success) {
                setSuccessMessage(
                    `Successfully added ${qty}x ${data.details.productName} to cart!`
                );
                setSuccessIsOpen(true);
            }
        } catch (e) {
            console.log(e);
            setErrorMessage(e.response.data.error_msg || e.response.data);
            setIsOpen(true);
        }
    };

    useEffect(() => {
        if (hasError) {
            setErrorMessage("An Error has occured while fetching data!");
            setIsOpen(true);
        }
    }, [hasError]);

    return (
        <div>
            <ErrorModal
                isOpen={isOpen}
                onRequestClose={onRequestClose}
                errorMessage={errorMessage}
            />
            <SuccessModal
                successIsOpen={successIsOpen}
                onSuccessClose={onSuccessClose}
                successMessage={successMessage}
            />
            {isLoading || hasError ? (
                <div className="w-full bg-white border border-black border-opacity-25 rounded-xl p-4 flex items-center justify-center mb-4">
                    <Loading />
                </div>
            ) : (
                <div className="mb-4 w-full bg-white border border-black border-opacity-25 rounded-xl p-4 flex flex-col md:flex-row justify-between space-x-4 hover:shadow-lg transition-all">
                    <Link to={`/shop/${productId}`} className="flex w-full">
                        <div className="flex flex-col justify-between w-full">
                            <div className="flex justify-between md:justify-normal md:items-center space-x-2 md:text-xl">
                                <h1 className="font-bold">
                                    {data.details.productName}
                                </h1>
                                <div className="flex items-center space-x-2">
                                    <h1>
                                        -{" "}
                                        {isNaN(data.avgReview)
                                            ? "No Reviews"
                                            : data.avgReview}
                                    </h1>
                                    {isNaN(data.avgReview) ? "" : "/5"}
                                    {isNaN(data.avgReview) ? (
                                        ""
                                    ) : (
                                        <FontAwesomeIcon
                                            icon={faStar}
                                            color="orange"
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col space-y-4 items-center px-8">
                                <p className="italic lg:text-xl">
                                    "{data.details.productDesc}"
                                </p>
                            </div>

                            <div className="flex justify-between items-center py-1 pb-4 md:py-0 md:pb-0">
                                <div className="space-x-4">
                                    <button
                                        className="px-4 rounded-full shadow-lg"
                                        style={{
                                            background:
                                                colors[
                                                    data.details.categoryName
                                                ],
                                        }}
                                    >
                                        {data.details.categoryName}
                                    </button>
                                </div>
                                <button className="border-2 border-mainOrange w-max md:py-1 px-4 rounded-full">
                                    S${data.details.price}
                                </button>
                            </div>
                        </div>
                    </Link>

                    <div className="flex flex-col space-y-4 items-center md:items-stretch">
                        <div
                            className={`h-48 w-48 ${
                                isLoading
                                    ? "flex items-center justify-center"
                                    : ""
                            }`}
                        >
                            {isLoading ? (
                                <Loading />
                            ) : (
                                <a
                                    href={`${
                                        data.images.uri
                                            ? data.images.uri
                                            : noimage
                                    }`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <img
                                        src={
                                            data.images.uri
                                                ? data.images.uri
                                                : noimage
                                        }
                                        className="shadow-lg rounded-lg object-cover object-center w-full h-full"
                                        alt="product"
                                    />
                                </a>
                            )}
                        </div>
                        <div className="flex flex-col space-y-4 items-center justify-center">
                            {data.details.stock <= 0 ? (
                                <div className="px-4 py-2 border-2 border-mainOrange text-black rounded-lg w-full flex items-center justify-center font-bold">
                                    <h1>Out of stock</h1>
                                </div>
                            ) : (
                                <>
                                    <QtyInput
                                        max={data.details.stock}
                                        qty={qty}
                                        setQty={setQty}
                                    />
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex items-center justify-center space-x-2 px-4 py-2 font-bold border border-mainOrange bg-mainOrange rounded-lg text-white shadow-lg w-48 hover:border hover:border-mainOrange hover:bg-white hover:text-mainOrange transition-all"
                                    >
                                        <h1>Add to Cart</h1>
                                        <FontAwesomeIcon
                                            icon={faCartShopping}
                                        />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Product;
