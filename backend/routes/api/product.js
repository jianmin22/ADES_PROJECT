const express = require("express");
const router = express.Router();
const Product = require("../../models/Product");
const verifyRoles = require("../../middleware/verifyRoles");

const { v4: uuidv4 } = require("uuid");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/products");
  },
  filename: (req, file, callback) => {
    const uniqueSuffix = uuidv4();
    callback(null, uniqueSuffix + "___" + file.originalname);
  },
});

const upload = multer({ storage });

// router.get("/:productId", async function (req, res) {
//     let productId = req.params.productId;
//     if (!productId || productId == "null") {
//         res.status(400).send({ message: "Invalid productId parameter" });
//     } else {
//         try {
//             const result = await Product.getProduct(productId);
//             res.status(200).send(result);
//         } catch (error) {
//             res.status(500).send({ message: error.message });
//         }
//     }
// });

router.post("/create", async (req, res) => {
  try {
    let { name, price, category, stock, description, cost } = req.body;
    //  string types = name, description
    // number types = price, category, stock, cost

    if (
      !name ||
      !description ||
      isNaN(price) ||
      !Number.isInteger(parseFloat(category)) ||
      !Number.isInteger(parseFloat(stock)) ||
      isNaN(cost)
    )
      throw new Error("Invalid fields detected!");

    [price, cost, category, stock] = [
      parseFloat(price),
      parseFloat(cost),
      parseInt(category),
      parseInt(stock),
    ];
    if (price < 0 || category < 0 || stock < 0 || cost < 0)
      throw new Error("Invalid price or category data!");

    const results = await Product.create({
      name,
      price,
      category,
      stock,
      description,
      cost,
    });

    if (!results)
      throw new Error(`Failed to create new product with Name: ${name}`);

    res.status(200).send({ success: results });
  } catch (e) {
    console.log(e);
    console.error(`ERROR HAS OCCURED AT "${__dirname}": ${e}`);
    res.status(500).send({ message: e.message });
  }
});

router.get("/stripe", async (req, res) => {
  try {
    if (req.query.active != "true" && req.query.active != "false")
      throw new Error("Invalid parameters");
    active = req.query.active === "true";
    const results = (await Product.allStripeProducts(active)).map(
      (prod) => prod.id
    );

    res.status(200).send(results);
  } catch (e) {
    console.log(e);
    console.error(`ERROR HAS OCCURED AT "${__dirname}": ${e}`);
    res.status(500).send({ message: e.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const results = await Product.all();

    res.status(200).send(results);
  } catch (e) {
    console.log(e);
    console.error(`ERROR HAS OCCURED AT "${__dirname}": ${e}`);
    res.status(500).send({ message: e.message });
  }
});

router.get("/:product_id/images", async (req, res) => {
  try {
    const results = await Product.getImage(req.params.product_id);

    res.status(200).send(results);
  } catch (e) {
    console.log(e);
    console.error(`ERROR HAS OCCURED AT "${__dirname}": ${e}`);
    res.status(500).send({ message: e.message });
  }
});

router.put("/:product_id/", async (req, res) => {
  try {
    let { name, price, category, stock, description, cost } = req.body;

    if (
      !req.params.product_id ||
      !name ||
      !description ||
      isNaN(price) ||
      !Number.isInteger(parseFloat(category)) ||
      !Number.isInteger(parseFloat(stock)) ||
      isNaN(cost)
    )
      throw new Error("Invalid field datatype!");

    [price, cost, category, stock] = [
      parseFloat(price),
      parseFloat(cost),
      parseInt(category),
      parseInt(stock),
    ];
    if (price < 0 || category < 0 || stock < 0 || cost < 0)
      throw new Error("Invalid price or category data!");

    const hasUpdated = await Product.updateProduct(req.params.product_id, {
      name,
      price,
      category,
      stock,
      description,
      cost,
    });

    if (!hasUpdated)
      throw new Error("Error has occured while trying to update product!");

    res.status(200).send({ success: hasUpdated });
  } catch (e) {
    console.log(e);
    console.error(`ERROR HAS OCCURED AT "${__dirname}": ${e}`);
    res.status(500).send({ message: e.message });
  }
});

router.post(
  "/:product_id/images/upload",
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.params.product_id) throw new Error("Invalid parameters!");
      if (!req.file) throw new Error("Multer failed to upload!");
      const response = await Product.uploadImage(
        req.file,
        req.params.product_id
      );

      if (!response) throw new Error("Failed to upload image!");

      res.status(200).send({ success: response });
    } catch (e) {
      console.log(e);
      console.error(`ERROR HAS OCCURED AT "${__dirname}": ${e}`);
      res.status(500).send({ message: e.message });
    }
  }
);

router.delete("/:product_id/images/delete", async (req, res) => {
  try {
    if (!req.params.product_id) throw new Error("Invalid parameters!");
    const response = await Product.deleteImage(req.params.product_id);

    if (!response) throw new Error("Failed to delete image!");

    res.status(200).send({ success: response });
  } catch (e) {
    console.log(e);
    console.error(`ERROR HAS OCCURED AT "${__dirname}": ${e}`);
    res.status(500).send({ message: e.message });
  }
});

router.put("/:product_id/stripe/", async (req, res) => {
  try {
    const { active } = req.body;
    console.log(active, req.params.product_id);
    if (!req.params.product_id || (active != true && active != false))
      throw new Error("Invalid parameters!");
    const response = Product.updateProductStatus(req.params.product_id, active);

    if (!response) throw new Error("Failed update product status!");

    res.status(200).send({ success: response });
  } catch (e) {
    console.log(e);
    console.error(`ERROR HAS OCCURED AT "${__dirname}": ${e}`);
    res.status(500).send({ message: e.message });
  }
});

router.delete("/:product_id/delete", async (req, res) => {
  try {
    if (!req.params.product_id) throw new Error("Invalid productID!");

    const successfulDelete = await Product.deleteProduct(req.params.product_id);

    if (!successfulDelete) throw new Error("Failed to delete product!");

    res.status(200).send({ success: successfulDelete });
  } catch (e) {
    console.log(e);
    console.error(`ERROR HAS OCCURED AT "${__dirname}": ${e}`);
    res.status(500).send({ message: e.message });
  }
});

router.get(
  "/getProductByID/:product_id",
  async (req, res) => {
    const product_id = req.params.product_id;
    if (!product_id) {
      res.status(400).send({ message: "Invalid product_id parameter" });
      return;
    } else {
      try {
        const result = await Product.getProduct(product_id);
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  }
);

module.exports = router;
