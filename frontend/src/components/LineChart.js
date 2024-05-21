import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
const LineChart = ({ chartData, width }) => {
  const options = {
    plugins: {
      legend: {
        display: true,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        borderWidth: 2,
      },
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      },
    },
    scales: {
      x: {
        display: true,
      },
      y: {
        display: true,
      },
    },
  };

  return <Line data={chartData} options={options} width={width} />;
};

export default LineChart;
