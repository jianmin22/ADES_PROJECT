import React, { useEffect, useState } from "react";
import noimage from "../assets/noimage.png";
import ErrorModal from "../components/Modals/ErrorModal";
import useAuth from "../hooks/useAuth.js";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function UserTransactionHistoryDelivering() {
  const { auth } = useAuth();
  const userId = auth.userId;
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [transactionFetched, setTransactionFetched] = useState(false);

  const handleErrorModalOk = () => {
    if (redirectToLogin) {
      navigate("/Login");
    }
    setErrorModalOpen(false);
  };

  const handleDelivered = async (deliveryId) => {
    try {
      if (deliveryId) {
        const status = "Success";
        await axiosPrivate.put(
          `/delivery/updateDeliveryStatus/${deliveryId}/${status}`
        );

        fetchTransactionHistoryState();
      } else {
        setErrorMessage("Error. Please refresh this page.");
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Error. Please refresh this page.");
      setErrorModalOpen(true);
    }
  };

  const fetchTransactionHistoryState = async () => {
    try {
      if (userId) {
        const status = "Delivering";
        const response = await axiosPrivate.get(
          `/transactionHistory/${userId}/${currentPage}/${status}`
        );
        const { transactionHistory, totalPages } = response.data;
        const sortedHistory = transactionHistory.sort(
          (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
        );
        const transactionItems = await Promise.all(
          sortedHistory.map(async (transaction) => {
            return {
              ...transaction,
              items: await Promise.all(
                transaction.items.map(async (item) => {
                  const imageURL = await axiosPrivate.get(
                    `/shop/products/${item.productId}/image`
                  );
                  return {
                    ...item,
                    image: imageURL.data,
                  };
                })
              ),
            };
          })
        );
        console.log(transactionItems);
        setTotalPages(totalPages);
        setTransactionHistory(transactionItems);
        setTransactionFetched(true);
      } else {
        setErrorMessage("Please Login to perform this action.");
        setRedirectToLogin(true);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        if (error.message === "Invalid userId parameter") {
          setErrorMessage("Please Login to perform this action.");
          setRedirectToLogin(true);
          setErrorModalOpen(true);
        } else {
          setErrorMessage("Error. Please refresh this page.");
          setErrorModalOpen(true);
        }
      } else if (error.response && error.response.status === 500) {
        setErrorMessage("Error. Please refresh this page.");
        setErrorModalOpen(true);
      }
    }
  };

  useEffect(() => {
    fetchTransactionHistoryState();
  }, [userId, currentPage]);

  useEffect(() => {
    const handleScrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    handleScrollToTop();
  }, [currentPage]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <div>
      {transactionHistory.length === 0
        ? transactionFetched && (
            <div className="h-screen flex flex-col justify-center items-center bg-orange-100">
              <h1 className="text-3xl font-bold mb-5">
                No delivering transaction History
              </h1>
              <Link to="/shop/search">
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded">
                  Go to Shop
                </button>
              </Link>
            </div>
          )
        : transactionFetched && (
            <div className="bg-orange-300 min-h-screen">
              <h1 className="text-3xl font-bold mx-10 mb-5 pt-5">
                Your Delivering Transaction History
              </h1>
              {transactionHistory.map((transaction) => (
                <div
                  key={transaction.transactionId}
                  className={`p-6 mb-6 mx-10 bg-white`}
                >
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-400">
                    <Link
                      to={`/userTransactionReceiptPage/${transaction.transactionId}`}
                    >
                      <h2 className="text-sm cursor-pointer text-blue-400 hover:text-blue-600 underline">
                        Print Receipt
                      </h2>
                    </Link>
                    <div className="flex items-center">
                      <p className="text-gray-600">
                        Date:{" "}
                        {new Date(
                          transaction.transactionDate
                        ).toLocaleDateString('en-GB')}
                      </p>
                      <div className="text-orange-400 py-1 px-2 rounded mr-2">
                        Delivering
                      </div>
                    </div>
                  </div>
                  {transaction.items.map((item) => (
                    <div
                      key={item.transactionItemId}
                      className="flex items-center mb-4 pb-2 border-b border-gray-300"
                    >
                      <Link to={`/shop/${item.productId}`}>
                        <img
                          src={
                            item.image && item.image.uri
                              ? item.image.uri
                              : noimage
                          }
                          className="w-24 h-24 object-fit-contain mr-4"
                        />
                      </Link>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col">
                          <Link to={`/shop/${item.productId}`}>
                            <p className="font-bold px-4">{item.productName}</p>
                          </Link>
                          <p className="flex-grow break-all px-4">
                            {item.productDesc}
                          </p>
                          <p className="px-4">
                            ${parseFloat(item.price).toFixed(2)}
                          </p>
                          <p className="px-4">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <p>
                        Total Amount Paid:{" "}
                        {parseFloat(transaction.totalAmount).toFixed(2)}
                      </p>
                      <p>Points Earned: {transaction.pointsEarned}</p>
                      <p>
                        Voucher:{" "}
                        {transaction.voucherName
                          ? transaction.voucherName
                          : "No Voucher Applied"}
                      </p>
                    </div>
                    <button
                      className="flex-shrink-0 bg-orange-500 text-white py-2 px-4 rounded"
                      onClick={() => handleDelivered(transaction.deliveryId)}
                    >
                      Received
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex flex-row justify-center pb-8">
                <div className="flex items-center">
                  <button
                    disabled={currentPage === 1}
                    onClick={handlePrevPage}
                    className="shadow-lg w-full px-4 py-2 text-sm font-medium text-mainOrange border-r bg-white border-0 border-slate-400 rounded-l hover:bg-mainOrange hover:text-white transition-all"
                  >
                    <span className="ml-1">Previous</span>
                  </button>
                  <div className="flex-shrink-0 inline-flex items-center text-mainOrange px-4 py-2 mx-1 rounded text-sm text-black font-bold border border-mainOrange bg-white shadow-lg">
                    {`Page ${currentPage} of ${totalPages}`}
                  </div>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={handleNextPage}
                    className="shadow-lg w-full px-4 py-2 text-sm font-medium text-mainOrange border-r bg-white border-0 border-slate-400 rounded-l hover:bg-mainOrange hover:text-white transition-all"
                  >
                    <span>Next</span>
                  </button>
                </div>
              </div>
            </div>
          )}
      <ErrorModal
        isOpen={errorModalOpen}
        onRequestClose={handleErrorModalOk}
        errorMessage={errorMessage}
      />
    </div>
  );
}
export default UserTransactionHistoryDelivering;
