import { useState } from "react";
import CreateProduct from "../components/ProductManagement/ManageProduct/CreateProduct";
import DeleteProduct from "../components/ProductManagement/ManageProduct/DeleteProduct";
import UpdateProduct from "../components/ProductManagement/ManageProduct/UpdateProduct";
import ManageImage from "../components/ProductManagement/ManageProduct/ManageImage";
import Tab from "../components/Announcements/subcomponents/Tab";
import TabItem from "../components/Announcements/subcomponents/TabItem";
const ProductManagement = () => {
    const [DisplayedPage, setDisplayedPage] = useState("Add Product");

    const handleChangeScreen = (screen) => {
        setDisplayedPage(screen);
    };
    return (
        <div className="flex flex-col justify-between px-8 w-full">
            <div className="w-full h-max py-4 flex flex-col items-center justify-center">
                <h1 className="text-2xl text-mainOrange font-bold">
                    Product Management
                </h1>
                <Tab>
                    <TabItem
                        current={DisplayedPage}
                        onClick={() => handleChangeScreen("Add Product")}
                        title="Add Product"
                    />
                    <TabItem
                        current={DisplayedPage}
                        onClick={() =>
                            handleChangeScreen("Update Product Details")
                        }
                        title="Update Product Details"
                    />
                    <TabItem
                        current={DisplayedPage}
                        onClick={() => handleChangeScreen("Delete/Archive")}
                        title="Delete/Archive"
                    />
                    <TabItem
                        current={DisplayedPage}
                        onClick={() => handleChangeScreen("Images")}
                        title="Images"
                    />
                </Tab>
            </div>
            <div className="w-full h-full flex justify-center">
                {DisplayedPage === "Add Product" ? (
                    <CreateProduct />
                ) : DisplayedPage === "Update Product Details" ? (
                    <UpdateProduct />
                ) : DisplayedPage === "Delete/Archive" ? (
                    <DeleteProduct />
                ) : (
                    <ManageImage />
                )}
            </div>
        </div>
    );
};

export default ProductManagement;
