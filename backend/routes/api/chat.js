const express = require("express");
const router = express.Router();
const chat = require("../../models/Chat");
const verifyRoles = require("../../middleware/verifyRoles");

router
	// get cartId with userId
	.get("/:userId", verifyRoles("customer"), async function (req, res) {
		let userId = req.params.userId;
		if (!userId || userId == "null") {
			res.status(400).send({ message: "Invalid userId parameter" });
		} else {
			try {
				const result = await chat.getUsersChats(userId);
				res.status(200).send(result);
			} catch (error) {
				console.log(error);
				res.status(500).send({ message: error.message });
			}
		}
	})
	.get(
		"/messages/:chatId",
		verifyRoles(["customer", "admin"]),
		async function (req, res) {
			let chatId = req.params.chatId;
			if (!chatId || chatId == "null") {
				res.status(400).send({ message: "Invalid chatId parameter" });
			} else {
				try {
					const result = await chat.getChatMessages(chatId);
					res.status(200).send(result);
				} catch (error) {
					console.log(error);
					res.status(500).send({ message: error.message });
				}
			}
		}
	)
	.get("/admin/allChats", verifyRoles("admin"), async function (req, res) {
		try {
			const result = await chat.managerGetChats();
			res.status(200).send(result);
		} catch (error) {
			console.log(error);
			res.status(500).send({ message: error.message });
		}
	})
	.get("/search/:searchInput", verifyRoles("admin"), async function (req, res) {
		const searchInput = req.params.searchInput;
		if (!searchInput || searchInput == "null") {
			res.status(400).send({ message: "Invalid chatId parameter" });
			return;
		}
		try {
			const result = await chat.searchChats(searchInput);
			res.status(200).send(result);
		} catch (error) {
			console.log(error);
			res.status(500).send({ message: error.message });
		}
	});

router.post("/:userId", verifyRoles("customer"), async function (req, res) {
	console.log(req.params.userId);
	let userId = req.params.userId;
	let topic = req.body.topic;
	if (
		!userId ||
		userId == "null" ||
		userId == null ||
		!topic ||
		topic == "null" ||
		topic == null
	) {
		res.status(400).send({ message: "Invalid parameters" });
	} else {
		try {
			const result = await chat.createNewChat(userId, topic);
			res.status(200).send(result);
		} catch (error) {
			console.log(error);
			res.status(500).send({ message: error.message });
		}
	}
});

router.put(
	"/close/:chatId",
	verifyRoles(["customer", "admin"]),
	async function (req, res) {
		let chatId = req.params.chatId;
		console.log("hererere");
		if (!chatId || chatId == "null") {
			res.status(400).send({ message: "Invalid chatId parameter" });
		} else {
			try {
				const result = await chat.closeChat(chatId);
				res.status(200).send(result);
			} catch (error) {
				console.log(error);
				res.status(500).send({ message: error.message });
			}
		}
	}
);

module.exports = router;
