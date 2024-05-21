const express = require("express");
const router = express.Router();
const cart = require("../../models/Cart");
const verifyRoles = require("../../middleware/verifyRoles");

router
    // get cartId with userId
    .get("/:userId/cartId", verifyRoles("customer"), async function (req, res) {
        console.log(req.params.userId);
        let userId = req.params.userId;
        if (!userId || userId == "null") {
            res.status(400).send({ message: "Invalid userId parameter" });
        } else {
            try {
                const result = await cart.getCartId(userId);
                res.status(200).send(result);
            } catch (error) {
                res.status(500).send({ message: error.message });
            }
        }
    })

    // reset cart selections for product and voucher
    .put("/:cart_id/reset", verifyRoles("customer"), async function (req, res) {
        let cart_id = req.params.cart_id;
        if (!cart_id || cart_id == "null") {
            res.status(400).send({ message: "Invalid cart_id parameter" });
        } else {
            try {
                const result = await cart.resetSelectedAndVoucher(cart_id);
                res.status(200).send(result);
            } catch (error) {
                res.status(500).send({ message: error.message });
            }
        }
    })

    // Get All Cart Items from Cart_Id
    .get(
        "/cartItems/:cart_id",
        verifyRoles("customer"),
        async function (req, res) {
            let cart_id = req.params.cart_id;
            if (!cart_id || cart_id == "null") {
                res.status(400).send({ message: "Invalid cart_id parameter" });
            } else {
                try {
                    const result = await cart.retrieveAllItemsCart(cart_id);
                    res.status(200).send(result);
                } catch (error) {
                    res.status(500).send({ message: error.message });
                }
            }
        }
    )

    // Update quantity of cart_Items
    .put(
        "/cartItems/:cartItemId/quantity",
        verifyRoles("customer"),
        async function (req, res) {
            let cartItemId = req.params.cartItemId;
            let qty = req.body.qty;
            if (!cartItemId || cartItemId == "null") {
                res.status(400).send({
                    message: "Invalid cartItem_id parameter",
                });
            } else if (!qty || isNaN(parseInt(qty))) {
                res.status(400).send({ message: "Invalid Qty parameter" });
            } else {
                try {
                    const result = await cart.updateQty(cartItemId, qty);
                    res.status(200).send(result);
                } catch (error) {
                    res.status(500).send({ message: error.message });
                }
            }
        }
    )

    // Update selected to be true for the selectedItems
    .put("/cartItems", verifyRoles("customer"), async function (req, res) {
        let cartItemIds = req.body.cartItemIds;
        let cartId = req.body.cartId;

        if (!cartItemIds) {
            res.status(400).send({ message: "Invalid cartItemIds parameter" });
            return;
        } else if (!cartId) {
            res.status(400).send({ message: "Invalid cartId parameter" });
            return;
        }

        try {
            const result = await cart.updateSelected(cartItemIds, cartId);
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    })

    // Delete cartItems from cart
    .delete(
        "/cartItems/:cartItemId",
        verifyRoles("customer"),
        async function (req, res) {
            let cartItemId = req.params.cartItemId;
            if (!cartItemId || cartItemId == "null") {
                res.status(400).send({
                    message: "Invalid cartItem_Id parameter",
                });
            } else {
                try {
                    const result = await cart.deleteCartItem(cartItemId);
                    res.status(204).send(result);
                } catch (error) {
                    res.status(500).send({ message: error.message });
                }
            }
        }
    )

    // Get Checkout information
    .get(
        "/cartItems/:cart_id/selected",
        verifyRoles("customer"),
        async function (req, res) {
            let cart_id = req.params.cart_id;
            if (!cart_id || cart_id == "null") {
                res.status(400).send({ message: "Invalid cart_id parameter" });
            } else {
                try {
                    // Get the items in the cart
                    const cartItems = await cart.getSelectedCartItems(cart_id);
                    res.status(200).send({ cartItems });
                } catch (error) {
                    res.status(500).send({ message: error.message });
                }
            }
        }
    )

    // Show the recommendations based on user's cart
    .get(
        "/recommendation/:cart_id",
        verifyRoles("customer"),
        async function (req, res) {
            let cart_id = req.params.cart_id;
            if (!cart_id || cart_id == "null") {
                res.status(400).send({ message: "Invalid cart_id parameter" });
            } else {
                try {
                    const result = await cart.retrieveRecommendation12(cart_id);
                    res.status(200).send(result);
                } catch (error) {
                    res.status(500).send({ message: error.message });
                }
            }
        }
    )
    // Update voucher in cart
    .put(
        "/:voucherID/carts/:cart_id",
        verifyRoles("customer"),
        async function (req, res) {
            let voucherID = req.params.voucherID;
            let cart_id = req.params.cart_id;

            if (!cart_id || cart_id == "null") {
                res.status(400).send({ message: "Invalid cart_id parameter" });
                return;
            }

            try {
                if (!voucherID || voucherID == "null") {
                    voucherID = null;
                }

                const result = await cart.updateVoucher(voucherID, cart_id);
                res.status(200).send(result);
            } catch (error) {
                res.status(500).send({ message: error.message });
            }
        }
    )

    // Delete all selected cart items
    .delete(
        "/:cart_id/selected",
        verifyRoles("customer"),
        async function (req, res) {
            let cart_id = req.params.cart_id;

            if (!cart_id || cart_id == "null") {
                res.status(400).send({ message: "Invalid cart_id parameter" });
                return;
            }
            try {
                const result = await cart.deleteAllSelectedItems(cart_id);
                res.status(200).send(result);
            } catch (error) {
                res.status(500).send({ message: error.message });
            }
        }
    )

    // reset voucher to null
    .put(
        "/:cart_id/voucher/reset",
        verifyRoles("customer"),
        async function (req, res) {
            let cart_id = req.params.cart_id;

            if (!cart_id || cart_id == "null") {
                res.status(400).send({ message: "Invalid cart_id parameter" });
                return;
            } else {
                try {
                    const result = await cart.updateVoucherToNull(cart_id);
                    res.status(200).send(result);
                } catch (error) {
                    res.status(500).send({ message: error.message });
                }
            }
        }
    );

// cart/:cart_id/add/:product_id/
router.post(
    "/:cart_id/add/:product_id",
    verifyRoles("customer"),
    async (req, res) => {
        try {
            let { userId, qty } = req.body;
            if (
                !userId ||
                qty == undefined ||
                !req.params.product_id ||
                req.params.cart_id == undefined
            )
                throw new Error("Invalid input!");
            const addToCart = await cart.addProductToCart(
                req.params.product_id,
                req.params.cart_id,
                userId,
                qty
            );

            if (!addToCart) throw new Error("addProductToCart error!");

            res.status(200).send({ success: true });
        } catch (e) {
            console.error(`ERROR HAS OCCURED AT "${__dirname}": ${e}`);
            res.status(500).send({ error_msg: e.message });
        }
    }
);

router.get("/:cart_id/info", verifyRoles("customer"), async (req, res) => {
    try {
        let { cart_id } = req.params;

        if (!Number.isInteger(parseInt(cart_id))) throw new Error("Invalid cart!");

        const cart_info = await cart.getCartInfo(cart_id);

        res.status(200).send(cart_info);
    } catch (e) {
        console.error(`ERROR HAS OCCURED AT "${__dirname}": ${e}`);
        res.status(500).send({ error_msg: e.message });
    }
});

module.exports = router;
