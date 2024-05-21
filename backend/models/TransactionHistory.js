const pool = require("../config/databaseConfig");
const { v4: uuidv4 } = require("uuid");

// get transaction by id
module.exports.getTransactionById = async function getTransactionById(transactionId) {
  const sql = `
    SELECT TH.*,
    V.voucherID, V.voucherName,
    P.productName, P.price,
    TI.quantity, TI.transactionItemId, TI.productId
    FROM TransactionHistory AS TH
    LEFT JOIN Voucher AS V ON TH.voucherID = V.voucherID
    INNER JOIN TransactionHistory_item AS TI ON TH.transactionId = TI.transactionId
    INNER JOIN Products AS P ON TI.productId = P.productId
    LEFT JOIN Delivery AS D ON TI.transactionId = D.transactionId
    WHERE TH.transactionId = ?
    ORDER BY TH.transactionDate
  `;

  try {
    const [result, fields] = await pool.query(sql, [transactionId]);

    if (result.length === 0) {
      throw new Error("Transaction not found");
    }

    const transaction = {
      transactionId: result[0].transactionId,
      userId: result[0].userId,
      totalAmount: result[0].totalAmount,
      pointsEarned: result[0].pointsEarned,
      voucherID: result[0].voucherID,
      voucherName: result[0].voucherName,
      transactionDate: result[0].transactionDate,
      subtotal: result[0].subTotal,
      items: result.map((row) => ({
        transactionItemId: row.transactionItemId,
        productId: row.productId,
        quantity: row.quantity,
        productName: row.productName,
        price: row.price
      }))
    };

    return transaction;
  } catch (error) {
    throw new Error(`Failed to get user transaction history: ${error}`);
  }
};



// Insert new transaction (Payment-JM)
module.exports.insertTransactionHistory =
  async function insertTransactionHistory(
    subtotal,
    totalAmount,
    voucherID,
    state,
    pointsEarned,
    userId,
    addressId,
    paymentIntentId
  ) {
    try {
      const transactionId = uuidv4();
      const sql1 = `INSERT INTO TransactionHistory (transactionId, subtotal, totalAmount, voucherID, state, pointsEarned, userId, transactionDate, addressId, paymentIntentId)
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW()+INTERVAL 8 HOUR, ?, ?)`;
      const [result, fields] = await pool.query(sql1, [
        transactionId,
        subtotal,
        totalAmount,
        voucherID,
        state,
        pointsEarned,
        userId,
        addressId,
        paymentIntentId
      ]);
      if (result.affectedRows > 0) {
        return { transactionId: transactionId };
      } else {
        throw new Error(
          `Failed to insert TransactionHistory with transactionId: ${transactionId}`
        );
      }
    } catch (error) {
      throw new Error(`Failed to insert transaction history: ${error}`);
    }
  };

// Delete transaction history (Payment-JM)
module.exports.deleteTransactionHistory =
  async function deleteTransactionHistory(transactionId) {
    try {
      const sql = "DELETE FROM TransactionHistory WHERE transactionId = ?";
      const [result, fields] = await pool.query(sql, [transactionId]);
      console.log(result);
    } catch (error) {
      throw new Error(`Failed to delete transaction history: ${error}`);
    }
  };

// User Transaction Details (JM) TOBEDELETE
module.exports.getUserTransactionHistoryDetails =
  async function getUserTransactionHistoryDetails(userId, page) {
    const perPage = 10;
    const offset = (page - 1) * perPage;
    const sql = `
  SELECT TH.*,
  V.voucherID, V.voucherName,
  P.productName, P.productDesc, P.price,
  TI.quantity, TI.transactionItemId, TI.review, TI.productId, D.DeliveryId, D.deliveredDate, D.DeliveryStatus
  FROM TransactionHistory AS TH
  LEFT JOIN Voucher AS V ON TH.voucherID = V.voucherID
  INNER JOIN TransactionHistory_item AS TI ON TH.transactionId = TI.transactionId
  INNER JOIN Products AS P ON TI.productId = P.productId
  LEFT JOIN Delivery AS D ON TI.transactionId = D.transactionId
  WHERE TH.userId = ?
  ORDER BY TH.transactionDate DESC LIMIT ? OFFSET ?
  `;

    try {
      const [result, fields] = await pool.query(sql, [userId, perPage, offset]);

      const transactionHistory = [];
      let currentTransaction = null;

      for (const row of result) {
        if (
          !currentTransaction ||
          currentTransaction.transactionId !== row.transactionId
        ) {
          currentTransaction = {
            transactionId: row.transactionId,
            state: row.state,
            userId: row.userId,
            totalAmount: row.totalAmount,
            pointsEarned: row.pointsEarned,
            voucherID:row.voucherID,
            voucherName: row.voucherName,
            transactionDate: row.transactionDate,
            deliveryId: row.DeliveryId,
            subtotal: row.subTotal,
            items: []
          };
          transactionHistory.push(currentTransaction);
        }

        if (row.transactionItemId) {
          currentTransaction.items.push({
            transactionItemId: row.transactionItemId,
            productId: row.productId,
            quantity: row.quantity,
            productName: row.productName,
            productDesc: row.productDesc,
            price: row.price,
            review: row.review
          });
        }
      }

      // Calculate the total number of pages
      const totalNoTransaction = await totalTransaction(userId, "all");
      const totalPages = Math.ceil(totalNoTransaction / perPage);

      return { transactionHistory, totalPages };
    } catch (error) {
      throw new Error(`Failed to get user transaction history: ${error}`);
    }
  };

// User Transaction Details (JM) -failed
module.exports.getFailedTransactionHistoryDetails =
  async function getFailedTransactionHistoryDetails(userId, page) {
    const perPage = 10;
    const offset = (page - 1) * perPage;
    const sql = `
  SELECT TH.*,
  V.voucherID, V.voucherName,
  P.productName, P.productDesc, P.price,
  TI.quantity, TI.transactionItemId, TI.review, TI.productId, D.DeliveryId, D.deliveredDate, D.DeliveryStatus
  FROM TransactionHistory AS TH
  LEFT JOIN Voucher AS V ON TH.voucherID = V.voucherID
  INNER JOIN TransactionHistory_item AS TI ON TH.transactionId = TI.transactionId
  INNER JOIN Products AS P ON TI.productId = P.productId
  LEFT JOIN Delivery AS D ON TI.transactionId = D.transactionId
  WHERE TH.userId = ? AND TH.state='failed'
  ORDER BY TH.transactionDate DESC LIMIT ? OFFSET ?
  `;

    try {
      const [result, fields] = await pool.query(sql, [userId, perPage, offset]);

      const transactionHistory = [];
      let currentTransaction = null;

      for (const row of result) {
        if (
          !currentTransaction ||
          currentTransaction.transactionId !== row.transactionId
        ) {
          currentTransaction = {
            transactionId: row.transactionId,
            state: row.state,
            userId: row.userId,
            totalAmount: row.totalAmount,
            pointsEarned: row.pointsEarned,
            voucherID:row.voucherID,
            voucherName: row.voucherName,
            transactionDate: row.transactionDate,
            deliveryId: row.DeliveryId,
            subtotal: row.subTotal,
            items: []
          };
          transactionHistory.push(currentTransaction);
        }

        if (row.transactionItemId) {
          currentTransaction.items.push({
            transactionItemId: row.transactionItemId,
            productId: row.productId,
            quantity: row.quantity,
            productName: row.productName,
            productDesc: row.productDesc,
            price: row.price,
            review: row.review
          });
        }
      }

      // Calculate the total number of pages
      const totalNoTransaction = await totalTransaction(userId, "failed");
      const totalPages = Math.ceil(totalNoTransaction / perPage);

      return { transactionHistory, totalPages };
    } catch (error) {
      throw new Error(`Failed to get user transaction history: ${error}`);
    }
  };

// User Transaction Details (JM) - With state
module.exports.getUserStateTransactionHistoryDetails =
  async function getUserStateTransactionHistoryDetails(userId, page, status) {
    const perPage = 10;
    const offset = (page - 1) * perPage;
    let sql = "";
    let params = [];
    if (status == "Pending") {
      sql = `
    SELECT TH.*,
    V.voucherID, V.voucherName,
    P.productName, P.productDesc, P.price,
    TI.quantity, TI.transactionItemId, TI.review, TI.productId, D.DeliveryId, D.deliveredDate, D.DeliveryStatus
    FROM TransactionHistory AS TH
    LEFT JOIN Voucher AS V ON TH.voucherID = V.voucherID
    INNER JOIN TransactionHistory_item AS TI ON TH.transactionId = TI.transactionId
    INNER JOIN Products AS P ON TI.productId = P.productId
    LEFT JOIN Delivery AS D ON TI.transactionId = D.transactionId
    WHERE TH.userId = ? AND D.DeliveryStatus IS NULL AND TH.state!="failed"
    ORDER BY TH.transactionDate DESC LIMIT ? OFFSET ?
    `;
      params = [userId, perPage, offset];
    } else {
      sql = `
    SELECT TH.*,
    V.voucherID, V.voucherName,
    P.productName, P.productDesc, P.price,
    TI.quantity, TI.transactionItemId, TI.review, TI.productId, D.DeliveryId, D.deliveredDate, D.DeliveryStatus
    FROM TransactionHistory AS TH
    LEFT JOIN Voucher AS V ON TH.voucherID = V.voucherID
    INNER JOIN TransactionHistory_item AS TI ON TH.transactionId = TI.transactionId
    INNER JOIN Products AS P ON TI.productId = P.productId
    LEFT JOIN Delivery AS D ON TI.transactionId = D.transactionId
    WHERE TH.userId = ? AND D.DeliveryStatus=? AND TH.state!="failed"
    ORDER BY TH.transactionDate DESC LIMIT ? OFFSET ?
    `;
      params = [userId, status, perPage, offset];
    }

    try {
      const [result, fields] = await pool.query(sql, params);

      const transactionHistory = [];
      let currentTransaction = null;

      for (const row of result) {
        if (
          !currentTransaction ||
          currentTransaction.transactionId !== row.transactionId
        ) {
          currentTransaction = {
            transactionId: row.transactionId,
            state: row.state,
            userId: row.userId,
            totalAmount: row.totalAmount,
            pointsEarned: row.pointsEarned,
            voucherID:row.voucherID,
            voucherName: row.voucherName,
            transactionDate: row.transactionDate,
            deliveryId: row.DeliveryId,
            subtotal: row.subTotal,
            items: []
          };
          transactionHistory.push(currentTransaction);
        }

        if (row.transactionItemId) {
          currentTransaction.items.push({
            transactionItemId: row.transactionItemId,
            productId: row.productId,
            quantity: row.quantity,
            productName: row.productName,
            productDesc: row.productDesc,
            price: row.price,
            review: row.review
          });
        }
      }

      // Calculate the total number of pages
      const totalNoTransaction = await totalTransaction(userId, status);
      const totalPages = Math.ceil(totalNoTransaction / perPage);

      return { transactionHistory, totalPages };
    } catch (error) {
      throw new Error(`Failed to get user transaction history: ${error}`);
    }
  };

async function totalTransaction(userId, status) {
  let sql = "";
  if (status == "failed") {
    sql = `SELECT COUNT(*) AS totalTransaction FROM TransactionHistory WHERE userId = ? AND state="failed"`;
  } else if (status == "Pending") {
    sql = `SELECT COUNT(*) AS totalTransaction FROM TransactionHistory 
    LEFT JOIN Delivery ON TransactionHistory.transactionId = Delivery.transactionId
    WHERE TransactionHistory.userId = ? AND Delivery.DeliveryStatus IS NULL AND TransactionHistory.state!="failed"`;
  } else if (status == "Delivering") {
    sql = `SELECT COUNT(*) AS totalTransaction FROM TransactionHistory 
    LEFT JOIN Delivery ON TransactionHistory.transactionId = Delivery.transactionId
    WHERE TransactionHistory.userId = ? AND Delivery.DeliveryStatus='Delivering' AND TransactionHistory.state!="failed"`;
  } else if (status == "Success") {
    sql = `SELECT COUNT(*) AS totalTransaction FROM TransactionHistory 
    LEFT JOIN Delivery ON TransactionHistory.transactionId = Delivery.transactionId
    WHERE TransactionHistory.userId = ? AND Delivery.DeliveryStatus='Success' AND TransactionHistory.state!="failed"`;
  } else {
    sql = `SELECT COUNT(*) AS totalTransaction FROM TransactionHistory WHERE userId = ?`;
  }

  try {
    const [result, fields] = await pool.query(sql, [userId]);
    return result[0].totalTransaction;
  } catch (error) {
    throw new Error(`Failed to get total number of transaction: ${error}`);
  }
}

module.exports.allTransaction = async function allTransaction() {
  try {
    const sql = `SELECT th.totalAmount,th.pointsEarned,th.voucherID,th.state,th.transactionDate, u.username,u.email,thi.productId,p.price
    FROM TransactionHistory th
    JOIN User u ON th.userId = u.userId
    JOIN TransactionHistory_item thi on th.transactionId=thi.transactionId
    JOin Products p on p.productId=thi.productId
    `;
    const [result, fields] = await pool.query(sql);
    return result;
  } catch (error) {
    console.error(`Error in allTransaction: ${error.message}`);
    throw error;
  }
};
