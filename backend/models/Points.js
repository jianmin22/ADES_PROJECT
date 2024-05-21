const { v4: uuidv4 } = require("uuid");
const pool = require("../config/databaseConfig");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports.createTransaction = async function createTransaction(
	userId,
	points,
	type,
	remarks
) {
	const transactionId = uuidv4();
	let sql_createTransacton_ps, sql_createTransaction_pt;
	const connection = await pool.getConnection();
	if (type == 0) {
		let sql_checkAmountPoints =
			"SELECT pointsUsed, totalPoints FROM PointSystem WHERE userId = ?";
		const [checkPoints, fields] = await pool.query(
			sql_checkAmountPoints,
			userId
		);
		if (
			checkPoints[0].pointsUsed + parseInt(points) >
			checkPoints[0].totalPoints
		) {
			throw "Insufficient Points";
		}
		sql_createTransacton_ps =
			"UPDATE PointSystem SET pointsUsed = pointsUsed + ? WHERE userId = ?";
	} else if (type == 1) {
		sql_createTransacton_ps =
			"UPDATE PointSystem SET totalPoints = totalPoints + ? WHERE userId = ?";
	}
	sql_createTransaction_pt = `INSERT INTO PointsTransaction (transactionId, userId, points, type, remarks) VALUES (?,?,?,?,?)`;
	await connection.beginTransaction();

	const createdPS = connection.query(sql_createTransacton_ps, [points, userId]);
	const createdPT = connection.query(sql_createTransaction_pt, [
		transactionId,
		userId,
		points,
		type,
		remarks,
	]);
	try {
		const [resultPS, resultPT] = await Promise.all([createdPS, createdPT]);
		await connection.commit();
	} catch (error) {
		await connection.rollback();
		throw { message: "Internal Server Error" };
	} finally {
		connection.release();
	}
};

module.exports.createVoucherByPoints = async function createVoucherByPoints(
	userId,
	value
) {
	let todayDate = new Date();
	let expiryDateTime = new Date(todayDate.getTime() + 90 * 24 * 60 * 60 * 1000);

	let couponBody = {
		currency: "sgd",
		name: `$${value} Voucher`,
		duration: "once",
		max_redemptions: 1,
		amount_off: value * 100,
		redeem_by: Math.floor(expiryDateTime.getTime() / 1000),
	};

	const sql_createVoucher = `INSERT INTO Voucher (voucherID, voucherName, limitVoucher, expiryDate, voucherType, voucherValue, minSpend, voucherCondition) VALUES (?,?,?,?,?,?,?,?)`;
	const sql_deductPoints = `UPDATE PointSystem SET pointsUsed = pointsUsed + ? WHERE userId = ?`;
	const sql_logTransaction = `INSERT INTO PointsTransaction (transactionId, userId, points, type, remarks) VALUES (?,?,?,?,?)`;
	let pointsDeduct;
	switch (value) {
		case 10:
			pointsDeduct = 200;
			break;
		case 20:
			pointsDeduct = 400;
			break;
		case 50:
			pointsDeduct = 1000;
			break;
		default:
			throw { message: "Invalid Value" };
	}
	const responseStripe = await stripe.coupons.create(couponBody);
	console.log(responseStripe);
	const connection = await pool.getConnection();
	await connection.beginTransaction();
	const transactionId = uuidv4();

	const createVoucher_query = connection.query(sql_createVoucher, [
		responseStripe.id,
		`$${value} Voucher`,
		1,
		expiryDateTime,
		"Points Voucher",
		value,
		0,
		userId,
	]);
	const deductpoitns_query = connection.query(sql_deductPoints, [
		pointsDeduct,
		userId,
	]);
	const transaction_query = connection.query(sql_logTransaction, [
		transactionId,
		userId,
		pointsDeduct,
		0,
		`Redeem Voucher ${responseStripe.id}`,
	]);
	try {
		await Promise.all([
			createVoucher_query,
			deductpoitns_query,
			transaction_query,
		]);
		await connection.commit();
	} catch (error) {
		await connection.rollback();
		await stripe.coupons.del(responseStripe.id);
		throw error;
	} finally {
		connection.release();
	}
};

module.exports.userData = async function userData(userId) {
	const sqlGetUserData =
		"SELECT ps.pointsUsed, ps.totalPoints, u.username, u.userId FROM PointSystem as ps JOIN User as u ON u.userId = ps.userId WHERE ps.userId = ?";
	const [results, fields] = await pool.query(sqlGetUserData, userId);
	results[0].pointsLeft = results[0].totalPoints - results[0].pointsUsed;
	console.log(results);
	return results;
};

module.exports.allUsers = async function allUsers() {
	const sql_allUsers = `SELECT ps.userId, ps.pointsUsed, ps.totalPoints, u.username FROM PointSystem as ps JOIN User as u ON u.UserId = ps.userId`;
	const [results, fields] = await pool.query(sql_allUsers);
	return results;
};

module.exports.usersPointVouchers = async function usersPointVouchers(userId) {
	const sql_userPointsVoucher =
		"SELECT * FROM Voucher WHERE voucherCondition = ?";
	const [results, fields] = await pool.query(sql_userPointsVoucher, userId);
	return results;
};

module.exports.usersTransactions = async function usersTransactions(userId) {
	const sql_userTransaction =
		"SELECT * FROM PointsTransaction WHERE userId = ? ORDER BY timestamp DESC";
	const [results, fields] = await pool.query(sql_userTransaction, userId);
	return results;
};

module.exports.deleteVoucher = async function deleteVoucher(
	voucherId,
	userId,
	points
) {
	const connection = await pool.getConnection();
	try {
		await connection.beginTransaction();
		const sql_deleteVoucher = `DELETE FROM Voucher WHERE voucherID = ?`;
		const sql_refundPoints = `UPDATE PointSystem SET totalPoints = totalPoints + ? WHERE userId = ?`;
		const sql_logTransaction = `INSERT INTO PointsTransaction (transactionId, userId, points, type, remarks) VALUES (?,?,?,?,?)`;
		const transactionId = uuidv4();

		const resultsDeleteSQL = connection.query(sql_deleteVoucher, voucherId);
		const resultsRefund = connection.query(sql_refundPoints, [points, userId]);
		const resultsTransaction = connection.query(sql_logTransaction, [
			transactionId,
			userId,
			points,
			1,
			`Refund for voucher ${voucherId}`,
		]);
		try {
			await Promise.all([resultsDeleteSQL, resultsRefund, resultsTransaction]);
			await stripe.coupons.del(voucherId);
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

module.exports.searchByUserName = async function searchByUserName(
	search_input
) {
	const sql_searchUser = `SELECT ps.userId, ps.pointsUsed, ps.totalPoints, u.username FROM PointSystem as ps JOIN User as u ON u.UserId = ps.userId WHERE u.username LIKE ?`;
	const [results, fields] = await pool.query(
		sql_searchUser,
		`%${search_input}%`
	);
	return results;
};
