const express = require("express");
const verifyRoles = require("../../middleware/verifyRoles");
const voucher = require("../../models/Voucher");
const router = express.Router();

// Retrieve all voucher details
router
	.get("/", verifyRoles(["admin", "admin"]), async function (req, res) {
		try {
			const result = await voucher.retrieveAllVoucher();
			res.status(200).send(result);
		} catch (error) {
			res.status(500).send({ message: error.message });
		}
	})
	//Get specific voucher
	.get(
		"/:voucherID",
		verifyRoles(["customer", "admin", "admin"]),
		async function (req, res) {
			let voucherID = req.params.voucherID;
			if (!voucherID || voucherID == "null") {
				res.status(400).send({ message: "Invalid voucherID parameter" });
			} else {
				try {
					const result = await voucher.retrieveVoucher(voucherID);
					if (result.length == 0) {
						res.status(404).send({ message: "Voucher does not exist" });
					} else {
						res.status(200).send(result);
					}
				} catch (error) {
					res.status(500).send({ message: error.message });
				}
			}
		}
	)
	//get available vouchers by customer
	.get(
		"/customer/:customerID",
		verifyRoles(["customer", "admin", "admin"]),
		async function (req, res) {
			let customerID = req.params.customerID;
			if (customerID == "null" || customerID.length == 0) {
				res.status(400).send({ message: "Customer ID is invalid" });
				return;
			}

			try {
				const result = await voucher.getVoucherbyCustID(customerID);

				if (result.length == 0) {
					res.status(404).send({ message: "No available vouchers" });
				} else {
					res.status(200).send(result);
				}
			} catch (error) {
				console.log(error);
				res.status(500).send({ message: error.message });
			}
		}
	)
	//Get voucher by the cartid
	.get(
		"/cart/:cartId",
		verifyRoles(["customer", "admin", "admin"]),
		async function (req, res) {
			let cartId = req.params.cartId;
			if (!cartId || cartId == "null") {
				res.status(400).send({ message: "Invalid cartId parameter" });
			} else {
				try {
					const result = await voucher.getVoucher(cartId);
					res.status(200).send(result);
				} catch (error) {
					res.status(500).send({ message: error.message });
				}
			}
		}
	)
	.get(
		"/search/:search_input",
		verifyRoles(["admin", "admin"]),
		async function (req, res) {
			const search_input = req.params.search_input;
			if (search_input == undefined || search_input.length == 0) {
				res.status(400).send("Bad Request");
			}
			try {
				const results = await voucher.searchVoucher(search_input);
				res.status(200).send(results);
				return;
			} catch (error) {
				res.status(500).send({ message: error.message });
			}
		}
	)
	.post(
		"/check/:voucher_id",
		verifyRoles(["customer", "admin", "admin"]),
		async function (req, res) {
			let voucher_id = req.params.voucher_id;
			let subTotal = req.body.subTotal;
			if (subTotal == undefined || subTotal.length == 0 || isNaN(subTotal)) {
				res.status(400).send({ message: "Invalid subTotal" });
				return;
			}
			try {
				const checkVoucherById = await voucher.checkVoucherById(
					voucher_id,
					parseFloat(subTotal)
				);
				if (checkVoucherById.length == 0) {
					res.status(422).send({
						message: `Voucher has been fully redeemed, expired or requirements are not met!`,
					});
					return;
				}
				res.status(200).send(checkVoucherById);
			} catch (error) {
				res.status(500).send({ message: error.message });
			}
		}
	)
	.post(
		"/create",
		verifyRoles(["admin", "admin"]),
		async function (req, res) {
			let id = req.body.id;
			let name = req.body.name;
			let limit = req.body.limit;
			let expiryDate = req.body.expiryDate;
			let expiryTime = req.body.expiryTime;
			let voucherType = req.body.voucherType;
			let voucherValue = req.body.voucherValue;
			let minSpend = req.body.minSpend;
			let condition = req.body.condition;

			if (
				id == undefined ||
				id.length == 0 ||
				name == undefined ||
				name.length == 0 ||
				limit == undefined ||
				limit.length == 0 ||
				isNaN(limit) ||
				!Number.isInteger(limit) ||
				expiryTime == undefined ||
				expiryTime.length == 0 ||
				(voucherType != "Percentage" &&
					voucherType != "Free Shipping" &&
					voucherType != "Fixed Value") ||
				voucherValue == undefined ||
				voucherValue.length == 0 ||
				isNaN(voucherValue) ||
				!Number.isFinite(voucherValue) ||
				minSpend == undefined ||
				minSpend.length == 0 ||
				isNaN(minSpend) ||
				!Number.isFinite(minSpend) ||
				!(
					condition == undefined ||
					condition == "First Time Customer" ||
					condition.length == 0
				)
			) {
				res.status(400).send({ message: "Values in body are invalid" });
				return;
			}

			if (
				expiryDate == undefined ||
				expiryDate.length == 0 ||
				new Date(expiryDate) == "Invalid Date" ||
				!isNaN(expiryDate)
			) {
				res.status(400).send({ message: "Date is invalid" });
				return;
			}
			if (new Date(`${expiryDate}T${expiryTime}`) < new Date()) {
				res.status(400).send({ message: "Voucher cannot expire in the past" });
				return;
			}

			try {
				const createdVoucher = await voucher.createVoucher(
					id,
					name,
					limit,
					expiryDate,
					expiryTime,
					voucherType,
					voucherValue,
					minSpend,
					condition
				);

				res.status(201).send(createdVoucher);
			} catch (error) {
				console.log(error);
				res.status(500).send({ message: error.message });
			}
		}
	)
	.put(
		"/redeem/:voucher_id",
		verifyRoles(["customer", "admin", "admin"]),
		async function (req, res) {
			const voucher_id = req.params.voucher_id;
			const subTotal = req.body.subTotal;
			if (subTotal == undefined || subTotal.length == 0 || isNaN(subTotal)) {
				res.status(500).send({ message: `subTotal is undefined` });
				return;
			}
			try {
				const redeemVoucher = await voucher.redeemVoucher(voucher_id, subTotal);
				if (redeemVoucher.affectedRows == 0) {
					res.status(422).send({
						message: `Voucher has been fully redeemed, expired or requirements are not met!`,
					});
					return;
				}
				res
					.status(200)
					.send({ message: `Voucher ${voucher_id} has been redeemed` });
				return;
			} catch (error) {
				console.log(error);
				res.status(500).send({ message: error.message });
			}
		}
	)
	.put(
		"/edit",
		verifyRoles(["admin", "admin"]),
		async function (req, res) {
			let id = req.body.id;
			let name = req.body.name;

			if (
				id == undefined ||
				id.length == 0 ||
				name == undefined ||
				name.length == 0
			) {
				res.status(400).send({ message: "Values in body are invalid" });
				return;
			}

			try {
				const editVoucher = await voucher.editVoucher(id, name);

				res.status(201).send(editVoucher);
			} catch (error) {
				res.status(500).send({ message: error.message });
			}
		}
	)
	.delete(
		"/delete",
		verifyRoles(["admin", "admin"]),
		async function (req, res) {
			const coupon_id = req.body.coupon_id;
			const type = req.body.type;

			if (coupon_id == undefined || coupon_id == "") {
				res.status(400).send({ message: "coupon_id is undefined" });
				return;
			} else if (
				!(
					type == "Free Shipping" ||
					type == "Fixed Value" ||
					type == "Percentage"
				)
			) {
				res.status(400).send({ message: "type is undefined or Not Valid" });
				return;
			}

			try {
				const deletedVoucher = await voucher.deleteVoucher(coupon_id, type);
				console.log(deletedVoucher);
				res.status(200).send(deletedVoucher);
			} catch (error) {
				console.log(error);
				res.status(500).send({ message: error.message });
			}
		}
	)
	.delete(
		"/rollback/:voucher_id",
		verifyRoles(["admin", "admin"]),
		async function (req, res) {
			const voucher_id = req.params.voucher_id;

			if (voucher_id == undefined || voucher_id.length == 0) {
				res.status(400).send({ message: "Bad Request" });
				return;
			}
			try {
				const rollbackVoucher = await voucher.rollbackVoucherRedemption(
					voucher_id
				);

				if (rollbackVoucher.affectedRows == 0) {
					res.status(503).send({ message: "Unable to delete voucher" });
					return;
				}
				res.status(200).send({
					message: `Redemption of Voucher ${voucher_id} has been rollbacked`,
				});
				return;
			} catch (error) {
				res.status(500).send({ message: error.message });
			}
		}
	);

module.exports = router;
