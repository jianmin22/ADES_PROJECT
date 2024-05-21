const jwt = require('jsonwebtoken');
require("dotenv").config();
const pool = require("../config/databaseConfig");

const verifyUser = async (req, res, next) => {
    console.log("verifyUser was called")

    console.log(process.env.EMAIL_SECRET)
    try {
        const userid = jwt.verify(req.params.token, process.env.EMAIL_SECRET).user
        console.log("This is the userId",userid)
        const userVerified = `UPDATE User SET verified = 1 WHERE (userId = ?);`;
        const [result] = await pool.query(userVerified, [userid]);
        const foundUser = result[0];
        if (! foundUser) 
            return res.status(204).json({message: "No name records found for email verification."});

        res.status(200).send({msg:'OK'});
    } catch (e) {
        if (e.errno == 1054) {
            res.status(409).json({message: "No name records found for email verification."});
        }
        console.error(e)
        if (e.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired.' });
        } else if (e.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Verification Error' });
        }

        return res.status(500).json({message: "Invalid verification"});

    }
}

module.exports = verifyUser