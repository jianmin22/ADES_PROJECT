import { useEffect, useState } from "react";
import useSearchOptions from "../../Shop/hooks/useSearchOptions";
import Loading from "../../Utilities/Loading";
import ErrorModal from "../../Modals/ErrorModal";
import SuccessModal from "../../Modals/SuccessModal";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
const CreateProduct = () => {
    const axiosPrivate = useAxiosPrivate();
    // columns: productId, productDesc, price, categoryId, stock, productName, cost
    const { categoryData, isLoading, hasError } = useSearchOptions();

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");

    const [category, setCategory] = useState({
        categoryName: "",
        categoryId: "",
    });

    useEffect(() => {
        if (
            !isLoading &&
            !hasError &&
            category.categoryName === "" &&
            category.categoryId === ""
        )
            setCategory({
                categoryName: categoryData[0].categoryName,
                categoryId: categoryData[0].categoryId,
            });
    }, [isLoading]);

    const [stock, setStock] = useState("");
    const [description, setDescription] = useState("");
    const [cost, setCost] = useState("");

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handlePriceChange = (e) => {
        if (!isNaN(e.target.value)) setPrice(e.target.value);
    };

    const handleCategoryChange = (e) => {
        const catFound = categoryData.filter(
            (c) => c.categoryName === e.target.value
        );

        if (!catFound?.length) {
            e.target.value = null;
        }

        setCategory(catFound[0]);
    };

    const handleStockChange = (e) => {
        if (!isNaN(e.target.value)) setStock(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleCostChange = (e) => {
        if (!isNaN(e.target.value)) setCost(e.target.value);
    };

    const handleFormReset = (e) => {
        if (e) e.preventDefault();

        setName("");
        setPrice("");
        setCategory({
            categoryName: categoryData[0].categoryName,
            categoryId: categoryData[0].categoryId,
        });
        setStock("");
        setDescription("");
        setCost("");
    };

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

    const [requestLoading, setRequestLoading] = useState(false);

    const createProduct = async (e) => {
        try {
            e.preventDefault();
            setRequestLoading(true);

            const response = await axiosPrivate.post("/product/create", {
                name: name,
                price: price,
                category: category.categoryId,
                stock: stock,
                description: description,
                cost: cost,
            });

            if (response.data.success) {
                setSuccessMessage(
                    `Successfully managed to create ${name}! You may view it in the store now!`
                );
                setSuccessIsOpen(true);
                handleFormReset();
            }
        } catch (e) {
            console.log(e);
            setErrorMessage(e.response.data.message);
            setIsOpen(true);
        } finally {
            setRequestLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-start flex-col w-full">
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
            <form className="border max-w-3xl w-full flex flex-col items-start justify-center p-4 rounded-lg shadow-md">
                <div className="flex items-center justify-center w-full space-x-4">
                    <div className="form-control w-full max-w-md">
                        <label className="label">
                            <span className="label-text">Product Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Name"
                            className="input input-bordered w-full"
                            value={name}
                            onChange={handleNameChange}
                        />
                    </div>

                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Category</span>
                        </label>
                        <select
                            className="select select-bordered text-mainOrange"
                            value={category.categoryName}
                            onChange={handleCategoryChange}
                        >
                            <option disabled selected>
                                Choose Product Category
                            </option>
                            {!isLoading
                                ? categoryData.map((c) => (
                                      <option
                                          key={c.categoryName}
                                          className="text-mainOrange"
                                      >
                                          {c.categoryName}
                                      </option>
                                  ))
                                : ""}
                        </select>
                    </div>
                </div>

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Description</span>
                    </label>
                    <textarea
                        className="textarea textarea-bordered !h-20 resize-none"
                        placeholder="Description"
                        value={description}
                        onChange={handleDescriptionChange}
                    ></textarea>
                </div>
                <div className="divider"></div>
                <div className="flex items-center justify-between space-x-4 w-full">
                    <div className="form-control w-full max-w-xs">
                        <input
                            type="number"
                            placeholder="0.00"
                            className="input input-bordered w-full max-w-xs"
                            value={price}
                            onChange={handlePriceChange}
                        />
                        <label className="label">
                            <span className="label-text-alt badge !bg-green-400">
                                Price
                            </span>
                        </label>
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <input
                            type="text"
                            placeholder="0.00"
                            className="input input-bordered w-full max-w-xs"
                            value={cost}
                            onChange={handleCostChange}
                        />
                        <label className="label">
                            <span className="label-text-alt badge !bg-yellow-400">
                                Cost
                            </span>
                        </label>
                    </div>

                    <div className="form-control w-full max-w-xs">
                        <input
                            type="text"
                            placeholder="0"
                            className="input input-bordered w-full max-w-xs"
                            value={stock}
                            onChange={handleStockChange}
                        />
                        <label className="label">
                            <span className="label-text-alt badge badge-neutral text-white">
                                Stock
                            </span>
                        </label>
                    </div>
                </div>

                <div className="flex items-center justify-end w-full pt-8 space-x-4">
                    <button className="btn btn-ghost" onClick={handleFormReset}>
                        Reset
                    </button>
                    <button
                        className="btn btn-ghost bg-mainOrange text-white !px-8 hover:bg-orange-600"
                        onClick={createProduct}
                    >
                        Create
                    </button>
                </div>

                {requestLoading ? (
                    <div className="self-center flex items-center justify-center space-x-4 py-8">
                        <Loading />
                        <h1>Creating product...</h1>
                    </div>
                ) : (
                    ""
                )}
            </form>
        </div>
    );
};

export default CreateProduct;
