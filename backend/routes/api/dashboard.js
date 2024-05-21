const express = require("express");
const verifyRoles = require("../../middleware/verifyRoles");
const router = express.Router();
const Dashboard = require("../../models/Dashboard");

router.get("/stats", verifyRoles("admin"), async (req, res) => {
    try {
        const results = await Dashboard.getStats();
        
        res.status(200).send(results);
    } catch (e) {
        console.log(e);
        console.error(`ERROR HAS OCCURED AT "${__dirname}": ${e}`);
        res.status(500).send({ message: e.message });
    }
});

module.exports = router;
