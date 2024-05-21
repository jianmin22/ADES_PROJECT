const express = require("express");
const router = express.Router();
const userEmail = require("../../models/email") 

router.get("/:uuid", userEmail);

module.exports = router;
