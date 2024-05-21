const express = require("express");
const router = express.Router();
const review = require("../../models/Review");
const verifyRoles = require("../../middleware/verifyRoles");

// Insert new review
router
  .post("/:userId", verifyRoles("customer"), async (req, res) => {
    const userId = req.params.userId;
    const { productId, rating, quantity, description, transactionItemId } =
      req.body;

    if (!userId || userId === "null") {
      res.status(400).send({ message: "Invalid userId parameter" });
      return;
    } else if (!productId || productId === "null") {
      res.status(400).send({ message: "Invalid productId parameter" });
      return;
    } else if (!description || description === "null") {
      res.status(400).send({ message: "Invalid description parameter" });
      return;
    } else if (isNaN(rating) || !rating) {
      res.status(400).send({ message: "Invalid rating value" });
      return;
    } else if (isNaN(rating) || !quantity) {
      res.status(400).send({ message: "Invalid Qty value" });
      return;
    } else {
      try {
        const result = await review.insertReview(
          productId,
          userId,
          rating,
          quantity,
          description,
          transactionItemId
        );
        res.status(201).send(result);
      } catch (error) {
        if (error.message === "User has already reviewed the product") {
          res.status(400).send({ message: error.message });
        } else {
          res
            .status(500)
            .send({ message: "An error occurred. Please try again later." });
        }
      }
    }
  })
  .get("/byproduct/:product_id", verifyRoles("customer"), async (req, res) => {
    const product_id = req.params.product_id;
    if (product_id == undefined || product_id.length == 0) {
      res.status(400).send({ message: "Invalid product_id parameter" });
      return;
    }
    try {
      result = await review.getReviewByProduct(product_id);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
  .get(
    "/reviewHistory/:userId/:page",
    verifyRoles("customer"),
    async (req, res) => {
      const userId = req.params.userId;
      const page = req.params.page;
      if (!userId) {
        res.status(400).send({ message: "Invalid userId parameter" });
        return;
      } else if (!page) {
        res.status(400).send({ message: "Invalid page parameter" });
        return;
      } else {
        try {
          const result = await review.getReviewByUser(userId, page);
          res.status(200).send(result);
        } catch (error) {
          res.status(500).send({ message: error.message });
        }
      }
    }
  )

  .delete(
    "/:reviewId",
    verifyRoles("customer"),
    async function (req, res) {
      let reviewId = req.params.reviewId;
      if (!reviewId || reviewId == "null") {
        res.status(400).send({ message: "Invalid reviewId parameter" });
        return;
      } else {
        try {
          const deleteResult = await review.deleteReview(reviewId);
          if (deleteResult.affectedRows === 1) {
			res.status(200).json({ result: deleteResult });
          } else {
            res.status(500).send({ message: "Failed to delete review" });
          }
        } catch (error) {
          res.status(500).send({ message: error.message });
        }
      }
    }
  );

module.exports = router;
