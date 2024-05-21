import { useEffect, useState } from "react";
import noimage from "../../../../assets/noimage.png";
import Colors from "../../../Utilities/Colors";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import Loading from "../../../Utilities/Loading";
import ConfirmCancelModal from "../../../Modals/ConfirmCancelModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const ImageRow = ({
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
    const [filename, setFilename] = useState("");

    const retrieveImage = async () => {
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
        retrieveImage();
    }, []);

    const [file, setFile] = useState(null);
    const [previewUri, setPreviewUri] = useState(null);
    const handleImagePreview = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            setPreviewUri(URL.createObjectURL(file));
            setFilename(file.name);
        }
    };

    const [isUploadingFile, setIsUploadingFile] = useState(false);
    const handleImageUpload = async (e) => {
        try {
            e.preventDefault();
            setIsUploadingFile(true);

            if (previewUri) {
                const formData = new FormData();

                formData.append("image", file);

                const response = await axiosPrivate.post(
                    `product/${data.productId}/images/upload`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                if (response.data.success) {
                    setTimeout(() => {
                        retrieveImage();

                        setSuccessMessage(
                            `Successfully updated image for ${data.productName}`
                        );
                        setSuccessIsOpen(true);
                        setPreviewUri(null);
                        setFilename("");
                    }, 250);
                }
            }
        } catch (e) {
            console.log(e);
            setErrorMessage(e.response.data.message);
            setIsOpen(true);
        } finally {
            setIsUploadingFile(false);
        }
    };

    // Deleting images
    const [confirmationIsOpen, setConfirmationIsOpen] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState("");

    const [isDeleting, setIsDeleting] = useState(false);

    const onCancel = () => {
        setConfirmationIsOpen(false);
    };

    const handleImageDelete = () => {
        setConfirmationMessage(
            `Are you sure you want to delete ${data.productName} ?`
        );
        setConfirmationIsOpen(true);
    };

    const onConfirm = async () => {
        setConfirmationIsOpen(false);
        setIsDeleting(true);
        try {
            const response = await axiosPrivate.delete(
                `/product/${data.productId}/images/delete`
            );

            if (response.data.success) {
                setTimeout(() => {
                    retrieveData();
                    setSuccessMessage(
                        `Successfully managed to delete photos for ${data.productName}`
                    );
                    setSuccessIsOpen(true);
                }, 250);
            }
        } catch (e) {
            console.log(e);
            setErrorMessage(e.response.data.message);
            setIsOpen(true);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleResetFile = () => {
        setFile(null);
        setPreviewUri(null);
        setFilename("");
    };
    return (
        <tr>
            <td className="w-full h-full flex flex-col items-center">
                <div className="flex items-center justify-center">
                    <a
                        href={`${!imageUri ? noimage : imageUri}`}
                        target="_blank"
                        rel="noreferrer"
                        className="pb-4"
                    >
                        <img
                            src={
                                imageLoading ? (
                                    <Loading />
                                ) : !imageUri ? (
                                    noimage
                                ) : (
                                    imageUri
                                )
                            }
                            className="w-64 h-64 object-cover object-center hover:-translate-y-1 transition-all duration-500"
                        ></img>
                    </a>
                </div>
            </td>
            <td>
                <div className="flex items-center justify-center">
                    <h1 className="text-center">{data.productName}</h1>
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
                <div className="flex items-center justify-center flex-col space-y-4">
                    {!previewUri ? (
                        <h1>No image selected!</h1>
                    ) : (
                        <div className="relative w-64 h-64 ">
                            <a
                                href={`${previewUri}`}
                                target="_blank"
                                rel="noreferrer"
                                className="pb-4"
                            >
                                <img
                                    src={`${previewUri}`}
                                    className="w-64 h-64 object-cover object-center hover:-translate-y-1 hover:shadow-lg transition-all duration-500"
                                ></img>
                            </a>
                            <button
                                className="absolute top-1 right-1 animate-pulse"
                                onClick={handleResetFile}
                            >
                                <FontAwesomeIcon
                                    icon={faTimes}
                                    color="red"
                                    size="2x"
                                />
                            </button>
                        </div>
                    )}
                    <h1>{filename}</h1>
                    <button className="relative inline-flex w-max h-max">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImagePreview}
                            className="absolute left-0 top-0 opacity-0 w-full h-full cursor-pointer z-10"
                        />
                        <h1 className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 border border-gray-300 rounded-md shadow-sm ">
                            Choose File
                        </h1>
                    </button>
                </div>
            </td>
            <td>
                <div className="flex items-center justify-center">
                    {isUploadingFile ? (
                        <div className="flex w-full font-bold items-center justify-center">
                            <Loading />
                            <h1>Uploading Image...</h1>
                        </div>
                    ) : (
                        <button
                            className={`${
                                !isActive && !isInactive
                                    ? "bg-white text-yellow-500 border border-yellow-500"
                                    : "bg-gray-300 text-gray-700"
                            } font-bold  px-4 py-1 rounded-lg shadow-md tracking-wider  hover:px-6 hover:py-2 transition-all`}
                            onClick={handleImageUpload}
                            disabled={!isActive && !isInactive}
                        >
                            {!isActive && !isInactive ? "Sync Issue" : "Upload"}
                        </button>
                    )}
                </div>
            </td>
            <td>
                <div className="flex items-center justify-center">
                    {isDeleting ? (
                        <div className="flex w-full  items-center justify-center">
                            <Loading />
                            <h1>Deleting Image...</h1>
                        </div>
                    ) : (
                        <button
                            className="bg-red-600 text-white font-bold  px-4 py-1 rounded-lg tracking-wider hover:px-6 hover:py-2 transition-all"
                            onClick={handleImageDelete}
                        >
                            Delete Image
                        </button>
                    )}
                </div>

                <ConfirmCancelModal
                    confirmationIsOpen={confirmationIsOpen}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                    confirmationMessage={confirmationMessage}
                />
            </td>
        </tr>
    );
};
export default ImageRow;
