import React from "react";

function TopCustomerRow({ data, index }) {
    return (
        <tr className="hover">
            <th>{index + 1}</th>
            <td className="overflow-hidden max-w-[275px] truncate">
                {data.Username}
            </td>
            <td>{data.TotalOrders}</td>
            <td>S$ {parseFloat(data.TotalSpent).toFixed(2)}</td>
            <td>{data.DateJoined}</td>
            <td>{data.LastTransaction}</td>
        </tr>
    );
}

export default TopCustomerRow;
