const express = require("express");
const verifyRoles = require("../../middleware/verifyRoles");
const router = express.Router();
const Announcements = require("../../models/Announcements");

router.post("/search", verifyRoles("admin"), async (req, res) => {
    try {
        const { title, page } = req.body;
        const response = await Announcements.search(title, page);

        res.status(200).send(response);
    } catch (e) {
        console.log(e);
        console.error(`ERROR HAS OCCURED AT "${__dirname}": ${e}`);
        res.status(500).send({ message: e.message });
    }
});

router.post("/create", verifyRoles("admin"), async (req, res) => {
    try {
        const { title, delta, userId, mailing } = req.body;
        const response = await Announcements.create(
            title,
            delta,
            userId,
            mailing
        );

        res.status(200).send(response);
    } catch (e) {
        console.log(e);
        console.error(`ERROR HAS OCCURED AT "${__dirname}": ${e}`);
        res.status(500).send({ message: e.message });
    }
});

router.delete("/delete/:announcement_id", async (req, res) => {
    try {
        const response = await Announcements.deleteOne(
            req.params.announcement_id
        );

        res.status(200).send(response);
    } catch (e) {
        console.log(e);
        console.error(`ERROR HAS OCCURED AT "${__dirname}": ${e}`);
        res.status(500).send({ message: e.message });
    }
});

module.exports = router;
