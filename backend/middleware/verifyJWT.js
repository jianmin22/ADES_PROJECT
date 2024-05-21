const jwt = require("jsonwebtoken");
require("dotenv").config();

const protectedRoutes = [
	"/manager",
	"/users",
	"/voucher",
	"/userinfo",
	"/transactionHistory",
	"/transactionHistoryItem",
	"/cart",
	"/payment_intents",
	"/address",
	"/points",
	"/admin",
	"/review",
	"/conversation",
	"/dashboard",
	"/chat",
	"/dashboard",
	"/announcements"
];

const verifyJWT = (req, res, next) => {
	const urlCalled = req.originalUrl;
	let protected = false;

	console.log("This is the url called: " + urlCalled);

	protectedRoutes.forEach((e) => {
		// console.log("/" + urlCalled.split("/")[1])
		if (
			urlCalled.includes(e) &&
			protectedRoutes.includes("/" + urlCalled.split("/")[1])
		)
			protected = true;
	});

	// console.log(protected ? "protected" : "unprotected")

	if (!protected) {
		console.log("This url is not protected")
		next();
		return;
	}

	const authHeader = req.headers.authorization || req.headers.Authorization;
	
	if (!authHeader?.startsWith("Bearer "))
		// forbidden if request does not have header
		return res.sendStatus(401);

	const token = authHeader.split(" ")[1];

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		if (err) return res.sendStatus(403);

		// invalid token
		req.userId = decoded.UserInfo.userId;
		req.role = decoded.UserInfo.role;

		next();
	});
};

module.exports = verifyJWT;
