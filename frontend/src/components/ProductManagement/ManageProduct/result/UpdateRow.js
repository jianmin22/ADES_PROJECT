import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faXmark, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Loading from "../../../Utilities/Loading";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
const UpdateRow = ({
    isActive,
    isInactive,
    data,
    categories,
    setButtonDisabled,
    setSuccessIsOpen,
    setSuccessMessage,
    setIsOpen,
    setErrorMessage,
    handleForcedRefresh,
}) => {
    const axiosPrivate = useAxiosPrivate();
    const [isDisabled, setIsDisabled] = useState(true);

    const [name, setName] = useState(data.productName);
    const handleName = (e) => {
        setName(e.target.value);
    };

    const [description, setDescription] = useState(data.productDesc);
    const handleDescription = (e) => {
        setDescription(e.target.value);
    };

    const [category, setCategory] = useState(data.categoryName);
    const handleCategory = (e) => {
        setCategory(e.target.value);
    };

    const [price, setPrice] = useState(data.price);
    const handlePrice = (e) => {
        if (!isNaN(e.target.value)) setPrice(e.target.value);
    };

    const [cost, setCost] = useState(data.cost);
    const handleCost = (e) => {
        if (!isNaN(e.target.value)) setCost(e.target.value);
    };

    const [stock, setStock] = useState(data.stock);
    const handleStock = (e) => {
        if (!isNaN(e.target.value)) setStock(e.target.value);
    };

    const handleEdit = () => {
        setIsDisabled(false);
    };

    const handleCancelChanges = (e) => {
        if (e) e.preventDefault();
        setIsDisabled(true);

        setName(data.productName);
        setDescription(data.productDesc);
        setCategory(data.categoryName);
        setPrice(data.price);
        setCost(data.cost);
        setStock(data.stock);
    };

    const [updatingData, setUpdatingData] = useState(false);
    const handleEditSubmission = async (e) => {
        try {
            setButtonDisabled(true);
            setIsDisabled(true);
            setUpdatingData(true);
            const cat_id = categories.filter(
                (c) => c.categoryName === category
            );
            const updatedResult = await axiosPrivate.put(
                `/product/${data.productId}/`,
                {
                    name: name,
                    description: description,
                    category: cat_id[0].categoryId,
                    price: price,
                    cost: cost,
                    stock: stock,
                }
            );

            if (updatedResult.data.success) {
                setTimeout(() => {
                    handleForcedRefresh();
                    setSuccessMessage(
                        `Successfully managed to update details for ${name}`
                    );
                    setSuccessIsOpen(true);
                }, 250);
            }
            // const {name: name, description: description, category: category, price: price, cost: cost, stock: stock}
        } catch (e) {
            console.log(e);
            setErrorMessage(e.response.data.message);
            setIsOpen(true);
            handleCancelChanges();
        } finally {
            setUpdatingData(false);
            setButtonDisabled(false);
        }
    };

    return (
        <tr>
            <td>
                <div className="flex items-center justify-center">
                    <div className="flex items-center justify-center border border-black px-4 py-1 rounded-full border-opacity-20 shadow-md">
                        <button className="text-black rounded-full pr-2 w-max">
                            {isActive
                                ? "Active"
                                : isInactive
                                ? "Inactive"
                                : "Sync Issue"}
                        </button>

                        <span className="relative top-0 right-0 flex h-3 w-3">
                            <span
                                className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                                    isActive
                                        ? `bg-green-600 `
                                        : isInactive
                                        ? `bg-red-600`
                                        : `bg-yellow-500`
                                } opacity-75`}
                            ></span>
                            <span
                                className={`relative inline-flex rounded-full h-3 w-3 ${
                                    isActive
                                        ? `bg-green-600 `
                                        : isInactive
                                        ? `bg-red-600`
                                        : `bg-yellow-500`
                                }`}
                            ></span>
                        </span>
                    </div>
                </div>
            </td>
            <td>
                <div className="flex items-center justify-center  h-full w-full">
                    <input
                        onChange={handleName}
                        value={name}
                        disabled={isDisabled}
                        className={`${
                            isDisabled
                                ? ""
                                : "border border-black px-2 rounded-lg"
                        } w-full h-full text-center `}
                    />
                </div>
            </td>
            <td>
                <div className="flex items-center justify-center">
                    <textarea
                        onChange={handleDescription}
                        value={description}
                        disabled={isDisabled}
                        className={`${
                            isDisabled
                                ? ""
                                : "border border-black px-2 rounded-lg"
                        } h-full w-full`}
                    />
                </div>
            </td>
            <td>
                <div className="flex items-center justify-center h-full w-full">
                    <select
                        value={category}
                        className={`${
                            isDisabled
                                ? ""
                                : "border border-black px-2 rounded-lg"
                        } w-full h-full`}
                        disabled={isDisabled}
                        onChange={handleCategory}
                    >
                        {categories.map((c) => (
                            <option key={c.categoryId} value={c.categoryName}>
                                {c.categoryName}
                            </option>
                        ))}
                    </select>
                </div>
            </td>
            <td>
                <div className="flex items-center justify-center h-full w-full">
                    <input
                        onChange={handlePrice}
                        value={price}
                        disabled={isDisabled}
                        className={`${
                            isDisabled
                                ? ""
                                : "border border-black px-2 rounded-lg h-full w-full"
                        }  h-full w-full text-center`}
                    />
                </div>
            </td>
            <td>
                <div className="flex items-center justify-center h-full w-full">
                    <input
                        onChange={handleCost}
                        value={cost}
                        disabled={isDisabled}
                        className={`${
                            isDisabled
                                ? ""
                                : "border border-black px-2 rounded-lg h-full w-full"
                        } h-full w-full text-center`}
                    />
                </div>
            </td>
            <td>
                <div className="flex items-center justify-center h-full w-full">
                    <input
                        onChange={handleStock}
                        value={stock}
                        disabled={isDisabled}
                        className={`${
                            isDisabled
                                ? ""
                                : "border border-black px-2 rounded-lg h-full w-full"
                        } h-full w-full text-center`}
                    />
                </div>
            </td>
            <td className="flex justify-center items-center w-full h-full ">
                <div className="flex items-center justify-center">
                    {updatingData ? (
                        <Loading />
                    ) : isDisabled ? (
                        <button
                            className="hover:text-mainOrange transition-all text-2xl"
                            onClick={handleEdit}
                            disabled={!isActive && !isInactive}
                        >
                            {isActive || isInactive ? (
                                <FontAwesomeIcon icon={faEdit} />
                            ) : (
                                <h1 className="text-yellow-500 text-sm px-4 py-1 bg-white border border-yellow-500 rounded-lg shadow-lg">
                                    Sync Issue
                                </h1>
                            )}
                        </button>
                    ) : (
                        <div className="space-x-2 text-3xl">
                            <button onClick={handleCancelChanges}>
                                <FontAwesomeIcon icon={faXmark} color="red" />
                            </button>
                            <button onClick={handleEditSubmission}>
                                <FontAwesomeIcon icon={faCheck} color="green" />
                            </button>
                        </div>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default UpdateRow;
