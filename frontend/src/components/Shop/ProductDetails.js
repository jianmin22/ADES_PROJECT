import noimage from "../../assets/noimage.png";
import colors from "../Utilities/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import LoadingError from "./LoadingError";
import SuccessModal from "../Modals/SuccessModal";
import ErrorModal from "../Modals/ErrorModal";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import QtyInput from "../Utilities/QtyInput";
const ProductDetails = ({ data }) => {
    // {
    //     "details": {
    //         "productId": "95458dce-2722-48d9-8fb1-8e443ffd72e2",
    //         "productDesc": "123",
    //         "price": "123.00",
    //         "categoryId": "5",
    //         "stock": 123,
    //         "productName": "123",
    //         "categoryName": "Bread"
    //     },
    //     "reviews": [],
    //     "images": "",
    //     "avgReview": "NaN"
    // }
    const axiosPrivate = useAxiosPrivate()
    const { auth } = useAuth();
    const navigate = useNavigate();

    const [qty, setQty] = useState(1);

    const [isOpen, setIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const onRequestClose = () => {
        setIsOpen(false);
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
                `cart/${cartResponse.data.cart_id}/add/${data.details.productId}`,
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
            setErrorMessage(e.response.data.error_msg);
            setIsOpen(true);
        }
    };
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
            {!data ? (
                <LoadingError message={"Error Loading Product!"} />
            ) : (
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-mainOrange text-3xl font-bold my-4">
                        Product Details
                    </h1>
                    <div className="h-auto w-full shadow-lg rounded-xl border border-slate-900 border-opacity-50 mt-4 p-8 flex flex-col items-center md:items-stretch md:flex-row md:space-x-4 ">
                        <div className="md:w-1/4">
                            <a
                                href={`${
                                    data.images && data.images.uri
                                        ? data.images.uri
                                        : noimage
                                }`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img
                                    src={
                                        data.images && data.images.uri
                                            ? data.images.uri
                                            : noimage
                                    }
                                    className="h-96 w-96 object-cover object-center rounded-lg shadow-sm "
                                    alt="product"
                                />
                            </a>
                        </div>
                        <div className="flex flex-col md:w-3/4 justify-between">
                            <div>
                                <h1 className="text-3xl text-mainOrange font-bold text-center md:text-left mt-4 md:mt-0">
                                    {data.details.productName}
                                </h1>
                                <h1 className="italic text-3xl mt-2 text-center md:text-left">
                                    S$ {data.details.price}
                                </h1>

                                <div className="italic text-clip mt-4 text-justify md:text-left">
                                    {data.details.productDesc}
                                </div>
                            </div>
                            <div className="flex flex-col lg:flex-row justify-between items-center">
                                <div className="lg:w-4/5 w-full mt-4 lg:mt-0 flex space-x-4 items-center">
                                    <h1 className="italic">Tags:</h1>
                                    <Link
                                        to="/shop/search"
                                        state={{
                                            category: data.details.categoryName,
                                        }}
                                    >
                                        <button
                                            className="px-4 py-1 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    colors[
                                                        data.details
                                                            .categoryName
                                                    ],
                                            }}
                                        >
                                            {data.details.categoryName}
                                        </button>
                                    </Link>
                                </div>

                                {data.details.stock <= 0 ? (
                                    <div className="px-4 py-2 border-2 border-mainOrange text-black rounded-lg flex items-center justify-center font-bold">
                                        <h1>Out of stock</h1>
                                    </div>
                                ) : (
                                    <>
                                        <div className="p-8 md:p-0">
                                            <QtyInput
                                                max={data.details.stock}
                                                qty={qty}
                                                setQty={setQty}
                                            />
                                        </div>

                                        <div className="lg:w-1/5 w-full flex justify-center mt-6 md:mt-0 md:justify-end">
                                            <button
                                                className="flex justify-between items-center space-x-2 px-4 py-1 rounded-lg border border-mainOrange bg-mainOrange text-white hover:bg-white hover:text-mainOrange transition-all text-xl"
                                                onClick={handleAddToCart}
                                            >
                                                <h1>Add to Cart</h1>
                                                <FontAwesomeIcon
                                                    icon={faCartShopping}
                                                />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
