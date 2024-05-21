import { useEffect, useState } from "react";
import noimage from "../../../../assets/noimage.png";
import Colors from "../../../Utilities/Colors";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import Loading from "../../../Utilities/Loading";
import { Buffer } from "buffer";
import ConfirmCancelModal from "../../../Modals/ConfirmCancelModal";

const DeleteRow = ({
    isActive,
    isInactive,
    data,
    setSuccessIsOpen,
    setSuccessMessage,
    setIsOpen,
    setErrorMessage,
    retrieveData,
}) => {
    const axiosPrivate = useAxiosPrivate();
    const [imageLoading, setImageLoading] = useState(true);
    const [imageUri, setImageUri] = useState(null);

    const retrieve = async () => {
        try {
            setImageLoading(true);
            const response = await axiosPrivate.get(
                `/shop/products/${data.productId}/image`
            );

            if (response?.data?.uri) setImageUri(response.data.uri);
        } catch (e) {
            console.log(e);
            setImageUri(noimage);
        } finally {
            setImageLoading(false);
        }
    };

    useEffect(() => {
        retrieve();
    }, []);

    const [deleteConfirmationIsOpen, setDeleteConfirmationIsOpen] =
        useState(false);
    const [deleteConfirmationMessage, setDeleteConfirmationMessage] =
        useState("");

    const [archiveConfirmationIsOpen, setArchiveConfirmationIsOpen] =
        useState(false);
    const [archiveConfirmationMessage, setArchiveConfirmationMessage] =
        useState("");

    const [isDeleting, setIsDeleting] = useState(false);
    const [isArchiving, setIsArchiving] = useState(false);

    const onCancelDelete = () => {
        setDeleteConfirmationIsOpen(false);
    };

    const onCancelArchive = () => {
        setArchiveConfirmationIsOpen(false);
    };

    const handleDelete = () => {
        setDeleteConfirmationIsOpen(true);
        setDeleteConfirmationMessage(
            `Are you sure you want to delete ${data.productName} from products ?`
        );
    };

    const handleArchive = () => {
        setArchiveConfirmationIsOpen(true);
        setArchiveConfirmationMessage(
            `Are you sure you want to archive ${data.productName} from products ?`
        );
    };

    const onConfirmDelete = async () => {
        try {
            setDeleteConfirmationIsOpen(false);
            setIsDeleting(true);
            const hasDeleted = await axiosPrivate.delete(
                `/product/${data.productId}/delete`
            );

            if (hasDeleted.data.success) {
                retrieveData();
                setTimeout(() => {
                    setSuccessMessage(
                        `Successfully managed to delete Product ${data.productName}!`
                    );
                    setSuccessIsOpen(true);
                }, 250);
            }
        } catch (e) {
            console.log(e);
            setErrorMessage(e.response.data.message || e.message);
            setIsOpen(true);
        } finally {
            setIsDeleting(false);
        }
    };

    const onConfirmArchive = async () => {
        try {
            setArchiveConfirmationIsOpen(false);
            setIsArchiving(true);

            const response = await axiosPrivate.put(
                `/product/${data.productId}/stripe`,
                {
                    active: !isActive,
                }
            );

            if (response.data.success) {
                setTimeout(() => {
                    retrieveData();
                    setSuccessMessage(
                        `Successfully managed to archive ${data.productName} from products!`
                    );
                    setSuccessIsOpen(true);
                }, 250);
            }
        } catch (e) {
            console.log(e);
            setErrorMessage(e.response.data.message);
            setIsOpen(true);
        } finally {
            setIsArchiving(false);
        }
    };

    return (
        <tr>
            <td>
                <div>
                    <img
                        src={!imageUri ? noimage : imageUri}
                        className="w-48 h-48 object-cover object-center"
                    ></img>
                </div>
            </td>
            <td>
                <div className="flex items-center justify-center italic">
                    {data.productName}
                </div>
            </td>

            <td>
                <div className="flex items-center justify-center">
                    <h1
                        className="px-4 py-1 rounded-full text-center"
                        style={{
                            backgroundColor: Colors[data.categoryName],
                        }}
                    >
                        {data.categoryName}
                    </h1>
                </div>
            </td>
            <td>
                <div className="flex items-center justify-center">
                    {data.stock}
                </div>
            </td>
            <td>
                <div className="flex items-center justify-center">
                    {data.price}
                </div>
            </td>
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
                {isArchiving ? (
                    <div className="flex w-full items-center justify-center">
                        <Loading />
                        <h1>Archiving Product...</h1>
                    </div>
                ) : (
                    <div className="flex items-center justify-center">
                        <button
                            className={`${
                                !isActive && !isInactive
                                    ? "bg-white text-yellow-500 border border-yellow-500"
                                    : "bg-gray-300 text-gray-700"
                            } font-bold  px-4 py-1 rounded-lg shadow-md tracking-wider  hover:px-6 hover:py-2 transition-all`}
                            onClick={handleArchive}
                            disabled={!isActive && !isInactive}
                        >
                            {isActive
                                ? "Archive"
                                : isInactive
                                ? "Unarchive"
                                : "Sync Issue"}
                        </button>
                    </div>
                )}
            </td>
            <td className="text-center">
                {isDeleting ? (
                    <div className="flex w-full  items-center justify-center">
                        <Loading />
                        <h1>Deleting Product...</h1>
                    </div>
                ) : (
                    <button
                        className="bg-red-600 text-white font-bold  px-4 py-1 rounded-lg shadow-md tracking-wider  hover:px-6 hover:py-2 transition-all"
                        onClick={handleDelete}
                    >
                        Delete Product
                    </button>
                )}

                <ConfirmCancelModal
                    confirmationIsOpen={archiveConfirmationIsOpen}
                    onConfirm={onConfirmArchive}
                    onCancel={onCancelArchive}
                    confirmationMessage={archiveConfirmationMessage}
                />

                <ConfirmCancelModal
                    confirmationIsOpen={deleteConfirmationIsOpen}
                    onConfirm={onConfirmDelete}
                    onCancel={onCancelDelete}
                    confirmationMessage={deleteConfirmationMessage}
                />
            </td>
        </tr>
    );
};
export default DeleteRow;
