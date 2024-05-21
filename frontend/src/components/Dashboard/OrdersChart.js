import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import {
    LineChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Line,
    ResponsiveContainer,
} from "recharts";

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: "bottom",
        },
        title: {
            display: true,
            text: "Orders (7 days)",
        },
    },
};

const labels = [];
const currentDate = new Date();

for (let i = 6; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - i);
    const singaporeDate = date
        .toLocaleString("en-SG", { timeZone: "Asia/Singapore" })
        .split(",")[0];
    labels.push(singaporeDate.split("/").reverse().join("-"));
}

function OrdersChart({ data }) {
    const [chartData, setChartData] = useState();
    
    useEffect(() => {
        let formatted_data = labels.map((date) => {

            return {
                name: date,
                Orders: !data[date] ? 0 : data[date],
            };
        });

        setChartData(formatted_data);
    }, []);
    return (
        <div
            className="w-full h-full shadow-lg rounded-xl border p-4 flex flex-col items-center justify-center tooltip tooltip-top"
            data-tip="successful orders in the past 7 days"
        >
            <h1 className="text-xl font-bold text-[#666666]">Orders</h1>
            <ResponsiveContainer width="100%" height={500} className="w-full h-[500px]">
                <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        interval={0}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend verticalAlign="top" align="right" height={36} />
                    <Line type="monotone" dataKey="Orders" stroke="#fb7000" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default OrdersChart;
