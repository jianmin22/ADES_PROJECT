import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import axios from "../api/axios";

const TransactionHistory = () => {
    const [reportData, setReportData] = useState([]);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const getCartItems = async () => {
            try {
                const response = await axios.get(`/transactionHistory/`);
                setCartItems(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        getCartItems();
    }, []);

    return (
        <div>
            <div id="scrollableDiv" className="overflow-hidden mb-8 lg:mb-0">
                {cartItems.map((item) => (
                    <div
                        className="bg-white flex items-center justify-between rounded-lg shadow-md border-300 border-white py-4 px-6 mx-4 lg:mx-20 my-2 lg:my-4"
                        key={item.transactionId}
                    >
                        <div>
                            <img
                                src={logo}
                                alt="item"
                                className="h-28 m-auto"
                            ></img>
                        </div>
                        <div className="flex-col">
                            <div>Name: {item.username}</div>
                            <div>Email: {item.email}</div>
                            <div
                                style={{
                                    color: (item.state = "success"
                                        ? "green"
                                        : "red"),
                                }}
                            >
                                State: {item.state}
                            </div>
                        </div>
                        <div className="flex-col">
                            <div>Date: {item.transactionDate.slice(0, 10)}</div>
                            <div>Amount: {parseFloat(item.totalAmount)}</div>
                            <div>
                                voucherID:{" "}
                                {item.voucherID == null
                                    ? "None"
                                    : item.voucherID}
                            </div>
                            <div>Points Earned: {item.pointsEarned}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransactionHistory;
