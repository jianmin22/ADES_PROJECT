const pool = require("../config/databaseConfig");
require("dotenv").config();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const sendEmail = require("../middleware/emailSending")

const sendResetLink = async (req, res, next) => {

    console.log("sendResetLink.js")
    try {

        const email = req.query.email;

        if (email != null) {
            const getEmail = `SELECT userId FROM User WHERE email = ?;`;

            const [result] = await pool.query(getEmail, [email]);
            const foundUser = result[0];

            if (!foundUser)
                return res.status(204).json({ message: "No email found, please re-enter email." });

            const userId = foundUser.userId
            console.log(userId)

            const url = req.headers['referer'] + "resetPwd?token="
            sendEmail(userId, email, url, "Reset Password")

            res.status(200).json({ message: "Email sent" });
        } else {
            return res.status(400).json({ message: "No userid found. Please sign up again" });
        }


    } catch (e) {
        console.error(e)
        res.status(500).json({ message: "Email was not sent due to an error" });
    }
}

const verifyResent = async (req, res, next) => {
    console.log("verifyResent")
    try {

        const userid = jwt.verify(req.query.token, process.env.EMAIL_SECRET).user

        return res.status(200).json(userid);

    } catch (e) {
        console.error(e)
        if (e.name == "JsonWebTokenError" || e.name == "TokenExpiredError") {
            res.status(409).json({ message: "Invalid validation" });
            return
        } else {
            res.status(500).json({ message: "Unknown error" });
        }
    }
}

const changePwd = async (req, res, next) => {
    console.log("chnagePwd")
    try {

        const { password, userid } = req.body

        console.log(password, userid)
        const newPassword = await bcrypt.hash(password, 10);

        const changePwdQuery = `UPDATE User SET userPassword = ? WHERE userId = ?`

        const [result] = await pool.query(changePwdQuery, [newPassword, userid]);

        const affectedRows = result.affectedRows
        console.log(affectedRows,"purr")

        if (affectedRows != 0) {
            return res.sendStatus(200)
        } else {
            return res.sendStatus(304)
        }

    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    sendResetLink,
    verifyResent,
    changePwd
};

