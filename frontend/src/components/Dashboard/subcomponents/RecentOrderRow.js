import React from "react";

function RecentOrderRow({ transaction }) {
    return (
        <tr className="hover">
            <td>{transaction.transactionTime}</td>
            <td>{transaction.transactionId}</td>
            <td>S$ {parseFloat(transaction.totalAmount).toFixed(2)}</td>
            <td>
                <div className="flex items-center justify-center h-full capitalize">
                    <h1
                        className={`w-full badge text-white ${
                            transaction.state === "success"
                                ? "bg-green-600 "
                                : "bg-red-600 "
                        }`}
                    >
                        {transaction.state}
                    </h1>
                </div>
            </td>
        </tr>
    );
}

export default RecentOrderRow;
