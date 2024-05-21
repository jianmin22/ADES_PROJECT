import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import LoadingModal from "../components/Modals/LoadingModal";
import SuccessModal from "../components/Modals/SuccessModal";
import ErrorModal from "../components/Modals/ErrorModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
const Delivery = () => {
  const [selectedDate, setSelectedDate] = useState("");

  const [successOrders, setSuccessOrders] = useState([]);
  const [failedOrders, setFailedOrders] = useState([]);
  const [amountPendingOrders, setAmountPendingOrders] = useState([]);
  const [onDeliveryOrders, setOnDeliveryOrders] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Add a loading state
  const [showDateInput, setShowDateInput] = useState(true);
  const [showSections, setShowSections] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleBackToSelection = () => {
    setShowSections(false);
    setShowDateInput(true);
  };

  const handleTabChange = (tabNumber) => {
    setActiveTab(tabNumber);
  };
  useEffect(() => {
    fetchAmountOfPendingOrder();
    if (selectedDate) {
      fetchDeliveryOrders(selectedDate);
      fetchTransactionHistoryWithoutDelivery(selectedDate);
    }
  }, [selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    fetchDeliveryOrders(selectedDate);
    setShowDateInput(false);
    setShowSections(true);
  };

  const fetchDeliveryOrders = async (date) => {
    try {
      const response = await axios.get(`/delivery/deliveryOrder/${date}`);

      categorizeOrders(response.data);
      console.log("delivery order", response.data);
    } catch (error) {
      console.error("Error fetching delivery orders:", error);
    }
  };

  const fetchAmountOfPendingOrder = async () => {
    try {
      const response = await axios.get(`/delivery/pendingOrder`);

      setAmountPendingOrders(response.data);
    } catch (error) {
      console.error("Error fetching delivery orders:", error);
    }
  };

  const fetchTransactionHistoryWithoutDelivery = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/delivery/transactionWithoutDeliveryOrder/${selectedDate}`
      );
      setTransactionHistory(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(
        "Error fetching transaction history without delivery:",
        error
      );
    } finally {
      setIsLoading(false); // Set loading state to false when fetching is complete
    }
  };

  const deleteDeliveryOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (confirmed) {
      try {
        await axios.delete(`/delivery/deliveryOrder/${orderId}`);
        setIsSuccessModalOpen(true);
        setSuccessMessage(
          `Delivery order with order id:${orderId} has been successfully deleted`
        );
        // Refresh the delivery orders after successful deletion
        fetchDeliveryOrders(selectedDate);
        fetchTransactionHistoryWithoutDelivery();
      } catch (error) {
        setIsErrorModalOpen(true);
        setErrorMessage(error);
        console.error("Error deleting delivery order:", error);
      }
    }
  };

  const categorizeOrders = (orders) => {
    const onDelivery = [];
    const success = [];
    const failed = [];

    orders.forEach((order) => {
      switch (order.DeliveryStatus) {
        case "Success":
          success.push(order);
          break;
        case "Failed":
          failed.push(order);
          break;
        case "Delivering":
          onDelivery.push(order);
        default:
          break;
      }
    });
    setOnDeliveryOrders(onDelivery);

    setSuccessOrders(success);
    setFailedOrders(failed);
  };

  const updateDeliveryStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`/delivery/updateDeliveryStatus/${orderId}/${newStatus}`);
      // Refresh the delivery orders after successful update
      setIsSuccessModalOpen(true);
      setSuccessMessage(
        `Delivery order with order id:${orderId} has updated the status to ${newStatus}`
      );
      fetchDeliveryOrders(selectedDate);
    } catch (error) {
      setIsErrorModalOpen(true);
      setErrorMessage(error);
      console.error("Error updating delivery status:", error);
    }
  };

  const createDeliveryOrder = async (transactionId) => {
    try {
      await axios.post(`/delivery/createDeliveryOrder/${transactionId}`);
      setIsSuccessModalOpen(true);
      setSuccessMessage(
        `Order with transactionId ${transactionId} has been send for delivering`
      );
      // Refresh the transaction history and delivery orders after successful creation
      fetchDeliveryOrders(selectedDate);
      fetchTransactionHistoryWithoutDelivery();
      fetchAmountOfPendingOrder();
    } catch (error) {
      setIsErrorModalOpen(true);
      setErrorMessage(error);
      console.error("Error creating delivery order:", error);
    }
  };

  return (
    <div className="bg-orange-200 min-h-screen h-full justify-center align-middle w-full">
      <h1 className="text-5xl font-bold tracking-tight text-gray-900 text-center m-8">
        Delivery Report
      </h1>
      {isSuccessModalOpen ? (
        <SuccessModal
          successIsOpen={true} // Set successIsOpen to true or false based on your logic
          onSuccessClose={() => setIsSuccessModalOpen(false)} // Pass a function to handle modal close
          successMessage={successMessage} // Set the success message you want to display
        />
      ) : null}
      {isErrorModalOpen ? (
        <ErrorModal
          isOpen={true} // Set successIsOpen to true or false based on your logic
          onRequestClose={() => setIsErrorModalOpen(false)} // Pass a function to handle modal close
          errorMessage={errorMessage} // Set the success message you want to display
        />
      ) : null}
      <div>
        {showDateInput && (
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 text-center m-8">
              Please Select the date for the delivery
            </h1>
            <div className="flex justify-center">
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="px-4 py-2 border border-gray-400 rounded-lg"
              />
            </div>
            <div class="p-4">
              <ul class="list-disc list-inside">
                {amountPendingOrders.map((item) => (
                  <li key={item.date} class="mb-2">
                    <span class="font-bold">{item.date}</span> - Pending
                    Delivery: {item.pending_delivery}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {showSections && (
          <div className="px-16">
            <button onClick={handleBackToSelection}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="currentColor"
                className="bi bi-arrow-left transform hover:scale-125 duration-300"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                />
              </svg>
            </button>
            <div className="tab">
              <button
                className={`rounded-t-lg border-t-2 border-x-2 border-black ${
                  activeTab === 1
                    ? "bg-orange-600 text-white"
                    : "bg-white text-gray-700"
                } hover:bg-orange-600 hover:text-white py-3 px-6 hover:scale-105 duration-300`}
                onClick={() => handleTabChange(1)}
              >
                Pending
              </button>
              <button
                className={`rounded-t-lg border-t-2 border-x-2 border-black ${
                  activeTab === 2
                    ? "bg-orange-600 text-white"
                    : "bg-white text-gray-700"
                } hover:bg-orange-600 hover:text-white py-3 px-6 hover:scale-105 duration-300`}
                onClick={() => handleTabChange(2)}
              >
                Delivering
              </button>
              <button
                className={`rounded-t-lg border-t-2 border-x-2  border-black ${
                  activeTab === 3
                    ? "bg-orange-600 text-white"
                    : "bg-white text-gray-700"
                } hover:bg-orange-600 hover:text-white py-3 px-6 hover:scale-105 duration-300`}
                onClick={() => handleTabChange(3)}
              >
                Success
              </button>
              <button
                className={`rounded-t-lg border-t-2 border-x-2 border-black ${
                  activeTab === 4
                    ? "bg-orange-600 text-white"
                    : "bg-white text-gray-700"
                } hover:bg-orange-600 hover:text-white py-3 px-6 hover:scale-105 duration-300`}
                onClick={() => handleTabChange(4)}
              >
                Failed
              </button>
            </div>

            {isLoading ? (
              <LoadingModal></LoadingModal>
            ) : (
              <div
                className="tab-content border-2 rounded-b-lg border-black p-8 bg-white min-h-screen mb-8
              "
              >
                {activeTab === 1 && (
                  <>
                    <h1 className="text-2xl font-bold text-center pb-4">
                      Pending
                    </h1>
                    <div className="border-black border-2 rounded-lg min-h-screen p-4">
                      {transactionHistory.length === 0 ? (
                        <p className="text-center ">No Pending orders found</p>
                      ) : (
                        <ul>
                          {transactionHistory.map((transaction) => (
                            <li
                              key={transaction.transactionId}
                              className="bg-gray-100 rounded-lg p-4 mb-4 border-2 border-black"
                            >
                              <p className="text-lg font-bold">
                                Transaction ID: {transaction.transactionId}
                              </p>
                              <p>
                                Transaction Date: {transaction.transactionDate}
                              </p>
                              <p>Customer: {transaction.username}</p>
                              <p>Address: {transaction.address}</p>
                              <div>
                                <p>Products:</p>
                                {transaction.products &&
                                transaction.products.length > 0 ? (
                                  <ul className="space-y-4">
                                    {transaction.products.map((transaction) => (
                                      <li
                                        key={transaction.productName}
                                        className="flex items-center border-2 border-black rounded-lg p-4 bg-white"
                                      >
                                        <img
                                          src={transaction.uri}
                                          className="mr-4 w-32 h-32"
                                        />
                                        <div>
                                          <p className="text-lg font-bold">
                                            {transaction.productName}
                                          </p>
                                          <p>
                                            Quantity: {transaction.quantity}
                                          </p>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p>No products found for this order.</p>
                                )}
                              </div>
                              <button
                                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded mt-2"
                                onClick={() =>
                                  createDeliveryOrder(transaction.transactionId)
                                }
                              >
                                Send to Delivery
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </>
                )}
                {activeTab === 2 && (
                  <>
                    <h1 className="text-2xl font-bold text-center pb-4">
                      Delivering
                    </h1>
                    <div className="border-black border-2 rounded-lg min-h-screen p-4">
                      {onDeliveryOrders.length === 0 ? (
                        <p>No on going deliveries</p>
                      ) : (
                        <ul>
                          {onDeliveryOrders.map((order) => (
                            <li
                              key={order.DeliveryId}
                              className="bg-gray-100 rounded-lg p-4 mb-4 border-2 border-black"
                            >
                              <p className="text-lg font-bold">
                                Order ID: {order.DeliveryId}
                              </p>
                              <p>Customer: {order.username}</p>
                              <p>Address: {order.address}</p>
                              <p>Status: {order.DeliveryStatus}</p>
                              <div>
                                <p>Products:</p>
                                {order.products && order.products.length > 0 ? (
                                  <ul className="space-y-4">
                                    {order.products.map((product) => (
                                      <li
                                        key={product.productName}
                                        className="flex items-center border-2 border-black rounded-lg p-4 bg-white"
                                      >
                                        <img
                                          src={product.uri}
                                          className="mr-4 w-32 h-32"
                                        />
                                        <div>
                                          <p className="text-lg font-bold">
                                            {product.productName}
                                          </p>
                                          <p>Quantity: {product.quantity}</p>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p>No products found for this order.</p>
                                )}
                              </div>
                              <div className="flex justify-end mt-2">
                                <button
                                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2"
                                  onClick={() =>
                                    updateDeliveryStatus(
                                      order.DeliveryId,
                                      "Success"
                                    )
                                  }
                                >
                                  Mark as Success
                                </button>
                                <button
                                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                                  onClick={() =>
                                    updateDeliveryStatus(
                                      order.DeliveryId,
                                      "Failed"
                                    )
                                  }
                                >
                                  Mark as Fail
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </>
                )}
                {activeTab === 3 && (
                  <>
                    <h1 className="text-2xl font-bold text-center pb-4">
                      Success
                    </h1>
                    <div className="border-black border-2 rounded-lg min-h-screen p-4">
                      {successOrders.length === 0 ? (
                        <p>No successful deliveries</p>
                      ) : (
                        <ul>
                          {successOrders.map((order) => (
                            <li
                              key={order.DeliveryId}
                              className="bg-gray-100 rounded-lg p-4 mb-4 border-2 border-black"
                            >
                              <div className="flex justify-between">
                                <p className="text-lg font-bold">
                                  Order ID: {order.DeliveryId}
                                </p>
                                <button
                                  className="text-red-500 hover:text-red-700 font-bold"
                                  onClick={() =>
                                    deleteDeliveryOrder(order.DeliveryId)
                                  }
                                >
                                  <FontAwesomeIcon
                                    icon={faTrashAlt}
                                    className="w-3 h-3 md:w-6 md:h-6 lg:w-6 lg:h-6 m-3 cursor-pointer text-red-500 hover:text-red-600"
                                  />
                                </button>
                              </div>
                              <p>Customer: {order.username}</p>
                              <p>Address: {order.address}</p>
                              <p>Status: {order.DeliveryStatus}</p>
                              <p>Delivered Date: {order.deliveredDate}</p>
                              <div>
                                <p>Products:</p>
                                {order.products && order.products.length > 0 ? (
                                  <ul className="space-y-4">
                                    {order.products.map((product) => (
                                      <li
                                        key={product.productName}
                                        className="flex items-center border-2 border-black rounded-lg p-4 bg-white"
                                      >
                                        <img
                                          src={product.uri}
                                          className="mr-4 w-32 h-32"
                                        />
                                        <div>
                                          <p className="text-lg font-bold">
                                            {product.productName}
                                          </p>
                                          <p>Quantity: {product.quantity}</p>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p>No products found for this order.</p>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </>
                )}
                {activeTab === 4 && (
                  <>
                    <h1 className="text-2xl font-bold text-center pb-4">
                      Failed
                    </h1>
                    <div className="border-black border-2 rounded-lg min-h-screen p-4">
                      {failedOrders.length === 0 ? (
                        <p>No failed deliveries</p>
                      ) : (
                        <ul>
                          {failedOrders.map((order) => (
                            <li
                              key={order.DeliveryId}
                              className="bg-gray-100 rounded-lg p-4 mb-4 border-2 border-black"
                            >
                              <div className="flex justify-between">
                                <p className="text-lg font-bold">
                                  Order ID: {order.DeliveryId}
                                </p>
                                <button
                                  className="text-red-500 hover:text-red-700 font-bold"
                                  onClick={() =>
                                    deleteDeliveryOrder(order.DeliveryId)
                                  }
                                >
                                  <FontAwesomeIcon
                                    icon={faTrashAlt}
                                    className="w-3 h-3 md:w-6 md:h-6 lg:w-6 lg:h-6 m-3 cursor-pointer text-red-500 hover:text-red-600"
                                  />
                                </button>
                              </div>
                              <p>Customer: {order.username}</p>
                              <p>Address: {order.address}</p>
                              <p>Status: {order.DeliveryStatus}</p>
                              <div>
                                <p>Products:</p>
                                {order.products && order.products.length > 0 ? (
                                  <ul className="space-y-4">
                                    {order.products.map((product) => (
                                      <li
                                        key={product.productName}
                                        className="flex items-center border-2 border-black rounded-lg p-4 bg-white"
                                      >
                                        <img
                                          src={product.uri}
                                          className="mr-4 w-32 h-32"
                                        />
                                        <div>
                                          <p className="text-lg font-bold">
                                            {product.productName}
                                          </p>
                                          <p>Quantity: {product.quantity}</p>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p>No products found for this order.</p>
                                )}
                              </div>
                              <div className="flex justify-end mt-2">
                                <button
                                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                                  onClick={() =>
                                    updateDeliveryStatus(
                                      order.DeliveryId,
                                      "Delivering"
                                    )
                                  }
                                >
                                  Reschedule
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Delivery;
