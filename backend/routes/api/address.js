const express = require("express");
const router = express.Router();
const address = require("../../models/Address");
const verifyRoles = require("../../middleware/verifyRoles");

// Get address details with userId
router.get("/:userId", verifyRoles("customer"), async function (req, res) {
    let userId = req.params.userId;
    if (!userId || userId == "null") {
        res.status(400).send({ message: "Invalid userId parameter" });
    } else {
        try {
            const results = await address.getUserAddress(userId);
            if (results && results.length > 0) {
                const addressIds = results.map((result) => result.addressId); // Extracting addressIds from the result

                const addresses = await Promise.all(
                    addressIds.map(async (addressId) => {
                        return await address.getAddress(addressId); // Fetching addresses for each addressId
                    })
                );

                res.status(200).send(addresses);
            } else {
                res.send([]); 
            }
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    }
});

module.exports = router;
