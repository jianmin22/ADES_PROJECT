const pool = require("../config/databaseConfig");

module.exports.selectAll = async function selectAll(userId) {
    const sql = `SELECT * FROM User WHERE userId = ?`;
    const [result, fields] = await pool.query(sql, [userId]);
    return result[0];
};
