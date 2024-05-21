const pool = require("../config/databaseConfig");
const { v4: uuidv4 } = require("uuid");

module.exports.chatSocketFunctions = function chatSocketFunctions(socket) {
	socket.on("disconnect", () => {});

	socket.on("send_message", async (message) => {
		try {
			await pool.query(
				"INSERT INTO ChatMessages (chatId, userId, message, sentAt) VALUES (?,?,?,?)",
				[message.chatId, message.userId, message.message, message.sentAt]
			);
		} catch (error) {}
		socket.to(message.chatId).emit("received_message", message);
	});
	socket.on("close_chat", (chatId) => {
		socket.to(chatId).emit("close_chat");
	});
	socket.on("createNewRoom", async (data) => {
		const chatID = uuidv4();

		await pool.query(
			`INSERT INTO Chat (chatId, userId, topic) VALUES (?,?,?)`,
			[chatID, data.userId, data.topic]
		);

		return { chatId: data.userId, topic: data.topic };
	});

	socket.on("joinRoom", (roomId) => {
		socket.join(roomId);
		console.log("joined");
	});
};

module.exports.getUsersChats = async function getUsersChats(userId) {
	const results = await pool.query(
		`SELECT chatId, status, topic FROM Chat WHERE userId = ?`,
		userId
	);

	return results[0];
};

module.exports.getChatMessages = async function getChatMessages(chatId) {
	const results = await pool.query(
		`SELECT * FROM ChatMessages WHERE chatId = ?`,
		chatId
	);
	return results[0];
};

module.exports.createNewChat = async function createNewChat(userId, topic) {
	const chatID = uuidv4();

	await pool.query(`INSERT INTO Chat (chatId, userId, topic) VALUES (?,?,?)`, [
		chatID,
		userId,
		topic,
	]);

	return { chatId: chatID, topic: topic };
};

module.exports.searchChats = async function searchChats(searchInput) {
	const formattedSearch = `%${searchInput}%`;
	const results = await pool.query(
		`SELECT * FROM Chat WHERE topic LIKE ? ORDER BY createdAt DESC`,
		formattedSearch
	);
	return results[0];
};

module.exports.managerGetChats = async function getChats() {
	const results = await pool.query(
		`SELECT * FROM Chat ORDER BY createdAt DESC`
	);

	return results[0];
};

module.exports.closeChat = async function closeChat(chatId) {
	const results = await pool.query(
		`UPDATE Chat SET status = 0 WHERE chatId = ?`,
		chatId
	);
	return results[0];
};
