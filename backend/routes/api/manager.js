const express = require("express");
const router = express.Router();
const verifyRoles = require("../../middleware/verifyRoles");
const auth = require("../../models/authentication");

//TO REMOVE
router
    .post("/", () => console.log("post ran"));

module.exports = router;