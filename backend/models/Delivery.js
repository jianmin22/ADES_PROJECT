const pool = require("../config/databaseConfig");
const { v4: uuidv4 } = require("uuid");

module.exports.createOrder = async function createOrder(TransactionId) {
  try {
    const DeliveryID = uuidv4();
    const sql1 = `Select * from TransactionHistory where state="success" and transactionId=?;

    `;
    const [result1, fields1] = await pool.query(sql1, [TransactionId]);
    if (result1.length == 1) {
      const sql2 = `Select * from Delivery where transactionId=?;

    `;
      const [result2, fields2] = await pool.query(sql2, [TransactionId]);
      if (result2.length >= 1) {
        return {
          Message: `The delivery order has been created`,
        };
      } else {
        const sql3 = `INSERT INTO Delivery (DeliveryId, transactionId) VALUES (? ,?);

    `;
        const [result3, fields3] = await pool.query(sql3, [
          DeliveryID,
          TransactionId,
        ]);
        return `${result3.affectedRows} report has been insert with DeliveryId: ${DeliveryID}`;
      }
    } else {
      return {
        Message: `There is no transaction with ${TransactionId} and state is success`,
      };
    }
  } catch (error) {
    console.error(`Error in oneDayTransaction: ${error.message}`);
    throw error;
  }
};
module.exports.getTransactionWithoutDelivery =
  async function getTransactionWithoutDelivery(Date) {
    try {
      const sql = `SELECT th.transactionId,u.username,th.transactionDate,a.*,p.productName,pim.uri,thi.quantity
      FROM TransactionHistory th
      join User u on th.userId=u.userId
      join Address a on th.addressId=a.addressId
      join TransactionHistory_item thi on th.transactionId=thi.transactionId
      join Products p on thi.productId=p.productId
      join ProductImages pim on p.productId=pim.product_Id
      WHERE th.transactionId NOT IN (
        SELECT transactionId
        FROM Delivery
      )
      and date(th.transactionDate) = ?
      and th.state="success"
      order by th.transactionDate asc
`;
      const [result, fields] = await pool.query(sql, [Date]);
      if (result.length == 0) {
        return [];
      } else {
        return result;
      }
    } catch (error) {
      console.error(`Error in oneDayTransaction: ${error.message}`);
      throw error;
    }
  };
module.exports.updateDeliveryStatus = async function updateDeliveryStatus(
  DeliveryID,
  status
) {
  try {
    if (status == "Success") {
      const sql = `UPDATE Delivery SET DeliveryStatus = ? , deliveredDate = CURRENT_TIMESTAMP WHERE (DeliveryId = ?);
  
      `;
      const [result, fields] = await pool.query(sql, [status, DeliveryID]);
      return result;
    } else {
      const sql = `UPDATE Delivery SET DeliveryStatus = ?  WHERE (DeliveryId = ?);
  
      `;
      const [result, fields] = await pool.query(sql, [status, DeliveryID]);
      return result;
    }
  } catch (error) {
    console.error(`Error in oneDayTransaction: ${error.message}`);
    throw error;
  }
};
module.exports.DeleteDeliveryOrder = async function DeleteDeliveryOrder(
  DeliveryID
) {
  try {
    const sql = `Delete from Delivery WHERE (DeliveryId = ?);
    
        `;
    const [result, fields] = await pool.query(sql, [DeliveryID]);
    return result;
  } catch (error) {
    console.error(`Error in oneDayTransaction: ${error.message}`);
    throw error;
  }
};
module.exports.getDeliveryOrder = async function getDeliveryOrder(Date) {
  try {
    const sql = `SELECT d.*,u.username,p.productName,thi.quantity,a.*,pim.uri FROM Delivery d 
    join TransactionHistory th on d.transactionId=th.transactionId 
    join User u on th.userId=u.userId 
    join TransactionHistory_item thi on th.transactionId=thi.transactionId 
    join Products p on thi.productId=p.productId 
    join ProductImages pim on p.productId=pim.product_Id
    join Address a on th.addressId=a.addressId 
    where th.state="success" and date(th.transactionDate)=? ;
      
          `;
    const [result, fields] = await pool.query(sql, [Date]);
    return result;
  } catch (error) {
    console.error(`Error in oneDayTransaction: ${error.message}`);
    throw error;
  }
};
module.exports.getPendingDeliveryOrder =
  async function getPendingDeliveryOrder() {
    try {
      const sql = `SELECT date(th.transactionDate) as date, COUNT(*) AS pending_delivery
      FROM TransactionHistory th
      LEFT JOIN Delivery d ON th.transactionId = d.transactionId
      WHERE d.transactionId IS NULL
      AND th.state = "success" and date(th.transactionDate)>"2023-08-01" 
      GROUP BY date(th.transactionDate)
      Order by date(th.transactionDate) desc;
          `;
      const [result, fields] = await pool.query(sql);
      return result;
    } catch (error) {
      console.error(`Error in oneDayTransaction: ${error.message}`);
      throw error;
    }
  };
