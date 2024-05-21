const pool = require("../config/databaseConfig");

const Shop = {
    getShopCategories: async () => {
        try {
            let conn = await pool.getConnection();
            const [rows, fields] = await conn.query(
                "SELECT categoryId, category as categoryName FROM Category"
            );
            conn.release();

            return rows;
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    getMinMaxPrices: async () => {
        try {
            const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
            let allProducts = [];
            let hasMore = true;
            var params = {
                limit: 100,
                active: true,
            };

            while (hasMore) {
                let products = await stripe.products.list(params);
                hasMore = products.has_more;
                allProducts = [...allProducts, ...products.data];

                if (hasMore)
                    params.starting_after =
                        allProducts[allProducts.length - 1].id;
            }

            var allPrices = allProducts.map((value) =>
                parseFloat(value.metadata.price)
            );

            return { min: Math.floor(Math.min(...allPrices)), max: Math.ceil(Math.max(...allPrices)) };
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    allStripeProducts: async () => {
        try {
            const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
            let allProducts = [];
            let hasMore = true;
            var params = {
                limit: 100,
                active: true,
            };

            while (hasMore) {
                let products = await stripe.products.list(params);
                hasMore = products.has_more;
                allProducts = [...allProducts, ...products.data];

                if (hasMore)
                    params.starting_after =
                        allProducts[allProducts.length - 1].id;
            }

            return allProducts;
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    search: async (body, useLimit) => {
        try {
            let conn = await pool.getConnection();
            var params = [];

            let statement = `SELECT p.productId, p.productDesc, p.price, p.productName, c.category FROM Products p, Category c 
                WHERE 
                ${
                    body?.category != undefined && !(body.category == "All")
                        ? `p.categoryId = ? AND `
                        : ""
                } 
                ${
                    body && body.maxPrice > 0 && !isNaN(body.maxPrice)
                        ? `p.price  <= ?  AND `
                        : ""
                }
                ${
                    !body?.searchString != undefined
                        ? `p.productName 
                like 
                ?
                AND `
                        : ""
                }
                p.categoryId = c.categoryId 
                ${
                    body &&
                    body.orderBy &&
                    (body.orderBy === "ASC" || body.orderBy === "DESC")
                        ? `ORDER BY p.price ${body.orderBy} `
                        : ""
                    // may not be secure
                }
                ${
                    body &&
                    body.resultsPerPage !== undefined &&
                    body.currentPage !== undefined &&
                    useLimit
                        ? `LIMIT ? OFFSET ?`
                        : ""
                }
                `;

            if (body?.category != undefined && body.category != "All")
                params.push(body.category);
            if (body && body.maxPrice > 0 && !isNaN(body.maxPrice))
                params.push(body.maxPrice);
            if (!body?.searchString != undefined)
                params.push("%" + body.searchString + "%");
            // may not be secure

            if (
                body &&
                body.resultsPerPage !== undefined &&
                body.currentPage !== undefined &&
                useLimit
            ) {
                params.push(body.resultsPerPage);
                params.push(body.resultsPerPage * (body.currentPage - 1));
            }

            const [rows, fields] = await conn.query(statement, params);
            conn.release();

            return rows;
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    getMaxResults: async (body, useLimit) => {
        try {
            const [db, stripeProducts] = await Promise.all([
                Shop.search(body, useLimit),
                (await Shop.allStripeProducts()).map((value) => value.id),
            ]);

            const filtered = db
                .filter((value) => stripeProducts.includes(value.productId))
                .map((value) => parseFloat(value.price));
            return {
                maxPage: Math.ceil(filtered.length / body.resultsPerPage),
            };
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    getProductImage: async (id) => {
        try {
            let conn = await pool.getConnection();
            const [rows, fields] = await conn.query(
                "SELECT uri FROM ProductImages WHERE product_id = ?",
                [id]
            );
            conn.release();

            return rows[0];
        } catch (e) {
            console.error(e);
            throw e;
        }
    },

    getProductDetails: async (id) => {
        try {
            let conn = await pool.getConnection();
            const [rows, fields] = await conn.query(
                "SELECT p.productId, p.productDesc, p.price, p.categoryId, p.stock, p.productName, c.category as categoryName FROM Products p, Category c WHERE p.categoryId = c.categoryId AND productId = ?",
                [id]
            );
            conn.release();

            return rows[0];
        } catch (e) {
            console.error(e);
            throw e;
        }
    },

    getProductReviews: async (id, sortBy, page) => {
        try {
            let conn = await pool.getConnection();
            let order = "";
            if (sortBy && page) {
                const reviewsPerPage = 5;
                let offset = (page - 1) * reviewsPerPage;
                // 4 sorts, oldest review, newest review, lowest rating, highest rating
                order += "AND ";
                switch (sortBy) {
                    case "Oldest":
                        order = "ORDER BY createdAt ASC";
                        break;
                    case "Highest Rating":
                        order = "ORDER BY rating DESC";
                        break;
                    case "Lowest Rating":
                        order = "ORDER BY rating ASC";
                        break;
                    default:
                        order = "ORDER BY createdAt DESC";
                }

                order += ` LIMIT ${reviewsPerPage} OFFSET ${offset} `;
            }
            const [rows, fields] = await conn.query(
                `SELECT r.reviewId, r.createdAt, r.rating, r.description, u.username FROM Review r INNER JOIN User u ON u.userId = r.userId AND r.productId = ? ${order}`,
                id
            );
            conn.release();

            return rows;
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
};

module.exports = Shop;
