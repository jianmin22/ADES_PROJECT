const pool = require("../config/databaseConfig");
const { v4: uuidv4 } = require("uuid");

module.exports.insertTransactionItems = async function insertTransactionItems(
  transactionId,
  selectedCartItems
) {
  try {
    const transactionItemsData = selectedCartItems.map((item) => {
      const transactionItemId = uuidv4();
      return [transactionItemId, transactionId, item.productId, item.quantity];
    });
    
    const sql = `INSERT INTO TransactionHistory_item (transactionItemId, transactionId, productId, quantity) VALUES ?`;
    const [result, fields] = await pool.query(sql, [transactionItemsData]);
    
    if (result.affectedRows > 0) {
      return "success";
    } else {
      throw new Error(`Failed to insert transaction history items`);
    }
  } catch (error) {
    throw new Error(`Error inserting transaction history items: ${error.message}`);
  }
};

module.exports.updateTransactionItemsReview = async function updateTransactionItemsReview(
  transactionItemId, state
) {
  try {
    const sql = `UPDATE TransactionHistory_item SET review=? WHERE transactionItemId=?`;
    const [result, fields] = await pool.query(sql, [state, transactionItemId]);
    
    if (result.affectedRows > 0) {
      return "success";
    } else {
      throw new Error(`Failed to update transaction history items review`);
    }
  } catch (error) {
    throw new Error(`Error updating transaction history items review: ${error.message}`);
  }
};
