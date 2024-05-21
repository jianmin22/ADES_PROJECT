import React from "react";
import BarChart from "../BarChart";
const CompareModal = ({ isOpen, onClose, compareData1, compareData2 }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-white bg-opacity-50">
          <div className="m-12 my-32 p-16 bg-white rounded-lg shadow-md content-center justify-center flex flex-col">
            <h1 className="text-center text-3xl">Chart Compare</h1>
            <div className="flex justify-center pt-6 content-center">
              <div
                className="m-6 border-2 border-black"
                style={{
                  width: "40vw", // 3/5 = 60%
                  height: "50vh", // 3/5 = 60% of the viewport height
                }}
              >
                <p className="text-center">Chart 1</p>
                <BarChart chartData={compareData1} />
              </div>
              <div
                className="m-6 border-2 border-black"
                style={{
                  width: "40vw", // 3/5 = 60%
                  height: "50vh", // 3/5 = 60% of the viewport height
                }}
              >
                <p className="text-center">Chart 2</p>
                <BarChart chartData={compareData2} />
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={onClose}
                className="bg-orange-500 text-white font-bold py-2 px-4 rounded-full"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompareModal;
