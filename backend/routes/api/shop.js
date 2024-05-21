const express = require("express");
const router = express.Router();
const Shop = require("../../models/Shop");

router.get("/categories", async (req, res) => {
    try {
        const results = await Shop.getShopCategories();
        res.status(200).send(results);
    } catch (e) {
        console.error(`ERROR HAS OCCURED AT "${__dirname}": ${e.message}`);
        res.status(500).send({ message: e.message });
    }
});

router.get("/prices/minmax", async (req, res) => {
    try {
        const results = await Shop.getMinMaxPrices();
        res.status(200).send({ min: results.min, max: results.max });
    } catch (e) {
        console.log(e);
        console.error(`ERROR HAS OCCURED AT "${__dirname}": ${e}`);
        res.status(500).send({ message: e.message });
    }
});

router.post("/search", async (req, res) => {
    try {
        const results = await Shop.search(req.body, true);
        const stripeResults = (await Shop.allStripeProducts()).map(
            (value) => value.id
        );

        // Have to manually filter and compare SQL DB Products and Stripe products
        const filtered = results.filter((value) =>
            stripeResults.includes(value.productId)
        );

        // filtered array that matches "Active" products in stripe to SQL DB
        res.status(200).send(filtered);
    } catch (e) {
        console.log(e);
        console.error(`ERROR HAS OCCURED AT "${__dirname}": ${e}`);
        res.status(500).send({ message: e.message });
    }
});

router.post("/search/count", async (req, res) => {
    try {
        const results = await Shop.getMaxResults(req.body, false);
        res.status(200).send(results);
    } catch (e) {
        console.log(e);
        console.error(`ERROR HAS OCCURED AT "${__dirname}": ${e}`);
        res.status(500).send({ message: e.message });
    }
});

router.get("/products/:id/image", async (req, res) => {
    try {
        const results = await Shop.getProductImage(req.params.id);
        res.status(200).send(results);
    } catch (e) {
        console.log(e);
        console.error(`ERROR HAS OCCURED AT "${__dirname}": ${e}`);
        res.status(500).send({ message: e.message });
    }
});

router.get("/products/:id/details", async (req, res) => {
    try {
        const results = await Shop.getProductDetails(req.params.id);
        res.status(200).send(results);
    } catch (e) {
        console.log(e);
        console.error(`ERROR HAS OCCURED AT "${__dirname}": ${e}`);
        res.status(500).send({ message: e.message });
    }
});

router.get("/products/:id/reviews", async (req, res) => {
    try {
        let results = await Shop.getProductReviews(
            req.params.id,
            req.query.sortBy,
            req.query.page
        );

        if (req.query.avg) {
            let allRatings = results.map((r) => parseFloat(r.rating));
            total = 0;
            allRatings.forEach((r) => (total += r));
            results = (total / allRatings.length).toPrecision(2);
        }
        res.status(200).send(results);
    } catch (e) {
        console.log(e);
        console.error(`ERROR HAS OCCURED AT "${__dirname}": ${e}`);
        res.status(500).send({ message: e.message });
    }
});
module.exports = router;
