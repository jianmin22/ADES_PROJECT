const pool = require("../config/databaseConfig");

const Dashboard = {
    getStats: async () => {
        let conn;
        try {
            conn = await pool.getConnection();

            let results = {};

            // 1. Life (Sales, Orders, Users)
            const getStats = () => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const [rows, fields] = await conn.query(
                            `SELECT COUNT(DISTINCT(u.userId)) as users, COUNT(DISTINCT(th.transactionId)) as orders, (SELECT COALESCE(SUM(totalAmount), 0) FROM TransactionHistory WHERE state="success") as sales FROM User u, TransactionHistory th WHERE th.state="success" AND u.role = "customer"`
                        );
                        resolve(rows[0]);
                    } catch (e) {
                        reject(e);
                    }
                });
            };

            // 2. Get Orders
            const getOrders = () => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const currentDate = new Date();

                        const date = new Date(currentDate);
                        date.setDate(currentDate.getDate() - 6);
                        const singaporeDate = date
                            .toLocaleString("en-SG", {
                                timeZone: "Asia/Singapore",
                            })
                            .split(",")[0];
                        let start = singaporeDate
                            .split("/")
                            .reverse()
                            .join("-");

                        const [rows, fields] = await conn.query(
                            `
                            SELECT COUNT(transactionId) AS Orders, DATE(transactionDate) AS OrderDate
                            FROM TransactionHistory
                            WHERE DATE(transactionDate) >= ?
                            AND state = "success"
                            GROUP BY DATE(transactionDate)
                            ORDER BY OrderDate DESC LIMIT 7;
                            `,
                            [start]
                        );

                        let formatted = {};
                        rows.forEach(
                            (order) =>
                                (formatted[order.OrderDate] = order.Orders)
                        );

                        resolve(formatted);
                    } catch (e) {
                        reject(e);
                    }
                });
            };

            // 3. Popular Products
            const getPopular = () => {
                return new Promise(async (resolve, reject) => {
                    try {
                        let [rows, fields] = await conn.query(
                            `
                            SELECT p.productId, p.productName, COUNT(th.transactionId) as sales
                            FROM TransactionHistory_item thi, TransactionHistory th, Products p 
                            WHERE 
                            p.productId = thi.productId 
                            AND th.transactionId = thi.transactionId
                            AND th.state = "success"
                            GROUP BY p.productId
                            ORDER BY sales DESC
                            LIMIT 3
                            ;
                            `
                        );

                        let top3 = rows.map((product) => product.productId);
                        top3 = top3.length === 0 || !top3 ? [""] : [...top3]

                        let [rows1, fields1] = await conn.query(
                            `
                            SELECT COUNT(th.transactionId) as sales
                            FROM TransactionHistory_item thi, TransactionHistory th, Products p 
                            WHERE 
                            p.productId = thi.productId 
                            AND
                            p.productId NOT IN 
                            (
                                ?
                            )
                            AND th.transactionId = thi.transactionId
                            ;
                            `,
                            [top3]
                        );

                        let others =
                            rows1.length > 0
                                ? { productName: "Others", ...rows1[0] }
                                : null;

                        let results = [...rows, others];

                        resolve(results);
                    } catch (e) {
                        reject(e);
                    }
                });
            };

            const getRecent = () => {
                return new Promise(async (resolve, reject) => {
                    try {
                        let [rows, fields] = await conn.query(
                            `
                            SELECT 
                            transactionDate as transactionTime, 
                            transactionId, 
                            totalAmount, 
                            state 
                            FROM 
                            TransactionHistory 
                            ORDER BY 
                            transactionDate 
                            DESC 
                            LIMIT 15;
                            ;
                            `
                        );

                        resolve(rows);
                    } catch (e) {
                        reject(e);
                    }
                });
            };

            const getCustomers = () => {
                return new Promise(async (resolve, reject) => {
                    try {
                        let [rows, fields] = await conn.query(
                            `
                            SELECT 
                            u.Username, 
                            COUNT(th.transactionId) as TotalOrders, 
                            SUM(totalAmount) as TotalSpent, 
                            DATE(u.DateJoined) as DateJoined,
                            (SELECT DATE(transactionDate) FROM TransactionHistory ORDER BY transactionDate DESC LIMIT 1) as LastTransaction
                            FROM 
                            TransactionHistory th, 
                            User u 
                            WHERE 
                            th.state = "success"
                            AND th.userId = u.UserId 
                            GROUP BY 
                            th.userId 
                            LIMIT 15;
                            ;
                            `
                        );

                        resolve(rows);
                    } catch (e) {
                        reject(e);
                    }
                });
            };

            let [sales, orders, popular, recents, customers] = await Promise.all([
                getStats(),
                getOrders(),
                getPopular(),
                getRecent(),
                getCustomers()
            ]);

            results.sales = sales;
            results.orders = orders;
            results.popular = popular;
            results.recents = recents;
            results.customers = customers;

            return results;
        } catch (e) {
            console.error(e);
            throw e;
        } finally {
            if (conn) conn.release();
        }
    },
};

module.exports = Dashboard;
