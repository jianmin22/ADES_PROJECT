import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import BarChart from "../components/BarChart";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ErrorModal from "../components/Modals/ErrorModal";
import SuccessModal from "../components/Modals/SuccessModal";
import CompareModal from "../components/Modals/CompareModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";
import { faCalculator } from "@fortawesome/free-solid-svg-icons";
import { faSackDollar } from "@fortawesome/free-solid-svg-icons";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import CustomArrow from "../components/AliceCarouselArrow";
const Report = () => {
  const axiosPrivate = useAxiosPrivate();

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  const lastWeekdays = new Date();
  lastWeekdays.setDate(lastWeekdays.getDate() - 6);

  const yearForLastWeek = lastWeekdays.getFullYear();
  const monthForLastWeek = String(lastWeekdays.getMonth() + 1).padStart(2, "0");
  const dayForLastWeek = String(lastWeekdays.getDate()).padStart(2, "0");
  const formattedLastWeekDate = `${yearForLastWeek}-${monthForLastWeek}-${dayForLastWeek}`;

  const [weeklyReportData, setWeeklyReportData] = useState([]);
  const [todayReport, setTodayReport] = useState([]);
  const [weekTop3, setWeekTop3] = useState([]);
  const [data, setData] = useState(null);
  const [isGenerateTodayReport, setIsGenerateTodayReport] = useState(false);
  const [isGenerateTodayReportBtn, setIsGenerateTodayReportBtn] =
    useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [formattedStartDate, setFormattedStartDate] = useState(null);
  const [formattedEndDate, setFormattedEndDate] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formattedSelectedDate, setFormattedSelectedDate] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [currentReportIndex, setCurrentReportIndex] = useState(1);
  const [dateRangeSelected, setDateRangeSelected] = useState(false);
  const [rangeReportData, setRangeReportData] = useState([]);
  const [rangeTop3, setRangeTop3] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareReport1, setCompareReport1] = useState(null);
  const [compareReport2, setCompareReport2] = useState(null);
  const getAllData = () => {
    getWeeklyReportData();
    getTodayReportData();
    getWeeklyTop3Data();
  };
  const renderPrevButton = ({ isDisabled }) => (
    <button
      type="button"
      disabled={isDisabled}
      className="alice-carousel__prev-btn"
    >
      Prev
    </button>
  );
  const renderNextButton = ({ isDisabled }) => (
    <button
      type="button"
      disabled={isDisabled}
      className="alice-carousel__next-btn"
    >
      Next
    </button>
  );
  const getTodayReportData = async () => {
    try {
      const response2 = await axiosPrivate.get(
        `/report/daily_sales_report/${formattedDate}`
      );
      if (response2.data.length > 0) {
        setIsGenerateTodayReportBtn(false);
        setIsGenerateTodayReport(true);
      }
      setTodayReport(response2.data);
    } catch (error) {
      console.error(error);
    }
  };
  const GenerateReportData = async () => {
    try {
      if (formattedSelectedDate == null) {
        setIsErrorModalOpen(true);
        setErrorMessage("Please select a date first");
        return;
      }
      const response = await axiosPrivate.post(
        `/report/insertReport/${formattedSelectedDate}`
      );
      console.log(response.data.message);
      if (response.data.message === "Report exists") {
        setIsSuccessModalOpen(true);
        setSuccessMessage(response.data.message);
      } else {
        setData(response.data);
        setIsGenerateTodayReportBtn(false);
        setIsSuccessModalOpen(true);
        setSuccessMessage(response.data.message);
        getAllData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getWeeklyReportData = async () => {
    try {
      const response = await axiosPrivate.get(
        `/report/dailyReportRange/${formattedLastWeekDate}/${formattedDate}`
      );
      console.log(formattedLastWeekDate);
      setWeeklyReportData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const getWeeklyTop3Data = async () => {
    try {
      const response = await axiosPrivate.get(
        `/report/top3SellingProductByRange/${formattedLastWeekDate}/${formattedDate}`
      );
      console.log(formattedLastWeekDate);
      setWeekTop3(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllData();
  }, []);

  const postData = async () => {
    try {
      const response = await axiosPrivate.post(
        `/report/insertReport/${formattedDate}`
      );
      if (response.data.message === "Report exists") {
        setIsSuccessModalOpen(true);
        setSuccessMessage(response.data.message);
      } else {
        setData(response.data);
        setIsGenerateTodayReportBtn(false);
        setIsSuccessModalOpen(true);
        setSuccessMessage(response.data.message);
        getAllData();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const updateSalesReportData = async (event) => {
    event.preventDefault();
    if (formattedSelectedDate == null) {
      setIsErrorModalOpen(true);
      setErrorMessage("Please select a date first");
      return;
    }
    try {
      const response = await axiosPrivate.put(
        `/report/updateDailyReport/${formattedSelectedDate}`
      );

      if (
        response.data.message === "no report to update" ||
        response.data.message === "no repeated data"
      ) {
        setIsSuccessModalOpen(true);
        setSuccessMessage(response.data.message);
      } else {
        setIsSuccessModalOpen(true);
        setSuccessMessage("report update successful");
        getAllData();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const deleteReportData = async (event) => {
    event.preventDefault();
    if (formattedSelectedDate == null) {
      setIsErrorModalOpen(true);
      setErrorMessage("Please select a date first");
      return;
    }
    try {
      const response = await axiosPrivate.delete(
        `/report/deleteDailyReport/${formattedSelectedDate}`
      );
      if (formattedSelectedDate === formattedDate) {
        setIsGenerateTodayReportBtn(true);
      }
      if (response.data.message === "No report to delete") {
        setIsSuccessModalOpen(true);
        setSuccessMessage(response.data.message);
      } else {
        setIsSuccessModalOpen(true);
        setSuccessMessage(response.data.message);
        getAllData();
      }
    } catch (error) {
      // Handle error response from the server
      setIsErrorModalOpen(true);
      setErrorMessage(error.response.data.message);
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
  const handleDateRangeChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    setFormattedStartDate(formatDate(start));
    setFormattedEndDate(formatDate(end));
    if (start && end) {
      const formattedStartDate = formatDate(start);
      const formattedEndDate = formatDate(end);
      setDateRangeSelected(true); // Set to true when a date range is selected
      getReportDataByRange(formattedStartDate, formattedEndDate);
      getTop3DataByRange(formattedStartDate, formattedEndDate);
    } else {
      setDateRangeSelected(false); // Set to false when the date range is cleared
    }
  };

  const getReportDataByRange = async (startDate, endDate) => {
    try {
      const response = await axiosPrivate.get(
        `/report/dailyReportRange/${startDate}/${endDate}`
      );
      console.log(startDate, "to", endDate, response.data);
      setRangeReportData(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const getTop3DataByRange = async (startDate, endDate) => {
    try {
      const response = await axiosPrivate.get(
        `/report/top3SellingProductByRange/${startDate}/${endDate}`
      );
      setRangeTop3(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setFormattedSelectedDate(formatDate(date));
  };
  const compareReport = () => {
    if (compareReport1 == null || compareReport2 == null) {
      setErrorMessage("Please select 2 report to compare");
      setIsErrorModalOpen(true);
      return;
    } else {
      setIsCompareOpen(true);
    }
  };
  const clearCompareReport = () => {
    setCompareReport1(null);
    setCompareReport2(null);
    setSuccessMessage("Clear successful");
    setIsSuccessModalOpen(true);
  };
  const saveCompareData = (data) => {
    if (currentReportIndex === 1) {
      setSuccessMessage("Save for report 1 success");
      setIsSuccessModalOpen(true);
      setCompareReport1(data);
      setCurrentReportIndex(2);
    } else if (currentReportIndex === 2) {
      setSuccessMessage("Save for report 2 success");
      setIsSuccessModalOpen(true);
      setCompareReport2(data);
      setCurrentReportIndex(1);
    }
  };

  const WeeklySalesData = {
    labels: weeklyReportData.map((data) => data.Singapore_Time.slice(0, 10)),
    datasets: [
      {
        label: "Sales Per Day",
        data: weeklyReportData.map((data) => data.totalSales),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  };
  const WeeklyProductSalesData = {
    labels: weeklyReportData.map((data) => data.Singapore_Time.slice(0, 10)),
    datasets: [
      {
        label: "Product Sales Per Day",
        data: weeklyReportData.map((data) => data.totalProductSales),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  };
  const WeeklyCostData = {
    labels: weeklyReportData.map((data) => data.Singapore_Time.slice(0, 10)),
    datasets: [
      {
        label: "Cost Per Day",
        data: weeklyReportData.map((data) => data.cost_of_goods_sold),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  };
  const WeeklyProfitData = {
    labels: weeklyReportData.map((data) => data.Singapore_Time.slice(0, 10)),
    datasets: [
      {
        label: "Gross Profit Per Day",
        data: weeklyReportData.map((data) => data.gross_profit),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  };
  const WeeklyTop3Data = {
    labels: weekTop3.map((data) => data.productName),
    datasets: [
      {
        label: "Quantity",
        data: weekTop3.map((data) => data.totalQuantity),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  };
  const RangeSalesData = {
    labels: rangeReportData.map((data) => data.Singapore_Time.slice(0, 10)),
    datasets: [
      {
        label: "Sales Per Day",
        data: rangeReportData.map((data) => data.totalSales),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  };
  const RangeProductSalesData = {
    labels: rangeReportData.map((data) => data.Singapore_Time.slice(0, 10)),
    datasets: [
      {
        label: "Product Sales Per Day",
        data: rangeReportData.map((data) => data.totalProductSales),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  };
  const RangeCostData = {
    labels: rangeReportData.map((data) => data.Singapore_Time.slice(0, 10)),
    datasets: [
      {
        label: "Cost Per Day",
        data: rangeReportData.map((data) => data.cost_of_goods_sold),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  };
  const RangeProfitData = {
    labels: rangeReportData.map((data) => data.Singapore_Time.slice(0, 10)),
    datasets: [
      {
        label: "Gross Profit Per Day",
        data: rangeReportData.map((data) => data.gross_profit),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  };
  const RangeTop3Data = {
    labels: rangeTop3.map((data) => data.productName),
    datasets: [
      {
        label: "Quantity",
        data: rangeTop3.map((data) => data.totalQuantity),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  };
  const chartData1 = [
    <div>
      <div className="justify-end flex mb-3">
        <button
          type="button"
          onClick={() => saveCompareData(WeeklySalesData)}
          class=" px-4 py-2 bg-mainOrange text-white rounded-full"
        >
          Save for compare
        </button>
      </div>
      <div className="border-2 border-black flex justify-center rounded-lg">
        <h1 className="text-center bold text-2xl p-6 items-center">
          Weekly Sales data
        </h1>
      </div>
      <BarChart key="1" chartData={WeeklySalesData} />
    </div>,
    <div>
      <div className="justify-end flex mb-3">
        <button
          type="button"
          onClick={() => saveCompareData(WeeklyProductSalesData)}
          class=" px-4 py-2 bg-mainOrange text-white rounded-full"
        >
          Save for compare
        </button>
      </div>
      <div className="border-2 border-black flex justify-center rounded-lg">
        <h1 className="text-center bold text-2xl p-6 items-center">
          Weekly Product Sales data
        </h1>
      </div>
      <BarChart key="2" chartData={WeeklyProductSalesData} />
    </div>,
    <div>
      <div className="justify-end flex mb-3">
        <button
          type="button"
          onClick={() => saveCompareData(WeeklyCostData)}
          class=" px-4 py-2 bg-mainOrange text-white rounded-full"
        >
          Save for compare
        </button>
      </div>
      <div className="border-2 border-black flex justify-center rounded-lg">
        <h1 className="text-center bold text-2xl p-6 items-center">
          Weekly Cost data
        </h1>
      </div>
      <BarChart key="3" chartData={WeeklyCostData} />
    </div>,
    <div>
      <div className="justify-end flex mb-3">
        <button
          type="button"
          onClick={() => saveCompareData(WeeklyProfitData)}
          class=" px-4 py-2 bg-mainOrange text-white rounded-full"
        >
          Save for compare
        </button>
      </div>

      <div className="border-2 border-black flex justify-center rounded-lg">
        <h1 className="text-center bold text-2xl p-6 items-center">
          Weekly Profit data
        </h1>
      </div>

      <BarChart key="4" chartData={WeeklyProfitData} />
    </div>,
    <div>
      <div className="justify-end flex mb-3">
        <button
          type="button"
          onClick={() => saveCompareData(WeeklyTop3Data)}
          class=" px-4 py-2 bg-mainOrange text-white rounded-full"
        >
          Save for compare
        </button>
      </div>
      <div className="border-2 border-black flex justify-center rounded-lg">
        <h1 className="text-center bold text-2xl p-6 items-center">
          Weekly Top 3 Selling Products
        </h1>
      </div>

      <BarChart key="5" chartData={WeeklyTop3Data} />
    </div>,
  ];
  const chartData2 = [
    <div>
      <div className="justify-end flex mb-3">
        <button
          type="button"
          onClick={() => saveCompareData(RangeSalesData)}
          class=" px-4 py-2 bg-mainOrange text-white rounded-full"
        >
          Save for compare
        </button>
      </div>
      <div className="border-2 border-black flex justify-center rounded-lg">
        <h1 className="text-center bold text-2xl p-6 items-center">
          Sales data
        </h1>
      </div>
      <BarChart key="1" chartData={RangeSalesData} />
    </div>,
    <div>
      <div className="justify-end flex mb-3">
        <button
          type="button"
          onClick={() => saveCompareData(RangeProductSalesData)}
          class=" px-4 py-2 bg-mainOrange text-white rounded-full"
        >
          Save for compare
        </button>
      </div>

      <div className="border-2 border-black flex justify-center rounded-lg">
        <h1 className="text-center bold text-2xl p-6 items-center">
          Products Sales data
        </h1>
      </div>
      <BarChart key="2" chartData={RangeProductSalesData} />
    </div>,
    <div>
      <div className="justify-end flex mb-3">
        <button
          type="button"
          onClick={() => saveCompareData(RangeCostData)}
          class=" px-4 py-2 bg-mainOrange text-white rounded-full"
        >
          Save for compare
        </button>
      </div>
      <div className="border-2 border-black flex justify-center rounded-lg">
        <h1 className="text-center bold text-2xl p-6 items-center">
          Cost data
        </h1>
      </div>
      <BarChart key="3" chartData={RangeCostData} />
    </div>,
    <div>
      <div className="justify-end flex mb-3">
        <button
          type="button"
          onClick={() => saveCompareData(RangeProfitData)}
          class=" px-4 py-2 bg-mainOrange text-white rounded-full"
        >
          Save for compare
        </button>
      </div>
      <div className="border-2 border-black flex justify-center rounded-lg">
        <h1 className="text-center bold text-2xl p-6 items-center">
          profit data
        </h1>
      </div>
      <BarChart key="4" chartData={RangeProfitData} />
    </div>,
    <div>
      <div className="justify-end flex mb-3">
        <button
          type="button"
          onClick={() => saveCompareData(RangeTop3Data)}
          class=" px-4 py-2 bg-mainOrange text-white rounded-full"
        >
          Save for compare
        </button>
      </div>
      <div className="border-2 border-black flex justify-center rounded-lg">
        <h1 className="text-center bold text-2xl p-6 items-center">
          Top 3 selling product
        </h1>
      </div>

      <BarChart key="5" chartData={RangeTop3Data} />
    </div>,
  ];

  return (
    <div className="bg-orange-200 w-full w-3/4">
      {isErrorModalOpen ? (
        <ErrorModal
          isOpen={true}
          onRequestClose={() => setIsErrorModalOpen(false)}
          errorMessage={errorMessage}
        />
      ) : null}
      {isSuccessModalOpen ? (
        <SuccessModal
          successIsOpen={true} // Set successIsOpen to true or false based on your logic
          onSuccessClose={() => setIsSuccessModalOpen(false)} // Pass a function to handle modal close
          successMessage={successMessage} // Set the success message you want to display
        />
      ) : null}
      {isCompareOpen ? (
        <CompareModal
          isOpen={true}
          onClose={() => setIsCompareOpen(false)}
          compareData1={compareReport1}
          compareData2={compareReport2}
        ></CompareModal>
      ) : null}
      <div className="border-2 border-black m-12 rounded-lg bg-orange-300">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 p-6">
          Sales Dashboard
        </h1>
        <div className="flex justify-start mx-6 border-2">
          <div className="flex justify-center items-center my-2">
            <FontAwesomeIcon icon={faCalendar} className="h-6 m-3" />
            <DatePicker
              className="p-2"
              selected={selectedDate}
              onChange={handleDateChange}
              isClearable
              withPortal
              placeholderText="Select a date"
            />
          </div>

          <div class="flex justify-center items-center">
            <button
              type="button"
              onClick={updateSalesReportData}
              class="px-4 py-2 bg-mainOrange text-white mx-3 rounded-full"
            >
              Refresh Report
            </button>
            <button
              type="button"
              onClick={deleteReportData}
              class="px-4 py-2 bg-mainOrange text-white mx-3 rounded-full"
            >
              Remove Report
            </button>
            <button
              type="button"
              onClick={GenerateReportData}
              class="px-4 py-2 bg-mainOrange text-white mx-3 rounded-full"
            >
              Generate Report
            </button>
          </div>
        </div>
        <div className="flex justify-start mx-6 border-2 mt-6">
          <div className="flex justify-center items-center my-2">
            <FontAwesomeIcon icon={faCalendar} className="h-6 m-3" />
            <DatePicker
              className="p-2"
              selected={startDate}
              onChange={handleDateRangeChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange={true}
              withPortal
              placeholderText="Select range for report"
              isClearable
            />
          </div>
          <div class="flex justify-center items-center">
            <button
              type="button"
              onClick={compareReport}
              class="px-4 py-2 bg-mainOrange text-white mx-3 rounded-full"
            >
              Compare Report
            </button>
            <button
              type="button"
              onClick={clearCompareReport}
              class="px-4 py-2 bg-mainOrange text-white mx-3 rounded-full"
            >
              Clear Compare Report
            </button>
          </div>
        </div>
        {isGenerateTodayReport
          ? todayReport.map((data) => (
              <div key={data.report_id} className="grid grid-cols-4 gap-4 m-6">
                <div class="grid grid-rows-3 rounded-lg border-2 border-black bg-orange-500 p-6">
                  <div class="flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faChartLine}
                      class="text-white h-6 m-3"
                    />
                    <p class="text-white font-bold ml-2">Total Sales:</p>
                  </div>
                  <div class="grid place-items-center">
                    <p class="text-white text-7xl">${data.totalSales}</p>
                  </div>
                </div>

                <div class="grid grid-rows-3 rounded-lg border-2 border-black bg-orange-500 p-6">
                  <div class="flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faFileInvoiceDollar}
                      class="text-white h-6 m-3"
                    />
                    <div class="text-white font-bold">Product Sales:</div>
                  </div>
                  <div class="grid place-items-center">
                    <p class="text-white text-7xl">{data.totalProductSales}</p>
                  </div>
                </div>
                <div class="grid grid-rows-3 rounded-lg border-2 border-black bg-orange-500 p-6">
                  <div class="flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faCalculator}
                      class="text-white h-6 m-3"
                    />
                    <div class="text-white font-bold">Cost:</div>
                  </div>
                  <div class="grid place-items-center">
                    <p class="text-rose-600 text-7xl">
                      {data.cost_of_goods_sold}
                    </p>
                  </div>
                </div>
                <div class="grid grid-rows-3 rounded-lg border-2 border-black bg-orange-500 p-6">
                  <div class="flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faSackDollar}
                      class="text-white h-6 m-3"
                    />
                    <div class="text-white font-bold">Profit:</div>
                  </div>
                  <div class="grid place-items-center">
                    <p class="text-emerald-600 text-7xl">{data.gross_profit}</p>
                  </div>
                </div>
              </div>
            ))
          : null}

        <div className="flex justify-center m-6">
          {isGenerateTodayReportBtn ? (
            <button
              type="button"
              onClick={postData}
              class="px-4 py-2 bg-mainOrange text-white mx-3 rounded-full"
            >
              Generate Today Report
            </button>
          ) : null}
        </div>

        {dateRangeSelected ? (
          <div className="mx-64 my-16 p-16 bg-white border-black border-2 rounded-lg">
            <AliceCarousel
              mouseTracking
              items={chartData2}
              renderPrevButton={({ isDisabled }) => (
                <CustomArrow onClick={() => {}} arrowType="prev" />
              )}
              renderNextButton={({ isDisabled }) => (
                <CustomArrow onClick={() => {}} arrowType="next" />
              )}
            />
          </div>
        ) : (
          <div className="mx-64 my-16 p-16 bg-white border-black border-2 rounded-lg">
            <div>
              <AliceCarousel
                mouseTracking
                items={chartData1}
                renderPrevButton={({ isDisabled }) => (
                  <CustomArrow onClick={() => {}} arrowType="prev" />
                )}
                renderNextButton={({ isDisabled }) => (
                  <CustomArrow onClick={() => {}} arrowType="next" />
                )}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;
