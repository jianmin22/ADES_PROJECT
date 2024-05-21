const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const pool = require("../config/databaseConfig");
const jwt = require("jsonwebtoken");
const sendEmail = require("../middleware/emailSending");

const handleNewUser = async (req, res) => {
	let { user, pwd, email, bday } = req.body;

	if (!user || !pwd || !email)
		return res
			.status(400)
			.json({ message: "Username, password and email are all required" });

	if (!bday || bday == undefined) {
		bday = null;
	}

	const getUserQuery = `SELECT username, userPassword, role FROM User WHERE username=?;`;
	const insertUserQuery = `INSERT INTO User (userId, username, userPassword, birthday, verified, role, rfToken, email, dateJoined) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(6))`;

	try {
		const [duplicate, fields] = await pool.query(getUserQuery, [user]);

		// If there is a duplicate, give conflict error
		if (duplicate[0]) return res.sendStatus(409);

		// encrypt the password
		const hashedPwd = await bcrypt.hash(pwd, 10);

		// create UUID for the user
		const uuid = uuidv4();

		const result = await pool.execute(insertUserQuery, [
			uuid,
			user,
			hashedPwd,
			bday,
			0,
			"customer",
			null,
			email,
		]);

		//Email sending -----------------------------------------

		const url = req.headers["referer"] + "confirmation?token=";
		const emailSent = await sendEmail(uuid, email, url, "Email Confirmation");

		console.log("It reached here: line 309");
		console.log("This is the status of the email sent: " + emailSent);

		//if Email was not sent
		if (!emailSent) {
			return res
				.status(207)
				.json({
					message:
						"User insertion was a success, but email could not be sent to",
				});
		}

		if (result[0].affectedRows === 1) {
			// set the uuid in the cookie for email verification in case of resend/ change of email
			res.cookie("uuid", uuid, {
				httpOnly: true,
				sameSite: "Strict",
				maxAge: 5 * 60 * 1000,
				// for 5 minutes
			});

			return res.status(201).json({ uuid: uuid });
		} else {
			console.log("User insertion failed");
			return res.status(500).json({ error: "User insertion failed" });
		}
	} catch (err) {
		if (err.errno === 1062) {
			return res.sendStatus(409);
		}
		return res.status(500).json({ error: err.message });
	}
};

const handleNewCart = async (req, res) => {
	const { userId } = req.body;
	const insertCartQuery = `INSERT INTO Cart (userId) VALUES (?);`;

	try {
		const [rows] = await pool.query(insertCartQuery, [userId]);
		const affectedRows = rows.affectedRows;

		if (affectedRows > 0) {
			res.status(200).json({ message: "Cart created successfully" });
		} else {
			console.log("Failed to create cart");
			res.status(500).json({ error: "Failed to create cart" });
		}
	} catch (err) {
		console.log("Failed to create cart 500");
		res.status(500).json({ error: "Something went wrong" });
	}
};

const handleNewPoints = async (req, res) => {
	const { userId } = req.body;
	const insertPointQuery = `INSERT INTO PointSystem (userId) VALUES (?);`;

	try {
		const [rows] = await pool.query(insertPointQuery, [userId]);
		const affectedRows = rows.affectedRows;

		if (affectedRows > 0) {
			res.status(200).json({ message: "Cart created successfully" });
		} else {
			console.log("Failed to create new points");
			res.status(500).json({ error: "Failed to create Points" });
		}
	} catch (err) {
		console.log("Failed to create new points 500");
		res.status(500).json({ error: "Something went wrong" });
	}
};

module.exports = {
	handleNewUser,
	handleNewCart,
	handleNewPoints,
};
