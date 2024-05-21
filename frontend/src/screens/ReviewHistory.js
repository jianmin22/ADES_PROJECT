import React, { useEffect, useState } from "react";
import { Profile_navbar } from "../components/Navbar";
import noimage from "../assets/noimage.png";
import ErrorModal from "../components/Modals/ErrorModal";
import useAuth from "../hooks/useAuth.js";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faStarHalfAlt,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

const ReviewHistory = () => {
  const { auth } = useAuth();
  const userId = auth.userId;
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [reviewHistory, setReviewHistory] = useState([]);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [reviewFetched, setReviewFetched] = useState(false);

  const handleErrorModalOk = () => {
    if (redirectToLogin) {
      navigate("/Login");
    }
    setErrorModalOpen(false);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const whiteStars = 5 - Math.ceil(rating);

    const starElements = [];
    for (let i = 0; i < fullStars; i++) {
      starElements.push(
        <FontAwesomeIcon key={i} icon={faStar} className="text-yellow-500" />
      );
    }
    if (hasHalfStar) {
      starElements.push(
        <FontAwesomeIcon
          key="half"
          icon={faStarHalfAlt}
          className="text-yellow-500"
        />
      );
    }
    for (let i = 0; i < whiteStars; i++) {
      starElements.push(
        <FontAwesomeIcon
          key={`blank${i}`}
          icon={faStar}
          className="text-gray-300"
        />
      );
    }

    return starElements;
  };

  const handleDeleteReview = async (reviewId, transactionItemId) => {
    if (reviewId && transactionItemId) {
      try {
        const deleteResponse = await axiosPrivate.delete(
          `/review/${reviewId}`
        );
        if (deleteResponse.status === 200) {
          const putResponse = await axiosPrivate.put(
            `/transactionHistoryItem/${transactionItemId}/0/review`
          );
          if (putResponse.status === 200) {
            setReviewHistory((prevHistories) =>
              prevHistories.filter((history) => history.reviewId !== reviewId)
            );
          } else {
            setErrorMessage("Error. Please refresh this page.");
            setErrorModalOpen(true);
          }
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
    }
  };

  useEffect(() => {
    const fetchReviewHistory = async () => {
      try {
        if (userId) {
          const response = await axiosPrivate.get(
            `/review/reviewHistory/${userId}/${currentPage}`
          );
          const { reviews, totalPages } = response.data;
          const reviewPromises = reviews.map(async (review) => {
            const request1 = axiosPrivate.get(
              `/product/getProductByID/${review.productId}`
            );
            const request2 = axiosPrivate.get(
              `/shop/products/${review.productId}/image`
            );

            const [productResponse, imageURLResponse] = await Promise.all([
              request1,
              request2,
            ]);

            const product = productResponse.data;
            const imageURL = imageURLResponse.data;

            return {
              ...review,
              product: product,
              image: imageURL,
            };
          });

          const reviewsWithProductInfo = await Promise.all(reviewPromises);
          const sortedHistory = reviewsWithProductInfo.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setTotalPages(totalPages);
          setReviewHistory(sortedHistory);
          setReviewFetched(true);
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
    fetchReviewHistory();
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

  const selected = "reviewHistory";
  return (
    <div className="my-5 flex flex-row grow">
      <Profile_navbar page={selected} />
      <div className="grow mr-5 bg-orange-300 drop-shadow-2xl rounded-xl">
        {reviewHistory.length === 0
          ? reviewFetched && (
              <div className="h-screen flex flex-col justify-center items-center">
                <h1 className="text-3xl font-bold mb-5">No review history</h1>
              </div>
            )
          : reviewFetched && (
              <div className="flex flex-col justify-center pb-8 m-5">
                <h1 className="text-4xl pb-6 ml-5">Your Review History</h1>
                {reviewHistory.map((review) => (
                  <div className="bg-white shadow-lg m-5 px-5 py-8 border border-gray-200 rounded-2xl mb-10">
                    <div>
                      <div className="flex justify-between">
                        <div>{renderStars(review.rating)}</div>
                        <div className="mr-5">
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            className="text-red-800 hover:text-red-500 transform hover:scale-110 cursor-pointer"
                            onClick={() =>
                              handleDeleteReview(
                                review.reviewId,
                                review.transactionItemId
                              )
                            }
                          />
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm">
                        {Number(review.rating).toFixed(1)}/5.0
                      </p>
                      <div className="text-gray-500 text-sm">
                        {review.createdAt}
                      </div>
                      <div>{review.description}</div>
                    </div>
                    <Link to={`/shop/${review.product[0].productId}`}>
                      <div className="flex items-center justify-between border border-gray-300 rounded-lg p-1 my-6 shadow-lg w-full cursor-pointer">
                        <div className="flex items-center">
                          <div className="flex items-center h-20 w-20 m-6">
                            <img
                              src={
                                review.image && review.image.uri
                                  ? review.image.uri
                                  : noimage
                              }
                              className="h-full object-contain"
                            />
                          </div>
                          <div className="flex flex-col text-sm max-w-[60ch] min-w-[60ch]">
                            <p className="font-bold">
                              {review.product[0].productName}
                            </p>
                            <p>{review.product[0].productDesc}</p>
                          </div>
                        </div>
                        <div className="mr-5 font-bold">
                          ${Number(review.product[0].price).toFixed(2)}
                        </div>
                      </div>
                    </Link>
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
      </div>
      <ErrorModal
        isOpen={errorModalOpen}
        onRequestClose={handleErrorModalOk}
        errorMessage={errorMessage}
      />
    </div>
  );
};

export default ReviewHistory;
