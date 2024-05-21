const express = require("express");
const router = express.Router();
const Announcements = require("../../models/Announcements");

router.get("/all", async (req, res) => {
    try {
        const results = await Announcements.all();
        res.status(200).send(results);
    } catch (e) {
        console.log(e);
        console.error(`ERROR HAS OCCURED AT "${__dirname}": ${e}`);
        res.status(500).send({ message: e.message });
    }
});

router.get("/:announcement_id", async (req, res) => {
    try {
        const results = await Announcements.findOne(req.params.announcement_id);
        res.status(200).send(results);
    } catch (e) {
        console.log(e);
        console.error(`ERROR HAS OCCURED AT "${__dirname}": ${e}`);
        res.status(500).send({ message: e.message });
    }
})

module.exports = router;
