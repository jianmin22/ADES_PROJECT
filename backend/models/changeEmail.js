const jwt = require('jsonwebtoken');
require("dotenv").config();
const pool = require("../config/databaseConfig");
const sendEmail = require('../middleware/emailSending');

const changeEmail = async (req, res, next) => {

    try {
       
       const userid = req.query.uuid

        if (userid != null) {
           
            const url = req.headers['referer'] + "confirmation?token="

            const newEmail = req.body.email

            const getEmail = `UPDATE User SET email = ? WHERE userId = ?;`;

            const [result] = await pool.query(getEmail, [newEmail, userid]);

            console.log("This is the uuid in the change Email" + newEmail)

            const foundUser = result[0];
            const affectedRows = result.affectedRows
            if (affectedRows) {
                sendEmail(userid, newEmail, url, "Email Confirmation")
                return res.status(201).json({message: "Updated"});
            } else if (! foundUser) {
                return res.status(204).json({message: "No email found, please re-enter email."});
            }
           
        } else {
            return res.status(204).json({message: "No userid found. Please sign up again"});
        }

    } catch (e) {
        if (e.errno == 1062){
            return res.status(409).json({message: "Email already exists!"});
        }
        res.status(500).json({message: "Email was not sent due to an error"});
    }

}

module.exports = changeEmail
