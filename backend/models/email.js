const jwt = require('jsonwebtoken');
require("dotenv").config();
const pool = require("../config/databaseConfig");

const userEmail = async (req, res, next) => {
    try {

        // Get the userid when endpoint is called, /userinfo/userEmail/:id
        const { uuid } = req.params
        console.log(uuid)

        const userEmailQuery = `SELECT email FROM ades_project.User WHERE userid = ?;`

        const [result] = await pool.query(userEmailQuery, uuid)
        
        // When there is no record found, give a 204 as it is the standard status for non-existent data for handling in Confrimation.js
        if (result.length == 0) {
            return res.status(204).json({ message: `No User records found.` });
        } else {
            const email = result[0].email
            return res.status(200).json(email);
        }

    } catch (e) {
        console.error(e)
         return res.sendStatus(500);
    }
}

module.exports = userEmail
