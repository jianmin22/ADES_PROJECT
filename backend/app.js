const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const verifyJWT = require("./middleware/verifyJWT");
require("dotenv").config();
const customers = require("./models/Customers");
const address = require("./models/Address");
const manager = require("./models/Manager");
const report = require("./models/Report");
const delivery = require("./models/Delivery");
const allowedOrigins = require("./config/allowedOrigins");
const axios = require('axios');
// const { use } = require("./routes/root");

app.use(
	cors({
		origin: allowedOrigins,
		credentials: true,
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(function (req, res, next) {
	res.header("Content-Type", "application/json;charset=UTF-8");
	res.header("Access-Control-Allow-Credentials", true);
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

// Using JWT ===========================
app.use(verifyJWT);
//=====================================

// for Routes ==========================================
app.use("/shop", require("./routes/api/shop"));
app.use("/auth", require("./routes/api/auth"));
app.use("/register", require("./routes/api/register"));
app.use("/refresh", require("./routes/api/refresh"));
app.use("/voucher", require("./routes/api/voucher"));
app.use("/cart", require("./routes/api/cart"));
app.use("/review", require("./routes/api/review"));
app.use("/payment_intents", require("./routes/api/paymentIntents"));
app.use("/product", require("./routes/api/product"));
app.use("/logout", require("./routes/api/logout"));
app.use("/transactionHistory", require("./routes/api/transactionHistory"));
app.use(
	"/transactionHistoryItem",
	require("./routes/api/transactionHistoryItem")
);
app.use("/delivery", require("./routes/api/delivery"));
app.use("/points", require("./routes/api/points"));
app.use("/report", require("./routes/api/report"));
app.use("/address", require("./routes/api/address"));
app.use("/userinfo", require("./routes/api/user"));
app.use("/conversation", require("./routes/api/conversation"));
app.use("/dashboard", require("./routes/api/dashboard"));
app.use("/confirmation", require("./routes/api/confirmation"));
app.use("/resend", require("./routes/api/resend"));
app.use("/changeEmail", require("./routes/api/changeEmail.js"));
app.use("/showEmail", require("./routes/api/showEmail.js"));
app.use("/chat", require("./routes/api/chat"));
app.use("/game", require("./routes/api/game"));
app.use("/reset", require("./routes/api/reset"));
app.use("/inquiry", require("./routes/api/inquiry"));
app.use("/public/announcements", require("./routes/api/announcements-public"))
app.use("/announcements", require("./routes/api/announcements"))
app.use("/mail", require("./routes/api/mailingList"))
//========================================================

app.get("/", (req, res) => {
	res.status(200).send("meow!");
});

// TESTING TO REMOVE ======================================
app.get("/users", async function (req, res) {
	try {
		const userId = req.userId;
		const result = await customers.selectAll(userId);
		res.status(200).send(result);
	} catch (error) {
		res.status(500).send({ message: error.message });
	}
});

// ================ START OF TEMPORARY ENDPOINT ================
const pool = require("./config/databaseConfig");
// Temporary Endpoint #1 - Add all products in DB to Stripe Products
app.post("/addToStripe", async (req, res) => {
    try {
        const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

        let conn = await pool.getConnection();
        var [results, fields] = await conn.query(
            "SELECT p.productId, p.productDesc, p.price, p.productName, c.category as categoryName FROM Products p INNER JOIN Category c ON p.categoryId = c.categoryId;"
        );
        conn.release();

        var createdProducts = [];
        for (const r of results) {
            let prod = await stripe.products.create({
                id: r.productId,
                name: r.productName,
                description: r.productDesc,
                metadata: {
                    category: r.categoryName,
                    currency: "SGD",
                    price: r.price,
                },
            });
            createdProducts.push(prod);
        }

        res.status(200).send({
            created_count: createdProducts.length,
            created_items: createdProducts,
        });
    } catch (e) {
        console.error("ERROR: " + e.message);
        res.status(500).send({ message: e.message });
    }
});

// Temporary Endpoint #2 - Delete all from Stripe products
app.delete("/deleteAllFromStripe", async (req, res) => {
    try {
        const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
        let response;
        let deleted = [];
        let count = 1;
        do {
            response = await stripe.products.list();

            for (const p of response.data) {
                await stripe.products.del(p.id);

                console.log("DELETED " + p.id + " " + p.name);
                deleted.push({
                    id: p.id,
                    name: p.name,
                });

                count++;
            }
        } while (response.data.length != 0);
        deleted = deleted.length == 0 ? "no items are deleted" : deleted;
        res.status(200).send({
            deleted_item_count: typeof deleted != "string" ? deleted.length : 0,
            deleted_items: deleted,
        });
    } catch (e) {
        console.log(e);
    }
});

// ================ END OF TEMP ENDPOINTS ================


//====================================================

// transactionHistory
// Update transaction history after success payment
// app.put("/transactionHistory/:transactionId", async function (req, res) {
//   let transactionId = req.params.transactionId;
//   if (!transactionId || transactionId == "null") {
//     res.status(400).send({ message: "Invalid transactionId parameter" });
//   } else {
//     try {
//       const updatedTransaction = await payment.updateTransactionHistory(
//         transactionId
//       );
//       res.status(200).send(updatedTransaction);
//     } catch (error) {
//       res.status(500).send({ message: error.message });
//     }
//   }
// });

// For Google ReCaptcha
app.post("/verify-token", async (req,res) => {
	const { reCAPTCHA_TOKEN, Secret_Key} = req.body;
	
	try {
	  let response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${Secret_Key}&response=${reCAPTCHA_TOKEN}`);
	  console.log(response.data);
  
	  return res.status(200).json({
		success:true,
		message: "Token successfully verified",
		verification_info: response.data
	  });
	} catch(error) {
	  console.log(error);
  
	  return res.status(500).json({
		success:false,
		message: "Error verifying token"
	  })
	}
  });
  

module.exports = app;
