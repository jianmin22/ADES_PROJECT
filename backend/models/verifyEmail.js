require("dotenv").config();
const pool = require("../config/databaseConfig");
const jwt = require('jsonwebtoken');

const verifyEmail = async (req, res, next) => {

    try {

        const userid = jwt.verify(req.params.token, process.env.EMAIL_SECRET).user

        const userVerified = `UPDATE User SET verified = 1 WHERE (userId = ?);`;

        const [result] = await pool.query(userVerified, [userid]);
        const foundUser = result[0];
        if (! foundUser) return res.status(204).json({message: "No name records found for email verification."});

        return res.status(200).json({message: "OK"});

    } catch (e) {

        // User does not exist
        if (e.errno == 1054) {
            res.status(409).json({message: "User does not exist, please sign up again"});
            return
        } 
        // JWT has expired or signature not valid
        else if (e.name == "JsonWebTokenError" || e.name == "TokenExpiredError") {
            res.status(409).json({message: "Invalid validation"});
            return
        } 
        res.status(500).json({message: "Unknown error"});
        console.error(e)
    }

}

module.exports = verifyEmail
