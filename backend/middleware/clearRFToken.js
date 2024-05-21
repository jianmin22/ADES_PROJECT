const pool = require("../config/databaseConfig");

const clearRefreshToken = (userId) => {
  return new Promise((resolve, reject) => {
    const getUserRFTokenQuery = `UPDATE User SET rfToken = ? WHERE userId = ?`;

    pool.query(getUserRFTokenQuery, ["", userId], (error, result, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


