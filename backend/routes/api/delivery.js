const express = require("express");
const router = express.Router();
const delivery = require("../../models/Delivery");
const isValidDateFormat = require("../../../backend/utils/isValidDateFormat");
router
  .get("/deliveryOrder/:Date", async (req, res) => {
    const Date = req.params.Date;

    if (Date == "null" || !isValidDateFormat(Date)) {
      res.status(400).send({ message: "Invalid Date parameter" });
    } else {
      try {
        const result = await delivery.getDeliveryOrder(Date);
        console.log(result);

        // Create a map to group delivery orders by their unique IDs
        const deliveryOrdersMap = new Map();

        result.forEach((order) => {
          // Check if the delivery order ID is already present in the map
          if (deliveryOrdersMap.has(order.DeliveryId)) {
            // If it exists, retrieve the existing order object
            const existingOrder = deliveryOrdersMap.get(order.DeliveryId);

            // Add the product details to the existing order's products array
            existingOrder.products.push({
              productName: order.productName,
              quantity: order.quantity,
              uri: order.uri,
            });
          } else {
            // If the delivery order ID is not in the map, create a new order object
            const newOrder = {
              DeliveryId: order.DeliveryId,
              DeliveryStatus: order.DeliveryStatus,
              deliveredDate: order.deliveredDate,
              transactionId: order.transactionId,
              username: order.username,
              address: `${order.unitNumber},${order.street},${order.postalCode},${order.country}`,
              products: [
                {
                  productName: order.productName,
                  quantity: order.quantity,
                  uri: order.uri,
                },
              ],
            };

            // Add the new order object to the map
            deliveryOrdersMap.set(order.DeliveryId, newOrder);
          }
        });

        // Convert the map values to an array
        const deliveryOrders = Array.from(deliveryOrdersMap.values());
        res.status(200).json(deliveryOrders);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  })

  .get("/transactionWithoutDeliveryOrder/:Date", async (req, res) => {
    const Date = req.params.Date;

    if (Date == "null" || !isValidDateFormat(Date)) {
      res.status(400).send({ message: "Invalid Date parameter" });
    } else {
      try {
        const result = await delivery.getTransactionWithoutDelivery(Date);
        console.log("raw data", result);
        const transactionsMap = new Map();

        result.forEach((order) => {
          // Check if the transaction ID is already present in the map
          if (transactionsMap.has(order.transactionId)) {
            // If it exists, retrieve the existing order object
            const existingOrder = transactionsMap.get(order.transactionId);

            // Add the product details to the existing order's products array
            existingOrder.products.push({
              productName: order.productName,
              quantity: order.quantity,
              uri: order.uri,
            });
          } else {
            // If the transaction ID is not in the map, create a new order object
            const newOrder = {
              transactionId: order.transactionId,
              username: order.username,
              transactionDate: order.transactionDate,
              address: `${order.unitNumber},${order.street},${order.postalCode},${order.country}`,
              products: [
                {
                  productName: order.productName,
                  quantity: order.quantity,
                  uri: order.uri,
                },
              ],
            };

            // Add the new order object to the map
            transactionsMap.set(order.transactionId, newOrder);
          }
        });

        // Convert the map values to an array
        const transactions = Array.from(transactionsMap.values());
        res.status(200).json(transactions);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  })
  .get("/pendingOrder", async (req, res) => {
    try {
      const result = await delivery.getPendingDeliveryOrder();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .delete("/deliveryOrder/:deliveryID", async (req, res) => {
    try {
      const deliveryID = req.params.deliveryID;
      if (deliveryID == null || deliveryID.length == 0) {
        res.status(400).send({ message: "Invalid deliveryId parameter" });
      }
      const result = await delivery.DeleteDeliveryOrder(deliveryID);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .put("/updateDeliveryStatus/:DeliveryID/:status", async (req, res) => {
    try {
      const DeliveryID = req.params.DeliveryID;
      const status = req.params.status;
      if (DeliveryID == null || DeliveryID.length == 0) {
        res.status(400).send({ message: "Invalid CustomerId parameter" });
      }
      if (status == "Success" || status == "Delivering" || status == "Failed") {
        const result = await delivery.updateDeliveryStatus(DeliveryID, status);
        if (result.affectedRows == 1) {
          res
            .status(200)
            .json({ message: `Delivery status updated to ${status}` });
        } else {
          res.status(400).json({
            message: `There is no delivery order with deliveryID: ${DeliveryID}`,
          });
        }
      } else {
        res.status(400).send({ message: "Invalid status parameter" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .post("/createDeliveryOrder/:transactionID", async (req, res) => {
    try {
      const transactionID = req.params.transactionID;
      if (transactionID == null || transactionID.length == 0) {
        res.status(400).send({ message: "Invalid transactionId parameter" });
      }
      const result = await delivery.createOrder(transactionID);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
module.exports = router;
