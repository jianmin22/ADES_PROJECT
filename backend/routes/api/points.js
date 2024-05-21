const express = require("express");
const verifyRoles = require("../../middleware/verifyRoles");
const router = express.Router();
const pointsFunctions = require("../../models/Points");

router
	.get(
		"/user/:userId",
		verifyRoles(["customer", "admin", "admin"]),
		async (req, res) => {
			const userId = req.params.userId;
			//validation
			if (userId == undefined || userId.length == 0) {
				res.status(400).send("Bad request");
				return;
			}
			try {
				const results = await pointsFunctions.userData(userId);
				res.status(200).send(results);
			} catch (error) {
				console.log(error.message);
				res.status(500).send({ message: error.message });
			}
		}
	)
	.get("/allusers", verifyRoles(["admin", "admin"]), async (req, res) => {
		try {
			const results = await pointsFunctions.allUsers();
			res.status(200).send(results);
		} catch (error) {
			res.status(500).send({ message: error.message });
		}
	})
	.get(
		"/uservoucher/:userId",
		verifyRoles(["admin", "admin"]),
		async (req, res) => {
			const userId = req.params.userId;
			//validation
			if (userId == undefined || userId.length == 0) {
				res.status(400).send("Bad request");
				return;
			}
			try {
				const results = await pointsFunctions.usersPointVouchers(userId);
				res.status(200).send(results);
			} catch (error) {
				res.status(500).send({ message: error.message });
			}
		}
	)
	.get(
		"/usertransactions/:userId",
		verifyRoles(["customer", "admin", "admin"]),
		async (req, res) => {
			const userId = req.params.userId;
			//validation
			if (userId == undefined || userId.length == 0) {
				res.status(400).send("Bad request");
				return;
			}
			try {
				const results = await pointsFunctions.usersTransactions(userId);
				res.status(200).send(results);
			} catch (error) {
				res.status(500).send({ message: error.message });
			}
		}
	)
	.get(
		"/search/username/:search_input",
		verifyRoles(["admin", "admin"]),
		async (req, res) => {
			const search_input = req.params.search_input;

			if (search_input == undefined || search_input.length == 0) {
				res.status(400).send("Bad request");
				return;
			}
			try {
				const results = await pointsFunctions.searchByUserName(search_input);
				res.status(200).send(results);
			} catch (error) {
				res.status(500).send({ message: error.message });
			}
		}
	);

router.post(
	"/createvoucher",
	verifyRoles(["customer", "admin", "admin"]),
	async (req, res) => {
		let userId = req.body.userId;
		let voucherValue = req.body.voucherValue;

		if (
			userId == undefined ||
			userId.length == 0 ||
			!(voucherValue == 50 || voucherValue == 10 || voucherValue == 20)
		) {
			res.status(400).send({ message: "Values in body are invalid" });
			return;
		}
		try {
			const results = await pointsFunctions.createVoucherByPoints(
				userId,
				voucherValue
			);
			res.status(201).send("Voucher Has been created");
		} catch (error) {
			res.status(500).send({ message: error.message });
		}
	}
);

router.post(
	"/alterpoints",
	verifyRoles(["customer", "admin", "admin"]),
	async (req, res) => {
		const userId = req.body.userId;
		const points = req.body.points;
		const type = req.body.type;
		const remarks = req.body.remarks;

		if (
			type == undefined ||
			type.length == 0 ||
			userId == undefined ||
			userId.length == 0 ||
			points == undefined ||
			points.length == 0 ||
			isNaN(points) ||
			remarks == undefined ||
			remarks.length == 0
		) {
			res.status(400).send("Bad request");
			return;
		}
		if (!(type == 1 || type == 0)) {
			res.status(400).send("Invalid parameters for type");
			return;
		}
		try {
			const results = await pointsFunctions.createTransaction(
				userId,
				points,
				type,
				remarks
			);
			res.status(200).send("Success");
		} catch (error) {
			if (error == "Insufficient Points") {
				res.status(403).send({ message: error });
				return;
			}
			res.status(500).send({ message: error.message });
		}
	}
);

router.delete(
	"/voucher",
	verifyRoles(["admin", "admin"]),
	async (req, res) => {
		const userId = req.body.userId;
		const points = req.body.points;
		const voucherId = req.body.voucherId;

		if (
			userId == undefined ||
			userId.length == 0 ||
			points == undefined ||
			points.length == 0 ||
			isNaN(points) ||
			voucherId == undefined ||
			voucherId.length == 0
		) {
			res.status(400).send({ message: "Values in body are invalid" });
			return;
		}
		try {
			await pointsFunctions.deleteVoucher(voucherId, userId, points);
			res.status(200).send("Voucher Has been deleted");
		} catch (error) {
			res.status(500).send({ message: error.message });
		}
	}
);
module.exports = router;
