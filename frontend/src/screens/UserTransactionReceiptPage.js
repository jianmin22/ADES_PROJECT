import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useReactToPrint } from "react-to-print";
import ErrorModal from "../components/Modals/ErrorModal";
import NotificationModal from "../components/Modals/NotificationModal";
import useAuth from "../hooks/useAuth.js";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

const UserTransactionReceiptPage = () => {
  const { auth } = useAuth();
  const userId = auth.userId;
  const printRef = useRef();
  const { transactionId } = useParams();
  const [transactionHistory, setTransactionHistory] = useState({});
  const navigate = useNavigate();
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [notificationModal, setNotificationModal] = useState(false);
  const [notificationModalMessage, setNotificationModalMessage] = useState("");
  const [transactionFetched, setTransactionFetched] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(4);
  const [discount, setDiscount] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [voucherID, setVoucherID] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);

  const handleErrorModalOk = () => {
    if (redirectToLogin) {
      navigate("/Login");
    }
    setErrorModalOpen(false);
  };
  const handleNotificationModalOk = () => {
    setNotificationModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) {
          setErrorMessage("Please Login to perform this action.");
          setRedirectToLogin(true);
          setErrorModalOpen(true);
          return;
        }

        if (transactionId) {
          const transactionResponse = await axiosPrivate.get(
            `/transactionHistory/${transactionId}`
          );
          const transaction = transactionResponse.data;
          setTransactionHistory(transaction);
          setTransactionFetched(true);
          setTotalAmount(parseFloat(transaction.totalAmount).toFixed(2));
          setSubTotal(parseFloat(transaction.subtotal).toFixed(2));
          setVoucherID(transaction.voucherID);

          if (transaction.voucherID) {
            const voucherResponse = await axiosPrivate.get(
              `/voucher/${transaction.voucherID}`
            );
            const voucher = voucherResponse.data[0];

            if (voucher.voucherType === "Percentage") {
              const discountValue = (
                (voucher.voucherValue / 100) *
                transaction.subtotal
              ).toFixed(2);
              setDiscount(discountValue);
              setDeliveryFee((4).toFixed(2));
            } else if (voucher.voucherType === "Free Shipping") {
              setDiscount((0).toFixed(2));
              setDeliveryFee((0).toFixed(2));
            } else {
              setDiscount(voucher.voucherValue);
              setDeliveryFee((4).toFixed(2));
            }
          } else {
            setDiscount(0);
            setDeliveryFee((4).toFixed(2));
          }
        } else {
          setErrorMessage("Error Loading Page.");
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
        } else {
          setErrorMessage("Error. Please refresh this page.");
          setErrorModalOpen(true);
        }
      }
    };

    fetchData();
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  // const handleSendReceipt = () => {
  //   // Code to send receipt via email
  //   setNotificationModalMessage("Receipt sent to email.");
  //   setNotificationModal(true);
  // };

  const formatDate = (dateString) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(dateString).toLocaleString("en-SG", options);
  };

  return (
    <div>
      {transactionFetched && (
        <div className="flex justify-center mb-10 flex-col">
          <div className="flex justify-between mx-5 mt-5 mb-3">
            <button
              className="bg-transparent border-none flex items-center text-gray-500 hover:text-gray-700"
              onClick={handleGoBack}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-3xl m-2" />
              Back
            </button>
            <button
              className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
              onClick={handlePrint}
            >
              <FontAwesomeIcon icon={faPrint} className="mr-2" />
              Print
            </button>
          </div>

          <div ref={printRef} className="flex justify-center items-center">
            <div className="max-w-xs min-w-xs md:max-w-lg md:min-w-lg lg:max-w-2xl lg:min-w-2xl xl:max-w-4xl xl:min-w-4xl p-8 border rounded">
              <h2 className="text-2xl font-bold mb-2">Receipt</h2>
              <div className="border-b text-black border-2 my-2"></div>
              <div className="flex justify-start text-sm">
                <p className="break-all">
                  {formatDate(transactionHistory.transactionDate)}
                </p>
              </div>
              <div className="border-b text-black border-2 my-2"></div>
              <ul className="mt-2">
                {transactionHistory.items.map((item) => (
                  <li
                    key={item.transactionItemId}
                    className="flex justify-between items-center text-sm py-2 border-b"
                  >
                    <div className="break-all">
                      <p className="mr-4">{item.quantity}</p>
                    </div>
                    <div className="break-all">
                      <p className="font-semibold mr-4">{item.productName}</p>
                    </div>
                    <div className="break-all">
                      <p>${item.price}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between text-sm mt-5">
                <span className="font-semibold mr-5">SubTotal:</span>
                <p className="break-all">${parseFloat(subTotal).toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-semibold mr-5">Discount:</span>
                <p className="break-all">${parseFloat(discount).toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-semibold mr-5">Delivery Fee:</span>
                <p className="break-all">
                  ${parseFloat(deliveryFee).toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-semibold mr-5">Total Amount Paid:</span>
                <p className="break-all">
                  ${parseFloat(totalAmount).toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-semibold mr-5">Points Earned:</span>{" "}
                <p className="break-all">{transactionHistory.pointsEarned}</p>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-semibold mr-5">Voucher Name:</span>{" "}
                <p className="break-all">
                  {transactionHistory.voucherName
                    ? transactionHistory.voucherName
                    : "NIL"}
                </p>
              </div>
            </div>
          </div>
          {/* <div className="flex flex-col justify-end mt-5">
             <button
              className="bg-red-500 text-white py-2 px-4 rounded mt-5"
              onClick={handleSendReceipt}
            >
              Send Receipt to Email
            </button> 
          </div> */}
        </div>
      )}
      <ErrorModal
        isOpen={errorModalOpen}
        onRequestClose={handleErrorModalOk}
        errorMessage={errorMessage}
      />
      <NotificationModal
        isOpen={notificationModal}
        onRequestClose={handleNotificationModalOk}
        notificationMessage={notificationModalMessage}
      />
    </div>
  );
};
export default UserTransactionReceiptPage;
