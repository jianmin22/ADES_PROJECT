const pool = require("../config/databaseConfig");
// Get address details (JM)
module.exports.getAddress = async function getAddress(addressId) {
  try {
    const sql = `SELECT * FROM Address WHERE addressId = ?;`;
    const [result, fields] = await pool.query(sql, [addressId]);
    return result[0];
  } catch (error) {
    throw new Error(`Error retrieving address: ${error.message}`);
  }
};

// Get user address (JM)
module.exports.getUserAddress = async function getUserAddress(userId) {
  try {
    const sql = `SELECT addressId FROM UserAddress WHERE custId=?`;
    const [result, fields] = await pool.query(sql, [userId]);
    return result;
  } catch (error) {
    throw new Error(`Error retrieving all user's address: ${error.message}`);
  }
};
