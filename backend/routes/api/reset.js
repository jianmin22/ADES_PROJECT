const express = require("express");
const router = express.Router();
const { sendResetLink,
    verifyResent,
    changePwd } = require("../../models/reset")

    router.get("/email", sendResetLink);
    router.get("/verify", verifyResent);
    router.put("/changePwd", changePwd);

module.exports = router;
