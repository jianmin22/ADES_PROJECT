import React from "react";
import TopCustomerRow from "./subcomponents/TopCustomerRow";

function TopCustomers({ data }) {
    let customers = !data?.length ? [] : data;
    console.log(customers);
    return (
        <div className="shadow-lg h-full w-full rounded-xl border p-4 flex flex-col items-center justify-start">
            <h1 className="text-xl font-bold text-[#666666] self-center">
                Top Customers
            </h1>
            {data.length === 0 ? (
                <div className="flex items-center justify-center h-full w-full">
                    <h1>No data to display...</h1>
                </div>
            ) : (
                <div className="overflow-x-auto max-h-96 w-full">
                    <table className="table table-pin-rows">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Username</th>
                                <th>Transactions</th>
                                <th>Total Spent</th>
                                <th className="hidden xl:block">Date Joined</th>
                                <th>Last Transaction</th>
                            </tr>
                        </thead>
                        <tbody>
                           {customers.map((customer, index) => <TopCustomerRow key={customer.Username} data={customer} index={index}/>)}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default TopCustomers;
