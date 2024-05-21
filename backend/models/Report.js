const pool = require("../config/databaseConfig");
const { v4: uuidv4 } = require("uuid");
module.exports.oneDayTransaction = async function oneDayTransaction(date) {
  try {
    const sql = `select * from TransactionHistory where DATE(transactionDate) = ? and state="success"
    `;
    const [result, fields] = await pool.query(sql, [date]);
    return result;
  } catch (error) {
    console.error(`Error in oneDayTransaction: ${error.message}`);
    throw error;
  }
};
module.exports.totalProductSales = async function totalProductSales(date) {
  try {
    const sql = `select thi.quantity,thi.transactionId,p.* from TransactionHistory th join TransactionHistory_item thi on th.transactionId=thi.transactionId join Products p on thi.productId=p.productId where DATE(transactionDate) = ? and state="success"
      `;
    const [result, fields] = await pool.query(sql, [date]);
    return result;
  } catch (error) {
    console.error(`Error in totalProductSales: ${error.message}`);
    throw error;
  }
};
module.exports.totalGrossSales = async function totalGrossSales(date) {
  try {
    const sql = `select p.* from TransactionHistory th join TransactionHistory_item thi on th.transactionId=thi.transactionId join Products p on thi.productId=p.productId where DATE(transactionDate) = ? and state="success"
        `;
    const [result, fields] = await pool.query(sql, [date]);
    return result;
  } catch (error) {
    console.error(`Error in totalGrossSales: ${error.message}`);
    throw error;
  }
};
module.exports.top3SellingProduct = async function top3SellingProduct(date) {
  try {
    const sql = `SELECT p.productName, SUM(thi.quantity) AS totalQuantity, SUM(thi.quantity * p.price) AS totalSales
    FROM TransactionHistory th
    JOIN TransactionHistory_item thi ON th.transactionId = thi.transactionId
    JOIN Products p ON thi.productId = p.productId
    WHERE DATE(th.transactionDate) = ? AND th.state = 'success'
    GROUP BY p.productId
    ORDER BY totalQuantity DESC
    LIMIT 3;
        `;
    const [result, fields] = await pool.query(sql, [date]);
    return result;
  } catch (error) {
    console.error(`Error in top3SellingProduct: ${error.message}`);
    throw error;
  }
};
module.exports.top3SellingProductByDateRange =
  async function top3SellingProductByDateRange(Starting_Date, Ending_Date) {
    try {
      const sql = `SELECT p.productName, SUM(thi.quantity) AS totalQuantity, SUM(thi.quantity * p.price) AS totalSales
    FROM TransactionHistory th
    JOIN TransactionHistory_item thi ON th.transactionId = thi.transactionId
    JOIN Products p ON thi.productId = p.productId
    WHERE DATE(th.transactionDate) between ? AND ? AND th.state = 'success'
    GROUP BY p.productId
    ORDER BY totalQuantity DESC
    LIMIT 3;
        `;
      const [result, fields] = await pool.query(sql, [
        Starting_Date,
        Ending_Date,
      ]);
      return result;
    } catch (error) {
      console.error(`Error in top3SellingProductByDateRange: ${error.message}`);
      throw error;
    }
  };
module.exports.insertReport = async function insertReport(
  date,
  totalSales,
  totalProductSales,
  cost_of_goods_sold,
  gross_profit
) {
  const ReportID = uuidv4();
  try {
    const sql = `INSERT INTO daily_sales_report (report_id,date,totalSales, totalProductSales, cost_of_goods_sold, gross_profit) VALUES (?,?,?, ?, ?, ?)
          `;
    const [result, fields] = await pool.query(sql, [
      ReportID,
      date,
      totalSales,
      totalProductSales,
      cost_of_goods_sold,
      gross_profit,
    ]);
    return result;
  } catch (error) {
    console.error(`Error in insertReport: ${error.message}`);
    throw error;
  }
};

module.exports.dailyReport = async function dailyReport(date) {
  try {
    const sql = `select * from daily_sales_report
      `;
    const [result, fields] = await pool.query(sql, [date]);
    return result;
  } catch (error) {
    console.error(`Error in dailyReport: ${error.message}`);
    throw error;
  }
};
module.exports.dailyReportByDate = async function dailyReportByDate(date) {
  try {
    const sql = `select *,DATE_ADD(date, INTERVAL 8 HOUR) AS Singapore_Time   from daily_sales_report where date(date)=?
        `;
    const [result, fields] = await pool.query(sql, [date]);
    return result;
  } catch (error) {
    console.error(`Error in dailyReportByDate: ${error.message}`);
    throw error;
  }
};
module.exports.dailyReportByDateRange = async function dailyReportByDateRange(
  starting_date,
  ending_day
) {
  try {
    const sql = `select *,DATE_ADD(date, INTERVAL 8 HOUR) AS Singapore_Time from daily_sales_report where date(date) between ? and ? order by date ASC
        `;
    const [result, fields] = await pool.query(sql, [starting_date, ending_day]);
    return result;
  } catch (error) {
    console.error(`Error in dailyReportByDateRange: ${error.message}`);
    throw error;
  }
};
module.exports.dailyReportByDateReturnId =
  async function dailyReportByDateReturnId(date) {
    try {
      const sql = `select report_id from daily_sales_report where date(date)=?
          `;
      const [result, fields] = await pool.query(sql, [date]);
      return result;
    } catch (error) {
      console.error(`Error in dailyReportByDateReturnId: ${error.message}`);
      throw error;
    }
  };
module.exports.deleteRepeatedDailyReport =
  async function deleteRepeatedDailyReport(date) {
    try {
      const sql = `DELETE d1 FROM daily_sales_report AS d1
      JOIN (
        SELECT MAX(last_update_date) AS max_last_update
        FROM daily_sales_report
        WHERE DATE(date) = ?
      ) AS d2 ON DATE(d1.date) = ? AND d1.last_update_date < d2.max_last_update
        `;
      const [result, fields] = await pool.query(sql, [date, date]);
      return result;
    } catch (error) {
      console.error(`Error in deleteRepeatedDailyReport: ${error.message}`);
      throw error;
    }
  };
module.exports.deleteDailyReport = async function deleteDailyReport(date) {
  try {
    const sql = `delete FROM daily_sales_report where date(date)=? `;
    const [result, fields] = await pool.query(sql, [date]);
    return result;
  } catch (error) {
    console.error(`Error in deleteDailyReport: ${error.message}`);
    throw error;
  }
};

module.exports.updateReport = async function updateReport(
  reportId,
  totalSales,
  totalProductSales,
  cost_of_goods_sold,
  gross_profit
) {
  try {
    const sql = `UPDATE daily_sales_report SET totalSales = ?, totalProductSales = ?, cost_of_goods_sold = ?, gross_profit = ? ,last_update_date=CURRENT_TIMESTAMP WHERE (report_id = ?);
            `;
    const [result, fields] = await pool.query(sql, [
      totalSales,
      totalProductSales,
      cost_of_goods_sold,
      gross_profit,
      reportId,
    ]);
    return result;
  } catch (error) {
    console.error(`Error in updateReport: ${error.message}`);
    throw error;
  }
};
