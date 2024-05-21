const express = require("express");
const verifyRoles = require("../../middleware/verifyRoles");
const router = express.Router();
const conversation = require("../../models/Conversation");

router.get("/start", verifyRoles(["customer"]), (req, res) => {});

module.exports = router;
