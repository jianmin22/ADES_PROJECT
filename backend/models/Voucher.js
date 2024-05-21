const pool = require("../config/databaseConfig");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports.retrieveVoucher = async function retrieveVoucher(voucherID) {
	const sql = `SELECT * FROM Voucher WHERE voucherID=? ;`;
	const [result, fields] = await pool.query(sql, [voucherID]);
	return result;
};

module.exports.retrieveAllVoucher = async function retrieveAllVoucher() {
	const sql = `SELECT * FROM Voucher WHERE NOT voucherType = ? ORDER BY expiryDate ASC`;
	const [result, fields] = await pool.query(sql, ["Points Voucher"]);
	return result;
};

module.exports.searchVoucher = async function searchVoucher(search_input) {
	const sql_search = `SELECT * FROM Voucher WHERE (voucherID LIKE ? OR voucherName LIKE ?) AND NOT voucherType = ? ORDER BY expiryDate ASC`;
	const [result, fields] = await pool.query(sql_search, [
		`%${search_input}%`,
		`%${search_input}%`,
		"Points Voucher",
	]);

	return result;
};

// Get the voucher from the user's cart
module.exports.getVoucher = async function getVoucher(cart_id) {
	const sql = `SELECT v.* FROM Cart c
  JOIN Voucher v ON c.voucherID = v.voucherID
  WHERE c.cart_id = ?`;
	const [results, fields] = await pool.query(sql, [cart_id]);
	return results[0];
};

module.exports.getVoucherbyCustID = async function getVoucherbyCustID(cust_id) {
	//to test for whether users first time making purchase and to award voucher

	const sql_NoConditionVoucher = `SELECT v.voucherID, v.voucherName, v.minSpend, v.voucherType, v.voucherValue, v.expiryDate  FROM Voucher AS v WHERE v.expiryDate > (NOW() + INTERVAL 8 HOUR) AND v.limitVoucher > v.redeemedQty AND (IF((SELECT COUNT(*) FROM TransactionHistory as TH where TH.userId = ?) = 0, v.voucherCondition = "First Time Customer", FALSE) OR v.voucherCondition = "null" OR v.voucherCondition = ?) ORDER BY v.expiryDate ASC`;
	const [results, fields] = await pool.query(sql_NoConditionVoucher, [
		cust_id,
		cust_id,
	]);
	return results;
};

module.exports.createVoucher = async function createVoucher(
	id,
	name,
	limit,
	expiryDate,
	expiryTime,
	voucherType,
	voucherValue,
	minSpend,
	condition
) {
	let expiryDateTime = new Date(`${expiryDate}T${expiryTime}`);
	if (condition == undefined || condition.length == 0) {
		condition = "Null";
	}
	//Free shipping only will be logged into MySQL
	if (voucherType == "Free Shipping") {
		const sql_createVoucher = `INSERT INTO Voucher (voucherID, voucherName, limitVoucher, expiryDate, voucherType, voucherValue, minSpend, voucherCondition) VALUES (?,?,?,?,?,?,?,?)`;
		const [createdCouponSQL, fields] = await pool.query(sql_createVoucher, [
			id,
			name,
			limit,
			expiryDateTime,
			voucherType,
			voucherValue,
			minSpend,
			condition,
		]);
		return createdCouponSQL;
	}
	//For Fixed Value and Percent Vouchers
	let couponBody = {
		id: id,
		currency: "sgd",
		name: name,
		duration: "once",
		max_redemptions: limit,
		redeem_by: Math.floor(expiryDateTime.getTime() / 1000),
	};

	if (voucherType == "Percentage") {
		voucherValue = voucherValue.toFixed(1);
		couponBody.percent_off = voucherValue;
	} else if (voucherType == "Fixed Value") {
		voucherValue = parseInt(voucherValue);
		couponBody.amount_off = voucherValue * 100;
	}
	const sql_createVoucher = `INSERT INTO Voucher (voucherID, voucherName, limitVoucher, expiryDate, voucherType, voucherValue, minSpend, voucherCondition) VALUES (?,?,?,?,?,?,?,?)`;
	const createdCouponStripe = stripe.coupons.create(couponBody);
	const createdCouponSQL = pool.query(sql_createVoucher, [
		id,
		name,
		limit,
		expiryDateTime,
		voucherType,
		voucherValue,
		minSpend,
		condition,
	]);
	await Promise.allSettled([createdCouponStripe, createdCouponSQL]).then(
		async (results) => {
			if (results[0].status == "rejected" && results[1].status == "rejected") {
				if (
					results[0].status == "rejected" &&
					results[1].status == "rejected"
				) {
					throw {
						message: {
							Stripe: results[0].reason.code,
							SQL: results[1].reason.code,
						},
					};
				} else if (results[0].status == "rejected") {
					throw {
						message: {
							Stripe: results[0].reason.code,
						},
					};
				} else {
					throw {
						message: {
							SQL: results[1].reason.code,
						},
					};
				}
			} else if (results[1].status == "rejected") {
				try {
					const deletedCoupon = await stripe.coupons.del(id);
				} catch (error) {
					console.log(error);
					throw { message: `MySQL Error, Stripe operation rollback failed!` };
				}
				throw { message: `MySQL Error, Stripe operation rollbacked` };
			} else if (results[0].status == "rejected") {
				await pool.query("DELETE FROM Voucher WHERE voucherID = ?", id);

				throw { message: `Stripe Error, MySQL operation rollbacked.` };
			} else {
				return "Successfully Created Coupon";
			}
		}
	);
};

module.exports.deleteVoucher = async function deleteVoucher(coupon_id, type) {
	if (type == "Free Shipping") {
		const sql_deleteVoucher = `DELETE FROM Voucher WHERE voucherID = ?`;
		const [results, fields] = await pool.query(sql_deleteVoucher, [coupon_id]);
		return results;
	}

	const connection = await pool.getConnection();
	try {
		await connection.beginTransaction();
		const sql_deleteVoucher = `DELETE FROM Voucher WHERE voucherID = ?`;
		const resultsSQL = await connection.query(sql_deleteVoucher, coupon_id);
		try {
			await stripe.coupons.del(coupon_id);
			await connection.commit();
		} catch (error_Stripe) {
			await connection.rollback();
			throw error_Stripe;
		}
	} catch (error) {
		throw { message: error };
	} finally {
		connection.release();
	}
};

module.exports.redeemVoucher = async function updateVoucher(
	voucher_id,
	subTotal
) {
	const sql = `UPDATE Voucher SET redeemedQty = redeemedQty + 1 WHERE voucherID = ? AND expiryDate > (NOW() + INTERVAL 8 HOUR) AND limitVoucher > redeemedQty AND  ? >= minSpend`;
	const [results, fields] = await pool.query(sql, [voucher_id, subTotal]);

	return results;
};

module.exports.checkVoucherById = async function getVoucherbyCustID(
	voucher_id,
	subTotal
) {
	//to test for whether users first time using the app and to award voucher

	const sql_NoConditionVoucher = `SELECT v.voucherID, v.voucherName, v.minSpend, v.voucherType, v.voucherValue  FROM Voucher AS v WHERE v.expiryDate > (NOW() + INTERVAL 8 HOUR) AND v.limitVoucher > v.redeemedQty AND voucherID = ? AND ? >= v.minSpend `;
	const [results, fields] = await pool.query(sql_NoConditionVoucher, [
		voucher_id,
		subTotal,
	]);
	return results;
};

module.exports.rollbackVoucherRedemption =
	async function rollbackVoucherRedemption(voucher_id) {
		const sql_rollbackVoucherRedemption = `UPDATE Voucher SET redeemedQty = redeemedQty - 1 WHERE voucherID = ?`;
		const [results, fields] = await pool.query(sql_rollbackVoucherRedemption, [
			voucher_id,
		]);
		return results;
	};

module.exports.editVoucher = async function editVoucher(id, name) {
	const connection = await pool.getConnection();
	try {
		await connection.beginTransaction();
		const sql_editVoucher = `UPDATE Voucher SET voucherName = ? WHERE voucherID = ?`;
		const resultsSQL = await connection.query(sql_editVoucher, [name, id]);
		try {
			const couponStripe = await stripe.coupons.retrieve(id);
			await stripe.coupons.update(id, {
				name: name,
			});
			await connection.commit();
		} catch (error_Stripe) {
			await connection.rollback();
			throw error_Stripe;
		}
	} catch (error) {
		throw { message: error };
	} finally {
		connection.release();
	}
};
