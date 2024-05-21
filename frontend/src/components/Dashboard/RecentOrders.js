import React from "react";
import RecentOrderRow from "./subcomponents/RecentOrderRow";
function RecentOrders({ data }) {
    let recents = !data?.length ? [] : data;
    return (
        <div className="shadow-lg h-full w-full rounded-xl border p-4 flex flex-col items-start justify-center tooltip tooltip-top" data-tip="latest 15 orders">
            <h1 className="text-xl font-bold text-[#666666] self-center">
                Recent Orders
            </h1>
            {recents.length === 0 ? (
                <div className="flex items-center justify-center h-96 w-full">
                    <h1>No data to display...</h1>
                </div>
            ) : (
                <div className="overflow-x-auto max-h-96 w-full">
                    <table className="table table-pin-rows">
                        <thead>
                            <tr>
                                <th>Transaction Time</th>
                                <th>Transaction ID</th>
                                <th>Total Amount</th>
                                <th>State</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recents.map((transaction) => (
                                <RecentOrderRow
                                    key={transaction.transactionId}
                                    transaction={transaction}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default RecentOrders;
