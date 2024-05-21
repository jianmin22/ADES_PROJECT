import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LineChart from "../LineChart";
import BarChart from "../BarChart";
const DatePickerModal = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportData, setReportData] = useState([]);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      const formattedStartDate = formatDate(start);
      const formattedEndDate = formatDate(end);
      getWeeklyReportData(formattedStartDate, formattedEndDate);
    }
  };

  const getWeeklyReportData = async (startDate, endDate) => {
    try {
      const response = await axios.get(
        `/report/dailyReportRange/${startDate}/${endDate}`
      );
      setReportData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (date) => {
    if (!date) return ""; // Handle the case when date is null
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const WeeklySalesData = {
    labels: reportData.map((data) => data.Singapore_Time.slice(0, 10)),
    datasets: [
      {
        label: "Cost Per Day",
        data: reportData.map((data) => data.cost_of_goods_sold),
        backgroundColor: ["red"],
        borderColor: "red",
        borderWidth: 4,
      },
      {
        label: "Sales Per Day",
        data: reportData.map((data) => data.totalSales),
        backgroundColor: ["blue"],
        borderColor: "blue",
        borderWidth: 4,
      },
      {
        label: "Order Per Day",
        data: reportData.map((data) => data.totalProductSales),
        backgroundColor: ["purple"],
        borderColor: "purple",
        borderWidth: 4,
      },
      {
        label: "Profit Per Day",
        data: reportData.map((data) => data.gross_profit),
        backgroundColor: ["green"],
        borderColor: "green",
        borderWidth: 4,
      },
    ],
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div>
        <h1>Select Date Range:</h1>
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange={true}
          withPortal
        />
      </div>
      {startDate && endDate && (
        <>
          <p>
            Selected Date Range: {formatDate(startDate)} - {formatDate(endDate)}
          </p>
          <div
            className="bg-white border-black border-2 rounded-lg w-3/5 h-3/5"
            style={{
              width: "60%", // 3/5 = 60%
              height: "60vh", // 3/5 = 60% of the viewport height
            }}
          >
            <BarChart chartData={WeeklySalesData} width={300} />
          </div>
        </>
      )}
    </div>
  );
};

export default DatePickerModal;
