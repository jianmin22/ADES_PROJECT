const jwt = require('jsonwebtoken');
require("dotenv").config();
const pool = require("../config/databaseConfig");
const sendEmail = require('../middleware/emailSending');

const resendEmail = async (req, res, next) => {
    
     
    try {
        const userid = req.query.uuid;

        if (userid != null) {
            
            const url = req.headers['referer'] + "confirmation?token="

            const getEmail = `SELECT email FROM User WHERE userId = ?;`;

            const [result] = await pool.query(getEmail, [userid]);
            const foundUser = result[0];
            if (! foundUser) 
                return res.status(204).json({message: "No email found, please re-enter email."});
            
            const email = foundUser.email

            sendEmail(userid, email, url, "Email Confirmation")
            res.status(200).json({message: "Email sent"});
        } else {
            return res.status(400).json({message: "No userid found. Please sign up again"});
        }


    } catch (e) {
        console.error(e)
        res.status(500).json({message: "Email was not sent due to an error"});
    }

}

module.exports = resendEmail
