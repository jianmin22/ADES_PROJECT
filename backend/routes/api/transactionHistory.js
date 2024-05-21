const express = require("express");
const router = express.Router();
const transactionHistory = require("../../models/TransactionHistory");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .get("/", async (req, res) => {
    try {
      const result = await transactionHistory.allTransaction();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .get("/:transactionId", verifyRoles("customer"), async (req, res) => {
    const transactionId = req.params.transactionId;
    if (!transactionId) {
      res.status(400).send({ message: "Invalid transactionId parameter" });
      return;
    } else {
      try {
        const result = await transactionHistory.getTransactionById(transactionId);
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  })
  // Get specific user's transaction history (TODELETE)
  .get("/:userId/:page", verifyRoles("customer"), async (req, res) => {
    const userId = req.params.userId;
    const page = req.params.page;
    if (!userId) {
      res.status(400).send({ message: "Invalid userId parameter" });
      return;
    } else if (!page) {
      res.status(400).send({ message: "Invalid page parameter" });
      return;
    } else {
      try {
        const result =
          await transactionHistory.getUserTransactionHistoryDetails(
            userId,
            page
          );
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  })
  // Get specific user's transaction history failed status
  .get("/:userId/:page/failed", verifyRoles("customer"), async (req, res) => {
    const userId = req.params.userId;
    const page = req.params.page;
    if (!userId) {
      res.status(400).send({ message: "Invalid userId parameter" });
      return;
    } else if (!page) {
      res.status(400).send({ message: "Invalid page parameter" });
      return;
    } else {
      try {
        const result =
          await transactionHistory.getFailedTransactionHistoryDetails(
            userId,
            page
          );
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  })
  // Get specific user's transaction history with delivery state
  .get("/:userId/:page/:status", verifyRoles("customer"), async (req, res) => {
    const userId = req.params.userId;
    const page = req.params.page;
    const status = req.params.status;
    if (!userId) {
      res.status(400).send({ message: "Invalid userId parameter" });
      return;
    } else if (!page) {
      res.status(400).send({ message: "Invalid page parameter" });
      return;
    } else if (!status) {
      res.status(400).send({ message: "Invalid status parameter" });
      return;
    } else if (
      !(status == "Pending" || status == "Delivering" || status == "Success")
    ) {
      res.status(400).send({ message: "Invalid status parameter" });
      return;
    } else {
      try {
        const result =
          await transactionHistory.getUserStateTransactionHistoryDetails(
            userId,
            page,
            status
          );
        res.status(200).json(result);
      } catch (error) {
        console.log("error:" + error);
        res.status(500).json({ message: error.message });
      }
    }
  });
module.exports = router;
