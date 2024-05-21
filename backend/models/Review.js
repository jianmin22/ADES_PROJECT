const pool = require("../config/databaseConfig");
const { v4: uuidv4 } = require("uuid");

module.exports.insertReview = async function insertReview(
  productId,
  userId,
  rating,
  Qty,
  description,
  transactionItemId
) {
  const reviewId = uuidv4();

  // Check if the review already exists for the transaction item
  const selectQuery =
    "SELECT review FROM TransactionHistory_item WHERE transactionItemId = ?";
  const [selectResult, selectFields] = await pool.query(selectQuery, [
    transactionItemId,
  ]);

  if (selectResult.length > 0 && selectResult[0].review !== 0) {
    throw new Error("User has already reviewed the product");
  }

  const sql = `INSERT INTO Review (reviewId, productId, userId, createdAt, rating, Qty, description, transactionItemId)
    VALUES (?, ?, ?, NOW()+INTERVAL 8 HOUR, ?, ?, ?, ?)`;

  const [result, fields] = await pool.query(sql, [
    reviewId,
    productId,
    userId,
    rating,
    Qty,
    description,
    transactionItemId,
  ]);

  if (result.affectedRows > 0) {
    return { reviewId: reviewId };
  } else {
    throw new Error(`Failed to insert Review with reviewId: ${reviewId}`);
  }
};

module.exports.getReviewByProduct = async function getReviewByProduct(
  product_id
) {
  const sql_getReviewByProduct =
    "SELECT r.reviewId, r.createdAt, r.rating, r.Qty, r.description, u.username FROM Review as r JOIN User as u ON u.userId = r.userId WHERE r.productId = ?";

  const [result, fields] = await pool.query(sql_getReviewByProduct, product_id);
  return result;
};

module.exports.getReviewByUser = async function getReviewByUser(userId, page) {
  const reviewsPerPage = 10;
  const offset = (page - 1) * reviewsPerPage;
  const sql =
    "SELECT * FROM Review WHERE userId = ? ORDER BY createdAt DESC LIMIT ? OFFSET ?";

  try {
    const [result, field] = await pool.query(sql, [
      userId,
      reviewsPerPage,
      offset,
    ]);
    const reviews = result;

    // Calculate the total number of reviews
    const totalReviews = await getTotalReviews(userId);
    const totalPages = Math.ceil(totalReviews / reviewsPerPage);

    return { reviews, totalPages };
  } catch (error) {
    throw error;
  }
};

async function getTotalReviews(userId) {
  const sql = "SELECT COUNT(*) AS totalReviews FROM Review WHERE userId = ?";

  try {
    const [result, field] = await pool.query(sql, [userId]);
    return result[0].totalReviews;
  } catch (error) {
    throw error;
  }
};

module.exports.deleteReview = async function deleteReview(reviewId) {
  const sql = `DELETE FROM Review Where reviewId =?`;
  try {
    const [result, fields] = await pool.query(sql, [reviewId]);
    return result;
  } catch (error) {
    throw error;
  }
};
