import React, { useRef, useEffect, useState } from "react";
import noimage from "../assets/noimage.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import VoucherModal from "../components/Modals/VoucherModal";
import ErrorModal from "../components/Modals/ErrorModal";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
function Cart() {
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();
  const [cartId, setCartId] = useState(null);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const userId = auth.userId;
  const [cartItems, setCartItems] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [voucherID, setVoucherID] = useState(null);
  const [voucherName, setVoucherName] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [shippingFee, setShippingFee] = useState(4);
  const [totalAmount, setTotalAmount] = useState(4);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [voucherError, setVoucherError] = useState(false);
  const [voucherErrorMessage, setVoucherErrorMessage] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const handleErrorModalOk = () => {
    if (redirectToLogin) {
      navigate("/Login");
    }
    setErrorModalOpen(false);
  };

  useEffect(() => {
    const getCartId = async () => {
      try {
        if (userId) {
          const response = await axiosPrivate.get(`/cart/${userId}/cartId`);
          setCartId(response.data.cart_id);
        } else {
          setErrorMessage("Please Login to perform this action.");
          setErrorModalOpen(true);
          setRedirectToLogin(true);
        }
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 400) {
          setErrorMessage("Please Login to perform this action.");
          setRedirectToLogin(true);
          setErrorModalOpen(true);
        } else if (error.response && error.response.status === 500) {
          setErrorMessage("Error. Please refresh this page.");
          setErrorModalOpen(true);
        }
      }
    };

    getCartId();
  }, []);
  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        const voucherResponse = await axiosPrivate.get(
          `/voucher/cart/${cartId}`
        );
        const voucher = voucherResponse.data;
        if (voucher) {
          setVoucherID(voucher.voucherID);
          setVoucherName(voucher.voucherName);
        }
      } catch (error) {
        console.error(error);
        setErrorMessage("Error. Please refresh this page.");
        setErrorModalOpen(true);
      }
    };
    if (cartId) {
      fetchVoucher();
    }
  }, [cartId]);

  useEffect(() => {
    if (voucherID && !voucherError) {
      const getVoucherDetails = async () => {
        try {
          const subtotal = parseFloat(calculateSubtotal());
          const response = await axiosPrivate.get(`/voucher/${voucherID}`);
          const result = response.data;

          if (result[0].voucherType === "Percentage") {
            const discountValue = (
              (result[0].voucherValue / 100) *
              subtotal
            ).toFixed(2);
            setDiscount(discountValue);
            setShippingFee((4).toFixed(2));
            setTotalAmount((subtotal + 4 - discountValue).toFixed(2));
          } else if (result[0].voucherType === "Free Shipping") {
            setDiscount((0).toFixed(2));
            setShippingFee((0).toFixed(2));
            setTotalAmount(subtotal.toFixed(2));
          } else {
            setDiscount(result[0].voucherValue);
            setShippingFee((4).toFixed(2));
            setTotalAmount((subtotal + 4 - result[0].voucherValue).toFixed(2));
          }
        } catch (error) {
          console.error(error);
          if (error.response && error.response.status === 404) {
            setErrorMessage("Voucher does'nt exist.");
            setErrorModalOpen(true);
          } else if (error.response && error.response.status === 500) {
            setErrorMessage("Error. Please refresh this page.");
            setErrorModalOpen(true);
          }
        }
      };
      getVoucherDetails();
    } else {
      const subtotal = parseFloat(calculateSubtotal());
      setDiscount((0).toFixed(2));
      if (subtotal !== 0) {
        setShippingFee((4).toFixed(2));
        setTotalAmount((4 + subtotal).toFixed(2));
      } else {
        setShippingFee((0).toFixed(2));
        setTotalAmount((0).toFixed(2));
      }
    }
  }, [voucherID, cartItems, shippingFee,voucherError]);

  useEffect(() => {
    const resetCart = async () => {
      try {
        if (cartId) {
          await axiosPrivate.put(`/cart/${cartId}/reset`);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (location.pathname !== "/Payment") {
      resetCart();
    }
  }, [cartId, location]);

  useEffect(() => {
    if (cartId) {
      const getCartDetails = async () => {
        try {
          const request1 = axiosPrivate.get(`/cart/cartItems/${cartId}`);
          const request2 = axiosPrivate.get(`/cart/recommendation/${cartId}`);
          const [response1, response2] = await Promise.all([
            request1,
            request2,
          ]);

          const cartItemsData = await Promise.all(
            response1.data.map(async (cartItem) => {
              const imageURL = await axiosPrivate.get(
                `/shop/products/${cartItem.productId}/image`
              );
              return {
                ...cartItem,
                image: imageURL.data,
              };
            })
          );

          const recommendationData = await Promise.all(
            response2.data.map(async (recommendationItem) => {
              const imageURL = await axiosPrivate.get(
                `/shop/products/${recommendationItem.productId}/image`
              );
              return {
                ...recommendationItem,
                image: imageURL.data,
              };
            })
          );

          setCartItems(cartItemsData);
          setRecommendations(recommendationData);
        } catch (error) {
          console.error(error);
          if (
            (error.response && error.response.status === 400) ||
            (error.response && error.response.status === 500)
          ) {
            setErrorMessage("Error. Please refresh this page.");
            setErrorModalOpen(true);
          }
        }
      };

      getCartDetails();
      setShowDetails(true);
    }
  }, [cartId]);

  const handleCheckout = async () => {
    // Check if at least one item is selected
    const selectedItems = cartItems.filter((item) => item.selected == 1);
    if (selectedItems.length < 1) {
      setErrorMessage("You have not selected any products");
      setErrorModalOpen(true);
      return;
    }

    try {
      const request1 = axiosPrivate.put("/cart/cartItems", {
        cartItemIds: selectedItems.map((item) => item.cartItem_Id),
        cartId: cartId,
      });
      let request2 = "";
      if(!voucherError){
        request2=axiosPrivate.put(`/cart/${voucherID}/carts/${cartId}`);
      }else{
        request2=axiosPrivate.put(`/cart/${null}/carts/${cartId}`)
      }
      
      await Promise.all([request1, request2]);
      navigate("/Payment");
    } catch (error) {
      console.error(error);
      if (
        (error.response && error.response.status === 400) ||
        (error.response && error.response.status === 500)
      ) {
        setErrorMessage("Error. Please refresh this page.");
        setErrorModalOpen(true);
      }
    }
  };

  useEffect(() => {
    const checkVoucherValid = async () => {
      if (voucherID) {
        try {
          const subtotal = parseFloat(calculateSubtotal());
          await axiosPrivate.post(
            `/voucher/check/${voucherID}`,
            {
              subTotal: subtotal,
            }
          );
          setVoucherError(false);
          setVoucherErrorMessage("");
        } catch (error) {
          if (error.response && error.response.status === 422) {
            setVoucherError(true);
            setVoucherErrorMessage(
              "Voucher didn't meet the requirements or is not available"
            );
          } else {
            setErrorMessage("Error. Please refresh this page.");
            setVoucherID(null);
            setErrorModalOpen(true);
          }
        }
      }
    };
    checkVoucherValid();
  }, [voucherID, cartItems]);
  const handleAddQuantity = async (cartItemId, quantity, stock) => {
    if (quantity == stock || quantity > stock) {
      quantity = stock - 1;
      setErrorMessage("Item meets the max number in stock.");
      setErrorModalOpen(true);
    }
    try {
      if (cartItemId && quantity) {
        await axiosPrivate.put(
          `/cart/cartItems/${cartItemId}/quantity`,
          {
            qty: quantity + 1,
          }
        );
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.cartItem_Id === cartItemId
              ? { ...item, quantity: quantity + 1 }
              : item
          )
        );
      } else {
        setErrorMessage("Error. Please refresh this page.");
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error(error);
      if (
        (error.response && error.response.status === 400) ||
        (error.response && error.response.status === 500)
      ) {
        setErrorMessage("Error. Please refresh this page.");
        setErrorModalOpen(true);
      }
    }
  };

  const handleRemoveQuantity = async (cartItemId, quantity, stock) => {
    if (quantity == 1) {
      return;
    }
    try {
      if (cartItemId && quantity) {
       await axiosPrivate.put(
          `/cart/cartItems/${cartItemId}/quantity`,
          {
            qty: quantity - 1,
          }
        );
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.cartItem_Id === cartItemId
              ? { ...item, quantity: quantity - 1 }
              : item
          )
        );
      } else {
        setErrorMessage("Error. Please refresh this page.");
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error(error);
      if (
        (error.response && error.response.status === 400) ||
        (error.response && error.response.status === 500)
      ) {
        setErrorMessage("Error. Please refresh this page.");
        setErrorModalOpen(true);
      }
    }
  };

  const handleQuantityChange = async (cartItemId, quantity, stock) => {
    if (quantity == 0 ||quantity==null) {
      return;
    }
    quantity=parseInt(quantity);
    if (quantity == stock || quantity > stock) {
      quantity = stock;
      setErrorMessage("Item meets the max number in stock.");
      setErrorModalOpen(true);
    }
    try {
      if (cartItemId && quantity) {
        await axiosPrivate.put(
          `/cart/cartItems/${cartItemId}/quantity`,
          {
            qty: quantity,
          }
        );
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.cartItem_Id === cartItemId
              ? { ...item, quantity: quantity }
              : item
          )
        );
      } else {
        setErrorMessage("Error. Please refresh this page.");
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error(error);
      if (
        (error.response && error.response.status === 400) ||
        (error.response && error.response.status === 500)
      ) {
        setErrorMessage("Error. Please refresh this page.");
        setErrorModalOpen(true);
      }
    }
  };

  const handleDeleteCartItem = async (cartItemId) => {
    try {
      if (cartItemId) {
        await axiosPrivate.delete(
          `/cart/cartItems/${cartItemId}`
        );
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.cartItem_Id !== cartItemId)
        );
      } else {
        setErrorMessage("Error. Please refresh this page.");
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error(error);
      if (
        (error.response && error.response.status === 400) ||
        (error.response && error.response.status === 500)
      ) {
        setErrorMessage("Error. Please refresh this page.");
        setErrorModalOpen(true);
      }
    }
  };

  const calculateSubtotal = () => {
    let subtotal = 0;
    cartItems.forEach((item) => {
      if (item.selected === 1) {
        subtotal += item.price * item.quantity;
      }
    });
    return subtotal.toFixed(2);
  };

  const handleVoucherSelect = (voucherId, voucherName) => {
    setVoucherID(voucherId);
    setVoucherName(voucherName);
    setIsVoucherModalOpen(false);
  };

  const handleCheckboxChange = (cartItemId, selectedOption) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartItem_Id === cartItemId
          ? { ...item, selected: selectedOption === 1 ? 0 : 1 }
          : item
      )
    );
  };

  return (
    <div className="bg-orange-100">
      {cartItems.length === 0
        ? showDetails && (
            <div className="h-screen flex flex-col justify-center items-center">
              <h1 className="text-3xl font-bold mb-5">Cart is Empty</h1>
              <Link to="/shop/search">
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded">
                  Go to Shop
                </button>
              </Link>
            </div>
          )
        : showDetails && (
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-3/4 container mx-auto py-8">
                <h1 className="text-3xl font-bold mx-4 lg:mx-20 mb-5">
                  Shopping Cart
                </h1>
                <div
                  id="scrollableDiv"
                  className="overflow-hidden mb-8 lg:mb-0"
                >
                  {cartItems.map((item) => (
                    <div
                      className="bg-white flex items-center justify-between rounded-lg shadow-md border-300 border-white py-4 px-6 mx-4 sm:flex-row sm:items-center sm:justify-between sm:mx-20 my-6"
                      key={item.cart_item_id}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-4 form-checkbox w-6 h-6 cursor-pointer"
                          checked={item.selected === 1}
                          onChange={() =>
                            handleCheckboxChange(
                              item.cartItem_Id,
                              item.selected
                            )
                          }
                        />
                        <Link to={`/shop/${item.productId}`}>
                          <img
                            src={
                              item.image && item.image.uri
                                ? item.image.uri
                                : noimage
                            }
                            className="object-contain w-20 h-20 md:w-24 md:h-24 lg:w-24 lg:h-24 xl:w-32 xl:h-32 mr-4 cursor-pointer"
                          />
                        </Link>

                        <div className="m-2">
                          <Link to={`/shop/${item.productId}`}>
                            <h2 className="text-sm font-bold cursor-pointer w-20 lg:text-lg lg:w-60 break-all">
                              {item.productName}
                            </h2>
                          </Link>
                        </div>
                      </div>
                      <div className="flex flex-row items-center">
                        <div className="flex items-center mb-2 lg:mb-0">
                          <button
                            class="bg-white text-black-500 font-bold border border-grey-200 w-5 h-5 md:w-6 md:h-6 lg:w-6 lg:h-6 "
                            onClick={() =>
                              handleRemoveQuantity(
                                item.cartItem_Id,
                                item.quantity,
                                item.stock
                              )
                            }
                          >
                            -
                          </button>
                          <div>
                            <input
                              type="number"
                              class="w-10 h-5 md:w-12 md:h-6 lg:w-12 lg:h-6 text-center appearance-none border border-gray-300 bg-white leading-tight focus:outline-none focus:shadow-outline"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.cartItem_Id,
                                  e.target.value,
                                  item.stock
                                )
                              }
                            />
                          </div>
                          <button
                            class="bg-white text-black-500 font-bold border border-grey-200 w-5 h-5 md:w-6 md:h-6 lg:w-6 lg:h-6 "
                            onClick={() =>
                              handleAddQuantity(
                                item.cartItem_Id,
                                item.quantity,
                                item.stock
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                        <FontAwesomeIcon
                          icon={faTrashAlt}
                          className="w-3 h-3 md:w-6 md:h-6 lg:w-6 lg:h-6 m-3 cursor-pointer text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteCartItem(item.cartItem_Id)}
                        />
                        <div className="flex items-center">
                          <p className="text-black-500 font-bold break-all">
                            {" "}
                            ${item.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:w-1/4 lg:h-screen bg-orange-300 rounded-lg overflow-hidden p-6">
                <div className="flex justify-between mb-2">
                  <div>Subtotal:</div>
                  <div>${calculateSubtotal()}</div>
                </div>
                <div className="flex justify-between mb-2">
                  <div>Shipping Fee:</div>
                  <div>${shippingFee}</div>
                </div>
                <div className="flex justify-between mb-2">
                  <div>Discount:</div>
                  <div>-${discount}</div>
                </div>
                <div className="flex justify-between mb-2">
                  <div>Voucher:</div>
                  {voucherName ? (
                    <div>
                      {voucherError ? (
                        <div>
                          <p className="text-gray-500">{voucherName}</p>
                          <p className="text-red-500">{voucherErrorMessage}</p>
                        </div>
                      ) : (
                        <p>{voucherName}</p>
                      )}
                      <a
                        href="#"
                        className="text-blue-500 underline hover:text-blue-600"
                        onClick={() => setIsVoucherModalOpen(true)}
                      >
                        Change a Voucher
                      </a>
                    </div>
                  ) : (
                    <a
                      href="#"
                      className="text-blue-500 underline hover:text-blue-600"
                      onClick={() => setIsVoucherModalOpen(true)}
                    >
                      Select Voucher
                    </a>
                  )}
                </div>
                {isVoucherModalOpen && (
                  <VoucherModal
                    voucherID={voucherID}
                    subTotal={calculateSubtotal()}
                    voucherName={voucherName}
                    userId={userId}
                    onSelect={(voucherId, voucherName) =>
                      handleVoucherSelect(voucherId, voucherName)
                    }
                    onClose={() => setIsVoucherModalOpen(false)}
                    show={isVoucherModalOpen}
                  />
                )}

                <h2 className="flex justify-between text-xl font-bold mb-4">
                  <div>Total Amount:</div>
                  <div>${totalAmount}</div>
                </h2>
                <div className="flex justify-end mb-2">
                  <button
                    className="bg-orange-500 text-white font-bold py-2 px-4 rounded-full mb-2 hover: hover:bg-orange-600 transform hover:scale-110"
                    onClick={() => handleCheckout()}
                  >
                    Checkout
                  </button>
                </div>
                <ErrorModal
                  isOpen={errorModalOpen}
                  onRequestClose={handleErrorModalOk}
                  errorMessage={errorMessage}
                />
              </div>
            </div>
          )}
      {cartItems.length > 0 && recommendations.length > 0 ? (
        <div className="mt-3 mb-3 pb-10">
          <h1 className="text-3xl font-bold mb-5 mt-5 pt-8 mx-5">
            Your recommendations
          </h1>
          <div className="relative flex overflow-x-scroll">
            <div className="flex items-center justify-center">
              {recommendations.map((recommendation) => (
                <div
                  className="whitespace-nowrap m-3 bg-white flex flex-col items-center justify-between rounded-lg shadow-md border-300 border-white py-4 mx-4 lg:w-80 h-85 transform hover:scale-110"
                  key={recommendation.productId}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 bg-gray-200 rounded-lg m-4">
                      <Link to={`/shop/${recommendation.productId}`}>
                        <img
                          src={
                            recommendation.image && recommendation.image.uri
                              ? recommendation.image.uri
                              : noimage
                          }
                          className="object-fit-contain w-32 h-32 mr-4 cursor-pointer"
                        />
                      </Link>
                    </div>
                    <Link to={`/shop/${recommendation.productId}`}>
                      <h2 className="text-lg font-bold sm:w-64 md:w-75 lg:w-80 whitespace-normal text-center h-20 overflow-x-hidden cursor-pointer">
                        {recommendation.productName}
                      </h2>
                    </Link>
                    <p className="text-gray-500 mb-2">
                      ${recommendation.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
export default Cart;
