const pool = require("../config/databaseConfig");
const { v4: uuidv4 } = require("uuid");

module.exports.createNewInquiry = async function createNewInquiry(
	email,
	subject,
	inquiry
) {
	const inquiryId = uuidv4();
	const results = await pool.query(
		`INSERT INTO Inquiry (inquiryId, email, subject, inquiry) VALUES (?,?,?,?)`,
		[inquiryId, email, subject, inquiry]
	);
	return results[0];
};
module.exports.getAllInquiry = async function getAllInquiry() {
	const results = await pool.query(
		`SELECT * FROM Inquiry ORDER BY createdAt DESC`
	);
	return results[0];
};

module.exports.searchInquiry = async function searchInquiry(searchInput) {
	const formattedSearchInput = `%${searchInput}%`;
	const results = await pool.query(
		`SELECT * FROM Inquiry WHERE subject LIKE ? OR email LIKE ? ORDER BY createdAt DESC`,
		[formattedSearchInput, formattedSearchInput]
	);
	return results[0];
};
module.exports.getSpecificInquiry = async function getSpecificInquiry(
	inquiryId
) {
	const results = await pool.query(
		`SELECT * FROM Inquiry WHERE inquiryId = ?`,
		inquiryId
	);
	return results[0][0];
};
module.exports.markAsReplied = async function markAsReplied(inquiryId) {
	const results = await pool.query(
		`UPDATE Inquiry SET status = ? WHERE inquiryId = ?`,
		[0, inquiryId]
	);
	return { results: results[0].affectedRows };
};
