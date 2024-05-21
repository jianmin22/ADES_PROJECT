const express = require("express");
const router = express.Router();
const inquiryFunctions = require("../../models/Inquiry");
const verifyRoles = require("../../middleware/verifyRoles");

router.get("/all", async function (req, res) {
	try {
		const results = await inquiryFunctions.getAllInquiry();
		res.status(200).send(results);
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: error.message });
	}
});

router.get("/:inquiryId", async function (req, res) {
	let inquiryId = req.params.inquiryId;
	if (!inquiryId || inquiryId == "null" || inquiryId == null) {
		res.status(400).send({ message: "Invalid parameters" });
		return;
	}
	try {
		const results = await inquiryFunctions.getSpecificInquiry(inquiryId);
		res.status(200).send(results);
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: error.message });
	}
});

router.get("/search/:searchInput", async function (req, res) {
	let searchInput = req.params.searchInput;
	if (!searchInput || searchInput == "null" || searchInput == null) {
		res.status(400).send({ message: "Invalid parameters" });
		return;
	}
	try {
		const results = await inquiryFunctions.searchInquiry(searchInput);
		res.status(200).send(results);
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: error.message });
	}
});

router.put("/replied/:inquiryId", async function (req, res) {
	let inquiryId = req.params.inquiryId;
	if (!inquiryId || inquiryId == "null" || inquiryId == null) {
		res.status(400).send({ message: "Invalid parameters" });
		return;
	}
	try {
		const results = await inquiryFunctions.markAsReplied(inquiryId);
		res.status(200).send(results);
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: error.message });
	}
});

router.post("/create", async function (req, res) {
	let email = req.body.email;
	let subject = req.body.subject;
	let inquiry = req.body.inquiry;
	console.log(email);
	console.log(subject);
	console.log(inquiry);
	if (
		!email ||
		email == "null" ||
		email == null ||
		!subject ||
		subject == "null" ||
		subject == null ||
		!inquiry ||
		inquiry == "null" ||
		inquiry == null
	) {
		res.status(400).send({ message: "Invalid parameters" });
	} else {
		try {
			const result = await inquiryFunctions.createNewInquiry(
				email,
				subject,
				inquiry
			);
			res.status(200).send(result);
		} catch (error) {
			console.log(error);
			res.status(500).send({ message: error.message });
		}
	}
});

module.exports = router;
