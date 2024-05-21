import UpdateRow from "./result/UpdateRow";
import { useEffect, useState } from "react";
import SuccessModal from "../../Modals/SuccessModal";
import ErrorModal from "../../Modals/ErrorModal";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Loading from "../.././Utilities/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";

const UpdateProduct = () => {
    const axiosPrivate = useAxiosPrivate();
    // can edit details and unarchive products
    // productId, productDesc, price, categoryId, stock, productName, cost
    // show main: name, categoryname, price, stock, update btn
    // show: name, descrption, price, cost, stock, categoryname (aside show id)
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

    const [isFetchingData, setIsFetchingData] = useState(false);
    const [stripeProducts, setStripeProducts] = useState([]);
    const [stripeInactiveProducts, setStripeInactiveProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const fetchProducts = async () => {
        try {
            setIsFetchingData(true);
            // retrieve data, pass this function to row so on successful update, can refresh
            const [stripe_active, stripe_inactive, response, categories] =
                await Promise.all([
                    axiosPrivate.get("/product/stripe?active=true"),
                    axiosPrivate.get("/product/stripe?active=false"),
                    axiosPrivate.get("/product/all"),
                    axiosPrivate.get("/shop/categories"),
                ]);

            setStripeProducts(stripe_active.data);
            setStripeInactiveProducts(stripe_inactive.data);
            setProducts(response.data);
            setCategories(categories.data);
        } catch (e) {
            console.log(e);
            setErrorMessage(e.response.data.message);
            setIsOpen(true);
        } finally {
            setIsFetchingData(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const [buttonDisabled, setButtonDisabled] = useState(false);
    const handleForcedRefresh = (e) => {
        if (e) e.preventDefault();
        fetchProducts();

        setButtonDisabled(true);
        setTimeout(() => setButtonDisabled(false), 5000);
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
                    Update Product Details
                </h1>
                <button onClick={handleForcedRefresh} disabled={buttonDisabled}>
                    <FontAwesomeIcon
                        icon={faRefresh}
                        className={`text-3xl border   p-3 rounded-full ${
                            buttonDisabled
                                ? "bg-slate-400 fa-spin"
                                : "border border-mainOrange "
                        } transition-all`}
                    />
                </button>
            </div>

            {isFetchingData ? (
                <div className="flex h-screen items-center justify-center">
                    <Loading />
                </div>
            ) : (
                <table className="table-fixed border-separate border-spacing-2 w-full h-full ">
                    <thead>
                        <tr className="text-xl sticky top-0 z-10 bg-white">
                            <th className="w-1/12">Status</th>
                            <th className="w-2/12">Name</th>
                            <th className="w-4/12">Description</th>
                            <th className="w-1/12">Category</th>
                            <th className="w-1/12">Price</th>
                            <th className="w-1/12">Cost</th>
                            <th className="w-1/12">Stock</th>
                            <th className="w-1/12">Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <UpdateRow
                                isActive={stripeProducts.includes(p.productId)}
                                isInactive={stripeInactiveProducts.includes(
                                    p.productId
                                )}
                                data={p}
                                categories={categories}
                                key={p.productId}
                                setButtonDisabled={setButtonDisabled}
                                setSuccessIsOpen={setSuccessIsOpen}
                                setSuccessMessage={setSuccessMessage}
                                setIsOpen={setIsOpen}
                                setErrorMessage={setErrorMessage}
                                handleForcedRefresh={handleForcedRefresh}
                            />
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UpdateProduct;
