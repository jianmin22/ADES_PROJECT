const express = require("express");
const router = express.Router();
const resendEmail = require("../../models/resendEmail") 

router.get("/", resendEmail);

module.exports = router;
