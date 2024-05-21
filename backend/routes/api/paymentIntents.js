require("dotenv").config();
const express = require("express");
const stripe = require("stripe");
const verifyRoles = require("../../middleware/verifyRoles");

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const address = require("../../models/Address");
const transactionHistory = require("../../models/TransactionHistory");
const transactionItems = require("../../models/TransactionItems");
const products = require("../../models/Product");
const router = express.Router();
router
// Do payment
.post("/", verifyRoles("customer"), async (req, res) => {
    const {
      selectedCartItems,
      subtotal,
      totalAmount,
      discount,
      voucherId,
      stripeToken,
      userId,
      deliveryFee,
      addressId,
    } = req.body;
    let transactionId = null;
    let paymentIntentId = null;
    let paymentIntent =null;
    function isFloatNumber(value) {
      if (typeof value === "number" && !isNaN(value) && isFinite(value)) {
        // Check if it is a valid number
        return true;
      }
      return false;
    }
  
    function isNotNullOrUndefined(value) {
      return value !== null && value !== undefined;
    }
  
    if (!selectedCartItems) {
      res.status(400).send({ message: "Invalid selectedCartItems body" });
      return;
    } else if (!userId) {
      res.status(400).send({ message: "Invalid userId body" });
      return;
    } else if (!stripeToken) {
      res.status(400).send({ message: "Invalid stripeToken body" });
      return;
    } else if (!addressId) {
      res.status(400).send({ message: "Invalid addressId body" });
      return;
    } else if (isNotNullOrUndefined(subtotal) && isFloatNumber(subtotal)) {
      res.status(400).send({ message: "Invalid subtotal body" });
      return;
    } else if (isNotNullOrUndefined(totalAmount) && isFloatNumber(totalAmount)) {
      res.status(400).send({ message: "Invalid totalAmount body" });
      return;
    } else if (isNotNullOrUndefined(deliveryFee) && isFloatNumber(deliveryFee)) {
      res.status(400).send({ message: "Invalid deliveryFee body" });
      return;
    } else if (isNotNullOrUndefined(discount) && isFloatNumber(discount)) {
      res.status(400).send({ message: "Invalid discount body" });
      return;
    }
  
    // Get address info
    try {
      var addressInfo;
      try {
        const result = await address.getAddress(addressId);
        addressInfo =
          result.country +
          " " +
          result.postalCode +
          ", " +
          result.street +
          ", #" +
          result.unitNumber;
      } catch (error) {
        res.status(400).send({ message: "Unable to get address" });
        return;
      }
      // Create payment intent
      const paymentAmount = Math.round(parseFloat(totalAmount) * 100);
      paymentIntent = await stripe(stripeSecretKey).paymentIntents.create({
        amount: paymentAmount,
        currency: "sgd",
        description: "Huang's bakery online order",
        payment_method_types: ["card"],
        payment_method: stripeToken,
        confirm: true,
        metadata: {
          selectedCartItems: JSON.stringify(selectedCartItems),
          subtotal: subtotal,
          deliveryFee: deliveryFee,
          discount: discount,
          totalAmount: totalAmount,
          voucherId: voucherId,
          address: addressInfo,
        },
      });
      paymentIntentId = paymentIntent.id;
      const clientSecret = paymentIntent.client_secret;

      // insert transaction details into database if succeed
      if (paymentIntent.status === "succeeded") {
        const pointsEarned = Math.floor(parseFloat(totalAmount));
        try {
          const result = await transactionHistory.insertTransactionHistory(
            subtotal,
            totalAmount,
            voucherId,
            "success",
            pointsEarned,
            userId,
            addressId,
            paymentIntentId
          );
          transactionId = result.transactionId;
        } catch (error) {
          await rollbackTransaction(paymentIntentId);
        }
        try {
          const result = await transactionItems.insertTransactionItems(
            transactionId,
            selectedCartItems
          );
        } catch (error) {
          await rollbackTransaction(paymentIntentId);
        }

        try {
          const result = await products.updateProductQuantity(
            selectedCartItems
          );
        } catch (error) {
          await rollbackTransaction(paymentIntentId);
        }
      
        res.status(201).json({
          transactionId: transactionId,
          clientSecret: clientSecret,
          state: "success",
        });
      } else {
        await rollbackTransaction(paymentIntentId);
      }
    } catch (error) {
      if (paymentIntentId) {
        console.log(error);
        await rollbackTransaction(paymentIntentId);
      } else {
        try {
          const result = await transactionHistory.insertTransactionHistory(
            subtotal,
            totalAmount,
            voucherId,
            "failed",
            0,
            userId,
            addressId,
            paymentIntentId
          );
          transactionId = result.transactionId;
        } catch (error) {
          res.status(500).send({ message: "Payment Failed" });
          return;
        }
        try {
          const result = await transactionItems.insertTransactionItems(
            transactionId,
            selectedCartItems
          );
        } catch (error) {
          res.status(500).send({ message: "Payment Failed" });
          return;
        }
        console.log(error);
        res.status(500).send({ message: "Payment Failed" });
      }
    }
  // Undo payment and delete inserted transaction history from database
    async function rollbackTransaction(paymentIntentId) {
      try {
        if (transactionId !== null) {
          await transactionHistory.deleteTransactionHistory(transactionId);
          transactionId = null;
        }
      } catch (error) {
        console.error("Failed to delete transaction history:", error);
      }
  
      try {
        if (paymentIntent.status === "succeeded") {
          await stripe(stripeSecretKey).refunds.create({
            payment_intent: paymentIntentId,
          });
        }
      } catch (error) {
        console.error("Failed to undo Stripe transaction:", error);
        res.status(500).send({
          message: "Failed to refund with no history",
        });
        return;
      }
  
      try {
        await transactionHistory.deleteTransactionHistory(transactionId);
      } catch (error) {
        console.error("Failed to delete failed transaction history:", error);
      }
  
      try {
        const result = await transactionHistory.insertTransactionHistory(
          subtotal,
          totalAmount,
          voucherId,
          "failed",
          0,
          userId,
          addressId,
          paymentIntentId
        );
        transactionId = result.transactionId;
      } catch (error) {
        console.error("Failed to insert failed transaction history:", error);
        res.status(500).send({ message: "Payment Failed" });
        return;
      }
  
      try {
        await transactionItems.insertTransactionItems(
          transactionId,
          selectedCartItems
        );
      } catch (error) {
        console.error("Failed to insert failed transaction items:", error);
      }
      res.status(500).send({ message: "Payment Failed" });
    }
  });
  module.exports = router