import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {
  useStripe,
  useElements,
  Elements,
  CardElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import ErrorModal from "../components/Modals/ErrorModal";
import AddressModal from "../components/Modals/AddressModal";
import ConfirmationModal from "../components/Modals/ConfirmationModal";
import noimage from "../assets/noimage.png";
import LoadingModal from "../components/Modals/LoadingModal";
import useAuth from "../hooks/useAuth.js";
const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [cartId, setCartId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { auth } = useAuth();
  const userId = auth.userId;
  const [selectedCartItems, setSelectedCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [voucherId, setVoucherId] = useState(null);
  const [voucherName, setVoucherName] = useState("");
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessageForModal, setErrorMessageForModal] = useState("");
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [addressName, setAddressName] = useState("");
  const [addressId, setAddressId] = useState("");
  const [runVoucher, setRunVoucher] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  const handleErrorModalOk = () => {
    if (redirectToLogin) {
      navigate("/Login");
    }
    setErrorModalOpen(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          const cartResponse = await axiosPrivate.get(`/cart/${userId}/cartId`);
          const cartId = cartResponse.data.cart_id;
          setCartId(cartId);

          if (cartId) {
            const orderDetailsResponse = await axiosPrivate.get(
              `/cart/cartItems/${cartId}/selected`
            );
            if (
              orderDetailsResponse.data.cartItems == null ||
              orderDetailsResponse.data.cartItems.length == 0
            ) {
              navigate("/cart");
              return;
            }
            const orderDetailsWithImage = await Promise.all(
              orderDetailsResponse.data.cartItems.map(async (selectedItem) => {
                const imageURL = await axiosPrivate.get(
                  `/shop/products/${selectedItem.productId}/image`
                );
                return {
                  ...selectedItem,
                  image: imageURL.data,
                };
              })
            );
            setSelectedCartItems(orderDetailsWithImage);

            let subTotal = 0;
            orderDetailsWithImage.forEach((item) => {
              subTotal += item.price * item.quantity;
            });

            const voucherResponse = await axiosPrivate.get(
              `/voucher/cart/${cartId}`
            );
            const voucher = voucherResponse.data;

            if (voucher) {
              setVoucherId(voucher.voucherID);
              setVoucherName(voucher.voucherName);
              if (voucher.voucherType === "Percentage") {
                const discountValue = (
                  (voucher.voucherValue / 100) *
                  subTotal
                ).toFixed(2);
                setDiscount(discountValue);
                setDeliveryFee((4).toFixed(2));
                setTotalAmount((subTotal + 4 - discountValue).toFixed(2));
              } else if (voucher.voucherType === "Free Shipping") {
                setDiscount((0).toFixed(2));
                setDeliveryFee((0).toFixed(2));
                setTotalAmount(subTotal.toFixed(2));
              } else {
                setDiscount(voucher.voucherValue);
                setDeliveryFee((4).toFixed(2));
                setTotalAmount(
                  (subTotal + 4 - voucher.voucherValue).toFixed(2)
                );
              }
            } else {
              setDiscount((0).toFixed(2));
              setDeliveryFee((4).toFixed(2));
              setTotalAmount((subTotal + 4).toFixed(2));
            }

            setSubtotal(subTotal.toFixed(2));
          }
        } else {
          setErrorMessageForModal("Please Login to perform this action.");
          setRedirectToLogin(true);
          setErrorModalOpen(true);
        }
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 400) {
          if (error.message === "Invalid userId parameter") {
            setErrorMessageForModal("Please Login to perform this action.");
            setRedirectToLogin(true);
            setErrorModalOpen(true);
          } else {
            setErrorMessageForModal("Error. Please refresh this page.");
            setErrorModalOpen(true);
          }
        } else {
          setErrorMessageForModal("Error. Please refresh this page.");
          setErrorModalOpen(true);
        }
      }
    };

    fetchData();
  }, [userId]);

  const handlePayment = async (e) => {
    e.preventDefault();
    const cardElement = elements.getElement(CardElement);
    const isCardDetailsFilled = cardElement && cardElement._complete;
    if (!stripe || !elements) {
      setErrorMessageForModal(
        "An network error occurred. Please try again later."
      );
      setErrorModalOpen(true);
      return;
    }
    if (!addressId) {
      setErrorMessageForModal("Address cannot be blank.");
      setErrorModalOpen(true);
      return;
    }
    if (!isCardDetailsFilled) {
      setErrorMessageForModal("Fill in all your card details.");
      setErrorModalOpen(true);
      return;
    }
    setIsLoading(true);

    try {
      const paymentMethod = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      const stripeToken = paymentMethod.paymentMethod.id;
      setRunVoucher(false);
      if (voucherId) {
        await axiosPrivate.put(`/voucher/redeem/${voucherId}`, {
          subTotal: subtotal,
        });
        setRunVoucher(true);
      }

      const formattedSelectedItems = selectedCartItems.map((item) => {
        return {
          productId: item.productId,
          productName: item.productName,
          price: item.price,
          quantity: item.quantity,
        };
      });

      const response = await axiosPrivate.post("/payment_intents", {
        selectedCartItems: formattedSelectedItems,
        subtotal,
        totalAmount,
        discount,
        voucherId,
        stripeToken: stripeToken,
        userId: userId,
        deliveryFee,
        addressId,
      });

      if (response.status === 201) {
        setTransactionId(response.data.transactionId);
        try {
          let points = Math.floor(parseFloat(totalAmount));
          const currentDate = new Date().toLocaleDateString();
          const remarks = `Transaction made on ${currentDate}`;
          await Promise.all([
            axiosPrivate.delete(`/cart/${cartId}/selected`),
            axiosPrivate.put(`/cart/${cartId}/voucher/reset`),
            axiosPrivate.post(`/points/alterpoints`, {
              userId,
              points,
              type: 1,
              remarks,
            }),
          ]);
        } catch (error) {
          console.error(error);
        }
        setIsLoading(false);
        setConfirmationModalOpen(true);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      if (error.response) {
        if (runVoucher) {
          try {
            axiosPrivate.delete(`/voucher/rollback/${voucherId}`);
          } catch (error) {
            console.error(error);
          }
        }
        if (error.response.status === 422) {
          setErrorMessageForModal(error.response.data.message);
          setErrorModalOpen(true);
        } else if (error.response && error.response.status === 400) {
          setErrorMessageForModal(
            "An error occurred while processing your payment. Please try again later."
          );
          setErrorModalOpen(true);
        } else if (error.response && error.response.status === 500) {
          // Server error, display error message and advise user to contact customer service (if user paid and unable to refund)
          if (error.response.message == "Failed to refund with no history") {
            setErrorMessageForModal(
              "A server error occurred. Please screenshot your current page and call us at +65 66666666 for refund, sorry for any inconvenience."
            );
            setErrorModalOpen(true);
          } else {
            setErrorMessageForModal(
              "An error occurred while processing your payment. Please try again later."
            );
            setErrorModalOpen(true);
          }
        }
      } else {
        setErrorMessageForModal(
          "A network error occurred. Please try again later."
        );
        setErrorModalOpen(true);
      }
    }
  };

  const handleAddressSelect = (addressId, addressName) => {
    setAddressId(addressId);
    setAddressName(addressName);
    setIsAddressModalOpen(false);
  };

  const handleRequestToCart = () => {
    setConfirmationModalOpen(false);
    navigate("/cart");
  };

  return (
    <div>
      <div className="bg-orange-300 min-h-screen max-w-full">
        <div className="flex items-center bg-white p-4 mx-10 border-b border-gray-300 ">
          <p className="text-lg font-bold">Order Summary</p>
        </div>
        {selectedCartItems &&
          selectedCartItems.map((item) => (
            <div
              className="flex items-center border-b border-gray-300 bg-white p-4 px-10 mx-10 max-w-screen justify-between"
              key={item.id}
            >
              <div className="flex justify-center min-w-10 min-h-10 max-w-10 max-h-10">
                <img
                  src={item.image && item.image.uri ? item.image.uri : noimage}
                  className="min-w-10 min-h-10 max-w-10 max-h-10"
                />
              </div>
              <div className="flex flex-col mx-0 sm:ml-10 md:m1-10 break-all">
                <p className="text-lg font-bold max-w-[20ch] min-w-[20ch]">
                  {item.productName}
                </p>
              </div>
              <div className="flex flex-grow break-all mx-0 sm:mx-10 md:mx-10 overflow-hidden">
                <p className="text-sm max-w-[50ch] min-w-[50ch] sm:min-w-[15ch] overflow-ellipsis">
                  {item.productDesc.length > 100
                    ? `${item.productDesc.slice(0, 100)}...`
                    : item.productDesc}
                </p>
              </div>
              <div className="flex flex-col md:flex-row ml-2">
                <div className="flex flex-row mx-0 sm:mx-3">
                  <p className="text-sm overflow-hidden">Qty: </p>
                  <p className="text-sm overflow-wrap-break-all">
                    {item.quantity}
                  </p>
                </div>
                <div className="flex flex-col md:ml-3">
                  <p className="text-sm font-semibold break-all">
                    ${item.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        <div className="bg-white p-4 mx-10 mb-4 flex-col justify-end items-end">
          <div className="flex justify-between mb-2">
            <div>Subtotal:</div>
            <div>${subtotal}</div>
          </div>
          <div className="flex justify-between mb-2">
            <div>Shipping Fee:</div>
            <div>${deliveryFee}</div>
          </div>
          <div className="flex justify-between mb-2">
            <div>Discount:</div>
            <div>-${discount}</div>
          </div>
          <div className="flex justify-between mb-2">
            <div>Voucher Name:</div>
            <div>{voucherName}</div>
          </div>
          <div className="flex justify-between mb-2 font-bold">
            <div>Total Amount To Pay:</div>
            <div>${totalAmount}</div>
          </div>
        </div>

        <div className="flex items-center mt-4 bg-white p-4 mx-10 border-b border-gray-300">
          <p className="text-lg font-bold">Address</p>
        </div>
        <div className="bg-white p-4 mx-10 mb-4 border-t border-gray-300 flex-col justify-end items-end">
          <div className="flex justify-between mb-2">
            <div>Your Address:</div>
            {addressName ? (
              <div className="flex">
                <p className="mx-5">{addressName}</p>
                <a
                  href="#"
                  className="text-blue-500 underline"
                  onClick={() => setIsAddressModalOpen(true)}
                >
                  Change a Address
                </a>
              </div>
            ) : (
              <a
                href="#"
                className="text-blue-500 underline hover:text-blue-600"
                onClick={() => setIsAddressModalOpen(true)}
              >
                Select Address
              </a>
            )}
          </div>
        </div>
        <form
          id="payment form"
          onSubmit={handlePayment}
          className="bg-white mx-10 p-5"
        >
          <label className="text-lg font-bold">Enter Card Details</label>
          <CardElement className="p-5" options={{ hidePostalCode: true }} />
          <div className="flex justify-end">
            <button
              className="bg-orange-500 text-white px-4 py-2 m-4 hover:bg-orange-600 transform hover:scale-110"
              type="submit"
            >
              Pay
            </button>
          </div>
        </form>
        {isAddressModalOpen && (
          <AddressModal
            addressId={addressId}
            addressName={addressName}
            userId={userId}
            onSelect={(addressId, addressName) =>
              handleAddressSelect(addressId, addressName)
            }
            onClose={() => setIsAddressModalOpen(false)}
            show={isAddressModalOpen}
          />
        )}
        <ErrorModal
          isOpen={errorModalOpen}
          onRequestClose={handleErrorModalOk}
          errorMessage={errorMessageForModal}
        />
        {confirmationModalOpen && (
          <ConfirmationModal
            onRequestToCart={handleRequestToCart}
            transactionId={transactionId}
          />
        )}
        {isLoading && <LoadingModal />}
      </div>
    </div>
  );
};
const PaymentWithElements = () => {
  const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
  const stripePromise = loadStripe(publishableKey);

  return (
    <Elements stripe={stripePromise}>
      <Payment />
    </Elements>
  );
};

export default PaymentWithElements;
