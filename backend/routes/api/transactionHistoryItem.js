const express = require("express");
const router = express.Router();
const transactionItems = require("../../models/TransactionItems");
const verifyRoles = require("../../middleware/verifyRoles");

router
// Update user review state
.put(
    "/:transactionItemId/:state/review",verifyRoles("customer"), 
    async (req, res) => {
      const transactionItemId = req.params.transactionItemId;
      const state = req.params.state;
      if(!state){
        res.status(400).send({ message: "Invalid state parameter" });
      }
      else if(state!=0&&state!=1){
        console.log(state);
        res.status(400).send({ message: "Invalid state parameter" });
      }
      if (!transactionItemId) {
        res.status(400).send({ message: "Invalid transactionItemId parameter" });
      } else {
        try {
          const result = await transactionItems.updateTransactionItemsReview(
            transactionItemId, state
          );
          res.status(200).json({ result: result });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }
    }
  );
  module.exports = router;
