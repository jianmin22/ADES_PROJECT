import React, { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Legend,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const COLORS = ["#fb7000", "#eb5000", "#fb8900", "#B0B0B0"];

function PopularProductsChart({ data }) {
    console.log(data);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        let chart_data = data.map((data) => {
            return {
                name: data.productName,
                value: data.sales,
            };
        });

        setChartData(chart_data);
    }, []);
    return (
        <div
            className="shadow-lg h-full w-full rounded-xl border p-4 flex flex-col items-center justify-center tooltip tooltip-top"
            data-tip="successful sales by product in the last 7 days"
        >
            <h1 className="text-xl font-bold text-[#666666]">
                Popular Products
            </h1>

            {data[0] == null || data.length === 1 ? (
                <div className="h-[500px] flex items-center justify-center">
                    <h1>No data to display...</h1>
                </div>
            ) : (
                <ResponsiveContainer
                    width="100%"
                    height={500}
                    className="h-full w-full"
                >
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={140}
                            fill="#FFFFFF"
                            label
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}

export default PopularProductsChart;
