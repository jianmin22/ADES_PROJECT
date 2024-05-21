const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/databaseConfig");
require("dotenv").config();
const sendEmail = require("../middleware/emailSending")

const handleLogin = async (req, res) => {
    const cookies = req.cookies;

    console.log("Authentication ran")

    // If somehow there is still nothing in the body even after validation from front end
    const { user, pwd } = req.body;
    if (!user || !pwd)
        return res
            .status(400)
            .json({ message: "Username and password are required" });

    // RETRIEVE TO CHECK FOR DUPLICATES
    const getUserQuery = "SELECT userId, userPassword, email, role, rfToken,verified FROM User WHERE username = ?";

    // quering whether user exists
    const [rows, fields] = await pool.query(getUserQuery, [user]);
    const foundUser = rows[0];

    // If there is no such user in the database

    if (!foundUser) {
        console.log("user not found")
        return res.sendStatus(401);
    }

    // Forbidden!! How dare you not verify >:( so rude
    if (foundUser.verified === 0) {
        const url = req.headers['referer'] + "confirmation?token="
        const emailSent = await sendEmail(foundUser.userId, foundUser.email, url, "Email Confirmation");
        return res.sendStatus(403)
    }
    // unauthorized

    // evaluate password
    const match = await bcrypt.compare(pwd, foundUser.userPassword);
    if (match) {
        const role = foundUser.role;
        // no point sending the role in refresh token

        // making new accessToken
        const accessToken = jwt.sign(
            {
                UserInfo: {
                    userId: foundUser.userId,
                    role: role,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "5m" }
        );

        // Making new refresh Token
        const newRefreshToken = jwt.sign(
            {
                userId: foundUser.userId,
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
        );

        if (cookies?.refreshTokenJwt) {
            res.clearCookie('refreshTokenJwt', {
                httpOnly: true,
                sameSite: 'Strict',
                // secure: true
            })
        }

        console.log("Authentication line 62")

        res.cookie("refreshTokenJwt", newRefreshToken, {
            sameSite: "Strict",
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            // for a day
        });

        console.log("Authentication line 71 Cookie", JSON.stringify(req.cookies))

        // store this in memory
        const userId = foundUser.userId;

        res.json({ userId, role, accessToken });


    } else {
        // if password is incorrect
        console.log("Password is incorrect?")
        res.sendStatus(401);
    }
};
module.exports = {
    handleLogin,
};
