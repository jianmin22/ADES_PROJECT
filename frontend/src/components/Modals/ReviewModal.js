import React, { useState, useEffect } from "react";
import noimage from "../../assets/noimage.png";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const ReviewModal = ({
  handleSubmit,
  productId,
  quantity,
  transactionItemId,
  transactionId,
  handleClose,
}) => {
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const [product, setProduct] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await axiosPrivate.get(
        `/shop/products/${productId}/details`
      );
      const imageURL = await axiosPrivate.get(
        `/shop/products/${productId}/image`
      );
      const responseWithImage = {
        name: response.data.productName,
        image: imageURL.data,
      };
      setProduct(responseWithImage);
    } catch (error) {
      console.error("Error retrieving product:", error);
    }
  };

  const handleRatingClick = (value) => {
      setRating(value);
  };

  const handleReviewChange = (event) => {
    const text = event.target.value;
    if (text.length <= 255) {
      setDescription(text);
    }
  };

  const handleCloseModal = () => {
    handleClose();
  };

  const handleSubmitForm = (event) => {
    event.preventDefault();
    if (rating !== 0 && description.trim() !== "") {
      handleSubmit(
        productId,
        quantity,
        description,
        rating,
        transactionItemId,
        transactionId
      );
    } else {
      alert("Please fill in both the rating and review fields.");
    }
  };

  return (
    <>
      <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md mt-8">
          {product && (
            <div className="flex items-center mt-2 mb-2">
              <img
                src={
                  product.image && product.image.uri
                    ? product.image.uri
                    : noimage
                }
                className="mr-4 w-14 h-14 object-cover"
              />
              <div>
                <h2 className="text-xl font-bold mb-2">{product.name}</h2>
              </div>
            </div>
          )}

          <h2 className="text-xl font-bold mb-4">Rate the product</h2>
          <div className="flex items-center mb-4">
            <div class="rating rating-lg rating-half">
              <input type="radio" name="rating-10" className="rating-hidden" onclick={() => handleRatingClick(0)} />
              <input
                type="radio"
                name="rating-10"
                class="bg-orange-500 mask mask-star-2 mask-half-1"
                onChange={() => handleRatingClick(0.5)}
              />
              <input
                type="radio"
                name="rating-10"
                class="bg-orange-500 mask mask-star-2 mask-half-2"
                onChange={() => handleRatingClick(1.0)}
              />
              <input
                type="radio"
                name="rating-10"
                class="bg-orange-500 mask mask-star-2 mask-half-1"
                onChange={() => handleRatingClick(1.5)}
              />
              <input
                type="radio"
                name="rating-10"
                class="bg-orange-500 mask mask-star-2 mask-half-2"
                onChange={() => handleRatingClick(2.0)}
              />
              <input
                type="radio"
                name="rating-10"
                class="bg-orange-500 mask mask-star-2 mask-half-1"
                onChange={() => handleRatingClick(2.5)}
              />
              <input
                type="radio"
                name="rating-10"
                class="bg-orange-500 mask mask-star-2 mask-half-2"
                onChange={() => handleRatingClick(3.0)}
              />
              <input
                type="radio"
                name="rating-10"
                class="bg-orange-500 mask mask-star-2 mask-half-1"
                onconChange={() => handleRatingClick(3.5)}
              />
              <input
                type="radio"
                name="rating-10"
                class="bg-orange-500 mask mask-star-2 mask-half-2"
                onChange={() => handleRatingClick(4.0)}
              />
              <input
                type="radio"
                name="rating-10"
                class="bg-orange-500 mask mask-star-2 mask-half-1"
                onChange={() => handleRatingClick(4.5)}
              />
              <input
                type="radio"
                name="rating-10"
                class="bg-orange-500 mask mask-star-2 mask-half-2"
                onChange={() => handleRatingClick(5.0)}
              />
            </div>
          </div>
          <form onSubmit={handleSubmitForm}>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="review">
                Review:
              </label>
              <textarea
                id="review"
                className="w-full border rounded p-2 h-30 resize-y overflow-y-auto"
                value={description}
                onChange={handleReviewChange}
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">
                {description.length}/255 characters
              </p>
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleCloseModal}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-orange-500 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ReviewModal;
