import React, { useEffect, useState } from "react";
import SuccessModal from "../../Modals/SuccessModal";
import ErrorModal from "../../Modals/ErrorModal";
import Loading from "../../Utilities/Loading";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import ImageRow from "./result/ImageRow";

const ManageImage = () => {
    const axiosPrivate = useAxiosPrivate();
    const [products, setProducts] = useState([]);
    const [stripeProducts, setStripeProducts] = useState([]);
    const [stripeInactiveProducts, setStripeInactiveProducts] = useState([]);

    const [dataIsLoading, setDataIsLoading] = useState(true);

    const retrieveData = async () => {
        try {
            setDataIsLoading(true);
            // retrieve data, pass this function to row so on successful update, can refresh
            const [stripe_active, stripe_inactive, response] =
                await Promise.all([
                    axiosPrivate.get("/product/stripe?active=true"),
                    axiosPrivate.get("/product/stripe?active=false"),
                    axiosPrivate.get("/product/all"),
                ]);

            setStripeProducts(stripe_active.data);
            setStripeInactiveProducts(stripe_inactive.data);
            setProducts(response.data);
        } catch (e) {
            console.log(e);
            setErrorMessage(e.response.data.message);
            setIsOpen(true);
        } finally {
            setDataIsLoading(false);
        }
    };

    useEffect(() => {
        retrieveData();
    }, []);

    const [successIsOpen, setSuccessIsOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const onSuccessClose = () => {
        setSuccessIsOpen(false);
    };

    const [errorMessage, setErrorMessage] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const onRequestClose = () => {
        setIsOpen(false);
    };

    return (
        <div className="w-full border border-black rounded-lg flex flex-col items-center ">
            <SuccessModal
                successIsOpen={successIsOpen}
                successMessage={successMessage}
                onSuccessClose={onSuccessClose}
            />
            <ErrorModal
                isOpen={isOpen}
                onRequestClose={onRequestClose}
                errorMessage={errorMessage}
            />
            <div className="flex justify-between items-center w-full px-4 py-2">
                <h1 className="text-3xl text-mainOrange font-bold py-4">
                    Manage Product Images
                </h1>
            </div>

            {dataIsLoading ? (
                <div className="flex h-screen items-center justify-center">
                    <Loading />
                </div>
            ) : (
                <table className="table-fixed border-separate border-spacing-2 w-full h-full ">
                    <thead>
                        <tr className="text-xl sticky top-0 z-10 bg-white">
                            <th className="w-2/12">Image</th>
                            <th className="w-1/12">Name</th>
                            <th className="w-1/12">Category</th>
                            <th className="w-1/12">Status</th>
                            <th className="w-2/12">Preview</th>
                            <th className="w-1/12">Upload</th>
                            <th className="w-1/12">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <ImageRow
                                isActive={stripeProducts.includes(p.productId)}
                                isInactive={stripeInactiveProducts.includes(
                                    p.productId
                                )}
                                data={p}
                                key={p.productId}
                                setSuccessIsOpen={setSuccessIsOpen}
                                setSuccessMessage={setSuccessMessage}
                                setIsOpen={setIsOpen}
                                setErrorMessage={setErrorMessage}
                                retrieveData={retrieveData}
                            />
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ManageImage;
