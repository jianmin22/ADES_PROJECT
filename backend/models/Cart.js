const pool = require("../config/databaseConfig");
const Customers = require("./Customers");

module.exports.retrieveAllItemsCart = async function retrieveAllItemsCart(
    cart_id
) {
    try {
        const sql = `SELECT Cart_item.*, Products.productName, Products.productDesc, Products.price, Products.categoryId, Products.stock, Cart_item.Qty AS quantity
	FROM Cart_item
	INNER JOIN Products ON Cart_item.productId = Products.productId
	WHERE Cart_item.cart_id = ?;
	`;
        const [result, fields] = await pool.query(sql, [cart_id]);
        return result;
    } catch (error) {
        throw new Error(`Error retrieving all cart items: ${error.message}`);
    }
};

module.exports.updateQty = async function updateQty(cartItem_Id, Qty) {
    try {
        const sql = `UPDATE Cart_item set Qty=? where cartItem_Id=?;`;
        const [result, fields] = await pool.query(sql, [Qty, cartItem_Id]);
        return result;
    } catch (error) {
        throw new Error(`Error update cart item quantity: ${error.message}`);
    }
};

module.exports.updateSelected = async function updateSelected(
    cartItem_Ids,
    cart_id
) {
    try {
        const promises = cartItem_Ids.map(async (cartItem_Id) => {
            const sql = `UPDATE Cart_item SET selected = 1 WHERE cartItem_Id=? AND cart_id = ?;`;
            return await pool.query(sql, [cartItem_Id, cart_id]);
        });

        let results = await Promise.all(promises);
        results = results.map((result) => result[0]);
        return results;
    } catch (error) {
        throw new Error(`Error update selected cart items: ${error.message}`);
    }
};

module.exports.updateVoucher = async function updateVoucher(
    voucherID,
    cart_id
) {
    try {
        const sql = `UPDATE Cart SET voucherID = ? WHERE cart_id = ?;`;
        const [result, fields] = await pool.query(sql, [voucherID, cart_id]);
        return result;
    } catch (error) {
        throw new Error(`Error updating voucher: ${error.message}`);
    }
};

module.exports.resetSelectedAndVoucher = async function resetSelectedAndVoucher(
    cart_id
) {
    try {
        const sql1 = `UPDATE Cart_item SET selected = 0 where cart_id=?;`;
        const sql2 = `UPDATE Cart SET voucherID = null where cart_id=?;`;

        const [result1, result2] = await Promise.all([
            pool.query(sql1, [cart_id]),
            pool.query(sql2, [cart_id]),
        ]);

        return [result1[0], result2[0]];
    } catch (error) {
        throw new Error(
            `Error resetting selected cart items and voucher: ${error.message}`
        );
    }
};

module.exports.retrieveRecommendation12 =
    async function retrieveRecommendation12(cart_id) {
        try {
            const sql = `
  SELECT *
  FROM Products
  WHERE categoryId IN (
    SELECT DISTINCT categoryId
    FROM Products
    INNER JOIN Cart_item
    ON Products.productId = Cart_item.productId
    WHERE cart_id = ?
  )
  AND productId NOT IN (
    SELECT productId
    FROM Cart_item
    WHERE cart_id = ?
  )
  ORDER BY RAND()
  LIMIT 12;
  `;
            const [result, fields] = await pool.query(sql, [cart_id, cart_id]);
            return result;
        } catch (error) {
            throw new Error(
                `Error retrieving 12 recommended products: ${error.message}`
            );
        }
    };

module.exports.getCartId = async function getCartId(userId) {
    try {
        const sql = `SELECT cart_id FROM Cart Where userId =?`;
        const [result, fields] = await pool.query(sql, [userId]);
        return result[0];
    } catch (error) {
        throw new Error(`Error retrieving cart id: ${error.message}`);
    }
};

module.exports.deleteCartItem = async function deleteCartItem(cartItemId) {
    try {
        const sql = `DELETE FROM Cart_item Where cartItem_Id =?`;
        const [result, fields] = await pool.query(sql, [cartItemId]);
        return result;
    } catch (error) {
        throw new Error(`Error delete cart item: ${error.message}`);
    }
};

// Get the items in the cart
module.exports.getSelectedCartItems = async function getSelectedCartItems(
    cart_id
) {
    try {
        const sql = `SELECT p.*, ci.Qty AS quantity FROM Cart_item ci
	INNER JOIN Products p ON ci.productId = p.productId
  WHERE ci.selected = 1 AND ci.cart_id = ?`;
        const [results, fields] = await pool.query(sql, [cart_id]);
        return results;
    } catch (error) {
        throw new Error(
            `Error retrieving selected cart items: ${error.message}`
        );
    }
};

module.exports.deleteAllSelectedItems = async function deleteAllSelectedItems(
    cart_id
) {
    try {
        const sql = `DELETE FROM Cart_item WHERE cart_id = ? AND selected = 1`;
        const [results, fields] = await pool.query(sql, [cart_id]);
        return results;
    } catch (error) {
        throw new Error(`Error deleting selected items: ${error.message}`);
    }
};

module.exports.updateVoucherToNull = async function updateVoucherToNull(
    cart_id
) {
    try {
        const sql = `UPDATE Cart SET voucherID = NULL WHERE cart_id = ?`;
        const [results, fields] = await pool.query(sql, [cart_id]);
        return results;
    } catch (error) {
        throw new Error(`Error updating voucher to null: ${error.message}`);
    }
};

// Archie
module.exports.addProductToCart = async (product_id, cart_id, user_id, qty) => {
    let conn;
    var hasInsertedOrUpdated;
    try {
        conn = await pool.getConnection();

        if (isNaN(parseInt(qty))) throw new Error("Invalid quantity.");
        var newCartId;

        var [results, rows] = await conn.query(
            "SELECT * FROM Cart WHERE userId = ? AND cart_id = ?",
            [user_id, cart_id]
        );

        const handleCreateCart = new Promise(async (resolve, reject) => {
            // if cart doesnt exist, try check if user and cart id exists, if it does, create a cart
            let user = await Customers.selectAll(user_id);
            if (!user) throw new Error("User does not exist");

            let cart = await this.getCartId(user_id);

            if (user && !cart) {
                let insertConn;
                try {
                    insertConn = await pool.getConnection();
                    await insertConn.beginTransaction();
                    let createCart = await conn.query(
                        "INSERT INTO Cart (userId) VALUES (?)",
                        [user_id]
                    );

                    if (!createCart[0].insertId) throw new Error("");
                    newCartId = createCart[0].insertId;
                    await insertConn.commit();
                } catch (e) {
                    console.log(e);
                    await insertConn.rollback();
                    throw new Error("Failed to create Cart");
                } finally {
                    if (insertConn) insertConn.release();
                }
            }
        });

        if (!results?.length) {
            await handleCreateCart;
        }

        if (results || newCartId) {
            // if cart exists
            // see if productid exists
            [results, fields] = await conn.query(
                "SELECT productId, stock FROM Products WHERE productId = ?",
                [product_id]
            );
            if (!results?.length) throw new Error("Product does not exist!");

            let { productId, stock } = results[0];

            if (qty > stock) throw new Error("Invalid quantity!");

            // if exists, insert into cart_item
            // at this point: user, cart, qty, product should all be legal

            // check if cart item already exists
            [results, fields] = await conn.query(
                "SELECT cartItem_Id, Qty FROM Cart_item WHERE cart_id = ? AND productId = ?",
                [cart_id, productId]
            );

            // try update existing cart

            if (results?.length) {
                let existingConn;
                let newQty = qty;
                try {
                    existingConn = await pool.getConnection();

                    await existingConn.beginTransaction();
                    let { cartItem_Id, Qty } = results[0];

                    let added = parseInt(Qty) + parseInt(newQty);

                    if (isNaN(added) || added > stock)
                        throw new Error("Cart quantity exceeds stock!");
                    let updatedResults = await conn.query(
                        "UPDATE Cart_item SET Qty = ? WHERE cartItem_Id = ?",
                        [added, cartItem_Id]
                    );

                    if (updatedResults[0].affectedRows == 0)
                        throw new Error("Failed to update cart!");

                    await existingConn.commit();

                    hasInsertedOrUpdated = true;
                } catch (e) {
                    console.log(e);
                    await existingConn.rollback();
                    throw new Error(e.message);
                } finally {
                    if (existingConn) existingConn.release();
                }
            } else {
                // at this point: user, cart, qty, product should all be legal
                let insertConn;
                try {
                    insertConn = await pool.getConnection();
                    await insertConn.beginTransaction();

                    let [results, fields] = await conn.query(
                        "INSERT INTO Cart_item (Qty, cart_id, productId) VALUES (?, ?, ?)",
                        [qty, cart_id, product_id]
                    );

                    if (!results?.insertId) throw new Error("");

                    await insertConn.commit();

                    hasInsertedOrUpdated = true;
                } catch (e) {
                    console.log(e);
                    await insertConn.rollback();
                    throw new Error("Failed to add Cart Item");
                } finally {
                    if (insertConn) insertConn.release();
                }
            }
        }

        return hasInsertedOrUpdated;
    } catch (e) {
        throw e;
    } finally {
        conn.release();
    }
};

module.exports.getCartInfo = async (cart_id) => {
    let conn;
    try {
        conn = await pool.getConnection();

        const [rows, cols] = await conn.query(
            `
        SELECT 
        COUNT(DISTINCT(ci.productId)) as Items, 
        IFNULL(SUM(p.price * ci.Qty), 0) as Subtotal 
        FROM 
        Cart c, 
        Cart_item ci, 
        Products p 
        WHERE 
        ci.cart_id = c.cart_id 
        AND ci.productId = p.productId 
        AND c.cart_id = ?;`,
            cart_id
        );

        return rows[0];
    } catch (e) {
        throw e;
    } finally {
        conn.release();
    }
};

// // Get the voucher from the user's cart
// module.exports.getVoucherFromCart = async function getVoucherFromCart(cart_id) {
// 	const sql = `SELECT v.* FROM Cart c
//   JOIN Voucher v ON c.voucherID = v.voucherID
//   WHERE c.cart_id = ?`;
// 	const [results, fields] = await pool.query(sql, [cart_id]);
// 	return results[0];
// };
