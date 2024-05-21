const express = require("express");
const router = express.Router();
const verifyEmail = require("../../models/verifyEmail")

router.get("/:token", verifyEmail);

module.exports = router;
