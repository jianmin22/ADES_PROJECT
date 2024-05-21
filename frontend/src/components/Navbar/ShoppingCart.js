import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import GeneralModal from "../Modals/GeneralModal";
import Loading from "../Utilities/Loading";

function ShoppingCart() {
    const axios = useAxiosPrivate();
    const { auth } = useAuth();
    const role = !auth.role ? "" : auth.role;

    const [isOpen, setIsOpen] = useState();
    const [errorMsg, setErrorMsg] = useState(
        "Sorry! An unexcpected error has occured while fetching data!"
    );
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [data, setData] = useState({ Items: 0, Subtotal: "0.00" });

    const handleOpen = () => {
        setIsOpen(!isOpen);
    };

    const fetchCartInfo = async () => {
        try {
            if (role === "customer" && !isLoading) {
                setIsLoading(true);
                let cart = await axios.get(`/cart/${auth.userId}/cartId`);

                // can only get cart if var cart not null
                let { cart_id } = cart.data;

                const { data } = await axios.get(`/cart/${cart_id}/info`);
                setData(data);
            }
        } catch (e) {
            if (!e.response.data.error_msg === false)
                setErrorMsg(e.response.data.error_msg);
            setModalIsOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) fetchCartInfo();
    }, [isOpen]);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchCartInfo();
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    return (
        <>
            <GeneralModal
                isOpen={modalIsOpen}
                setIsOpen={setModalIsOpen}
                header={"Error"}
                message={errorMsg}
            />

            <div
                className={`dropdown dropdown-end ${
                    auth.role === "admin" ? "hidden" : ""
                }`}
                ref={dropdownRef}
            >
                <label
                    tabIndex={0}
                    className="btn btn-ghost btn-circle"
                    onClick={handleOpen}
                >
                    <div className="text-2xl indicator">
                        <span className="indicator-item badge badge-primary badge-sm">
                            {data.Items}
                        </span>
                        <FontAwesomeIcon icon={faShoppingCart} />
                    </div>
                </label>
                <div
                    tabIndex={0}
                    className={`mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow border ${
                        isOpen ? "" : "hidden"
                    }`}
                >
                    <div className="card-body">
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <Loading />
                            </div>
                        ) : (
                            <>
                                <span className="font-bold text-lg">
                                    {data.Items} Items
                                </span>
                                <span className="text-slate-600">
                                    Subtotal: ${data.Subtotal}
                                </span>
                                <div className="card-actions">
                                    <Link
                                        to="/cart"
                                        className="btn btn-primary btn-block"
                                        onClick={handleOpen}
                                    >
                                        View cart
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ShoppingCart;
