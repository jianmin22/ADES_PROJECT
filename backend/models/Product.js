const pool = require("../config/databaseConfig");
const uuid = require("uuid").v4;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const fs = require("fs");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports.getProduct = async function getProduct(productId) {
    try {
        const sql = `SELECT * FROM Products WHERE productId=?`;
        const [result, fields] = await pool.query(sql, [productId]);
        return result;
    } catch (error) {
        // Handle the error
        console.error("Error retrieving product:", error);
        throw error; // Rethrow the error to propagate it further
    }
};

module.exports.create = async ({
    name,
    price,
    category,
    stock,
    description,
    cost,
}) => {
    let conn;
    let success;
    try {
        conn = await pool.getConnection();

        // at this stage, all passed in data should be valid, immediately just insert
        await conn.beginTransaction();
        let newId = uuid();
        const [results, fields] = await conn.query(
            "INSERT INTO Products(productId, productDesc, price, categoryId, stock, productName, cost) VALUES(?, ?, ?, ?, ?, ?, ?)",
            [newId, description, price, category, stock, name, cost]
        );

        if (!results)
            throw new Error(`Failed to create new product with Name: ${name}`);

        const [catName, catFields] = await conn.query(
            "SELECT c.category as categoryName FROM Products p INNER JOIN Category c ON p.categoryId = c.categoryId AND p.productId = ?;",
            [newId]
        );

        if (!catName[0]?.categoryName)
            throw new Error("Product does not exist!");

        let categoryName = catName[0].categoryName;

        await stripe.products.create({
            id: newId,
            name: name,
            description: description,
            metadata: {
                category: categoryName,
                currency: "SGD",
                price: price,
            },
        });

        await conn.commit();

        success = true;
    } catch (e) {
        await conn.rollback();
        throw e;
    } finally {
        if (conn) conn.release();
    }

    return success;
};

module.exports.allStripeProducts = async (active) => {
    try {
        let allProducts = [];
        let hasMore = true;
        var params = {
            limit: 100,
            active: active,
        };

        while (hasMore) {
            let products = await stripe.products.list(params);
            hasMore = products.has_more;
            allProducts = [...allProducts, ...products.data];

            if (hasMore)
                params.starting_after = allProducts[allProducts.length - 1].id;
        }

        return allProducts;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

module.exports.all = async () => {
    let conn;
    try {
        conn = await pool.getConnection();
        const [results, fields] = await conn.query(
            "SELECT c.category as categoryName, p.* FROM Products p INNER JOIN Category c ON p.categoryId = c.categoryId;"
        );

        return results;
    } catch (e) {
        throw e;
    } finally {
        if (conn) conn.release();
    }
};

module.exports.updateProduct = async (
    product_id,
    { name, price, category, stock, description, cost }
) => {
    let conn;
    let success;
    try {
        conn = await pool.getConnection();
        // verify if product exists
        let productExists = await this.getProduct(product_id);

        if (!productExists) throw new Error("Product does not exist!");

        let [results, fields] = await conn.query(
            "SELECT * FROM Category WHERE categoryId = ?",
            category
        );

        if (!results[0])
            throw new Error(`Category with id:${category} does not exist!`);

        // now that product and categoryId exists, can update
        await conn.beginTransaction();
        const [updated, updatedFields] = await conn.query(
            "UPDATE Products SET productDesc = ?, price = ?, categoryId = ?, stock = ?, productName = ?, cost = ? WHERE productId = ?",
            [description, price, category, stock, name, cost, product_id]
        );

        if (!updated?.affectedRows)
            throw new Error("Failed to update existing product!");

        const stripeProduct = await stripe.products.update(product_id, {
            name: name,
            description: description,
            metadata: {
                category: category,
                currency: "SGD",
                price: price,
            },
        });

        await conn.commit();

        success = true;
    } catch (e) {
        conn.rollback();
        throw e;
    } finally {
        if (conn) conn.release();
    }

    return success;
};

module.exports.getImage = async (product_id) => {
    let conn;
    try {
        conn = await pool.getConnection();

        const [results, fields] = await conn.query(
            "SELECT * FROM ProductImages WHERE product_id = ?",
            [product_id]
        );

        return results[0];
    } catch (e) {
        throw e;
    } finally {
        if (conn) conn.release();
    }
};

module.exports.uploadImage = async (file, product_id) => {
    let conn;
    try {
        conn = await pool.getConnection();
        // cloudinary_file_id, cloudinary_urlv (uri), original_filename, mime_type
        // 1. see if product exists

        let productExist = await this.getProduct(product_id);

        if (!productExist[0]?.productId)
            throw new Error("Product does not exist!");

        // upload file to cloudinary
        const cloudinaryUpload = await cloudinary.uploader.upload(file.path, {
            folder: "products",
            public_id: product_id,
        });

        if (!cloudinaryUpload)
            throw new Error("Failed to upload to Cloudinary!");

        // 2. get product id see if already exists in productImages db
        let productId = productExist[0].productId;

        const [productImagesResults, productImagesFields] = await conn.query(
            "SELECT * FROM ProductImages WHERE product_id = ?",
            [productId]
        );

        let insertUpdateConn;
        let hasInsertedOrUpdated;
        try {
            insertUpdateConn = await pool.getConnection();
            await insertUpdateConn.beginTransaction();

            // 3. if exists, update
            if (productImagesResults[0]?.product_image_id) {
                let old_image = productImagesResults[0];
                // 1. delete image from cloudinary
                // skip this step as all generated uploads to cloudinary is via product_id

                // 2. delete file from server storage
                // multer file upload is unique
                const deleteFromUploads = new Promise((resolve, reject) => {
                    try {
                        let deleted = false;
                        if (fs.existsSync(old_image.file_path)) {
                            fs.unlinkSync(old_image.file_path);
                            deleted = true;
                        }

                        resolve(deleted);
                    } catch (e) {
                        console.error(e);
                        reject(e);
                    }
                });

                await deleteFromUploads;

                let [results, fields] = await conn.query(
                    "UPDATE ProductImages SET uri = ?, cloudinary_file_id = ?, original_filename = ?, file_path = ? WHERE product_id = ?",
                    [
                        cloudinaryUpload.secure_url,
                        cloudinaryUpload.public_id,
                        cloudinaryUpload.original_filename,
                        file.path,
                        productId,
                    ]
                );

                if (!results?.affectedRows)
                    throw new Error("Error while updating ProductImages");
            } else {
                // 4. if dont exist, create new
                let [results, fields] = await conn.query(
                    "INSERT INTO ProductImages (uri, cloudinary_file_id, original_filename, product_id, file_path) VALUES(?, ?, ?, ?, ?)",
                    [
                        cloudinaryUpload.secure_url,
                        cloudinaryUpload.public_id,
                        cloudinaryUpload.original_filename,
                        productId,
                        file.path,
                    ]
                );

                if (!results?.insertId)
                    throw new Error("Failed to insert into ProductImages");
            }

            await insertUpdateConn.commit();

            hasInsertedOrUpdated = true;
        } catch (e) {
            await insertUpdateConn.rollback();
            console.error(e);
            throw e;
        } finally {
            if (insertUpdateConn) insertUpdateConn.release();
        }

        return hasInsertedOrUpdated;
    } catch (e) {
        if (e.message === "Product does not exist!") {
            try {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            } catch (e) {
                console.error("Error while deleting file from storage");
                throw e;
            }
        }

        throw e;
    } finally {
        if (conn) conn.release();
    }
};

module.exports.deleteImage = async (product_id) => {
    let conn;
    try {
        conn = await pool.getConnection();

        // check if product exists
        let productExist = await this.getProduct(product_id);

        if (!productExist[0]?.productId)
            throw new Error("Product does not exist!");

        // {
        //     productId: '115cad33-1be3-46b8-8fe6-477da2a89390',
        //     productDesc: 'Stacked high with sliced turkey, crispy bacon, lettuce, tomato, and mayo, this triple-decker sandwich is a classic choice for a satisfying meal.',
        //     price: '10.00',
        //     categoryId: '6',
        //     stock: 100,
        //     productName: 'Turkey Club Sandwich',
        //     cost: '2.00'
        //   }
        let deleteProduct = productExist[0];

        // {
        //     product_image_id: 19,
        //     product_id: '115cad33-1be3-46b8-8fe6-477da2a89390',
        //     uri: 'https://res.cloudinary.com/dewxxq2ht/image/upload/v1685527855/products/115cad33-1be3-46b8-8fe6-477da2a89390.png',
        //     cloudinary_file_id: 'products/115cad33-1be3-46b8-8fe6-477da2a89390',
        //     original_filename: '873df71f-8cfe-48a7-b0c7-8ec182f71735___DALL·E 2023-05-16 21.28.24 - realistic photographs of pastries'
        //   }
        let imageInfo = await this.getImage(deleteProduct.productId);

        if (!imageInfo)
            throw new Error("There are no images for this product!");

        // 1. delete image from cloudinary
        const deleteFromCloudinary = new Promise(async (resolve, reject) => {
            try {
                const result = await cloudinary.uploader.destroy(
                    imageInfo.cloudinary_file_id
                );

                resolve(result);
            } catch (e) {
                reject(e);
            }
        });

        // 2. delete file from server storage
        const deleteFromUploads = new Promise((resolve, reject) => {
            try {
                let deleted = false;
                if (fs.existsSync(imageInfo.file_path)) {
                    fs.unlinkSync(imageInfo.file_path);
                    deleted = true;
                }

                resolve(deleted);
            } catch (e) {
                reject(e);
            }
        });

        // 3. delete from product images
        const deleteFromTable = new Promise(async (resolve, reject) => {
            let deleteConn;
            try {
                deleteConn = await pool.getConnection();

                await deleteConn.beginTransaction();

                const [results, fields] = await deleteConn.query(
                    "DELETE FROM ProductImages WHERE product_id = ?",
                    [imageInfo.product_id]
                );

                await deleteConn.commit();
                resolve(results);
            } catch (e) {
                await deleteConn.rollback();
                reject(e);
            } finally {
                if (deleteConn) deleteConn.release();
            }
        });

        const [rs1, rs2, rs3] = await Promise.all([
            deleteFromCloudinary,
            deleteFromUploads,
            deleteFromTable,
        ]);

        return true;
    } catch (e) {
        throw e;
    } finally {
        if (conn) conn.release();
    }
};

module.exports.updateProductStatus = async (product_id, status) => {
    try {
        const product = await stripe.products.update(product_id, {
            active: status,
        });

        return true;
    } catch (e) {
        throw e;
    }
};

module.exports.deleteProduct = async (product_id) => {
    let conn;
    let hasDeleted;
    try {
        conn = await pool.getConnection();

        //  1. Check if product is still undergoing delivery  (query to display items still on delivery)
        // let product_id = "24d8546b-dd13-4800-a4be-14d8f8384326";
        const [hasPendingRows, hasPendingFields] = await conn.query(
            `SELECT d.DeliveryId, th.productId, d.deliveryStatus FROM TransactionHistory_item th, Delivery d WHERE th.transactionId = d.transactionId AND d.deliveryStatus != "Success" AND  th.productId = ?;`,
            [product_id]
        );

        // 2. if it is, throw an error'
        if (hasPendingRows?.length != 0)
            throw new Error(
                "Unable to delete this product! Orders still pending!"
            );

        await conn.beginTransaction();
        // 3. if not, delete from
        // - stripe         ---  maybe handled by same

        // ## need to check if product is active

        const deleteFromStripe = () => {
            return  new Promise(async (resolve, reject) => {
                try {
                    const product = await stripe.products.retrieve(product_id);
    
                    if (!product.active) {
                        throw new Error(
                            "Please Unarchvie product before deleting!"
                        );
                    }
                        
    
                    const deleted = await stripe.products.del(product_id);
    
                    resolve(deleted);
                } catch (e) {
                    console.error(e);
                    reject(e);
                }
            });
        }

        // - cloudinary     ---  maybe handled by same
        // - local storage  ---  maybe handled by same
        const deleteFromCloudinary = () => {
            return new Promise(async (resolve, reject) => {
                console.log("\n\n\nRAN\n\n\n")
                try {
                    // {
                    //     product_image_id: 19,
                    //     product_id: '115cad33-1be3-46b8-8fe6-477da2a89390',
                    //     uri: 'https://res.cloudinary.com/dewxxq2ht/image/upload/v1685527855/products/115cad33-1be3-46b8-8fe6-477da2a89390.png',
                    //     cloudinary_file_id: 'products/115cad33-1be3-46b8-8fe6-477da2a89390',
                    //     original_filename: '873df71f-8cfe-48a7-b0c7-8ec182f71735___DALL·E 2023-05-16 21.28.24 - realistic photographs of pastries'
                    //   }
                    let imageInfo = await this.getImage(product_id);
    
                    if (
                        imageInfo &&
                        imageInfo.uri &&
                        imageInfo.cloudinary_file_id &&
                        imageInfo.original_filename
                    ) {
                        const deleted = await this.deleteImage(product_id);
                        resolve(deleted);
                    }
    
                    resolve();
                } catch (e) {
                    console.error(e);
                    reject(e);
                }
            });
        }

        // - cart_item (all user's carts)
        const deleteFromCartItem = () => {
            return new Promise(async (resolve, reject) => {
                try {
                    const [rows, cols] = await conn.query(
                        "DELETE FROM Cart_item WHERE productId = ?",
                        [product_id]
                    );
                    resolve(rows);
                } catch (e) {
                    console.error(e);
                    reject(e);
                }
            });
        }

        // - productImages (no more images for image to refer to)
        const deleteFromImagesTable = () => {
            return  new Promise(async (resolve, reject) => {
                try {
                    const [rows, cols] = await conn.query(
                        "DELETE FROM ProductImages WHERE product_id = ?",
                        [product_id]
                    );
                    resolve(rows);
                } catch (e) {
                    console.error(e);
                    reject(e);
                }
            });
        }

        // - delete from transaction items (will exist, because is used in first query)
        const deleteFromTransItem = () => {
            return new Promise(async (resolve, reject) => {
                try {
                    const [rows, cols] = await conn.query(
                        "DELETE FROM TransactionHistory_item WHERE productId = ?",
                        [product_id]
                    );
                    resolve(rows);
                } catch (e) {
                    console.error(e);
                    reject(e);
                }
            });
        }

        // - product table
        const deleteFromProducts = () => {
            return new Promise(async (resolve, reject) => {
                try {
                    const [rows, cols] = await conn.query(
                        "DELETE FROM Products WHERE productId = ?",
                        [product_id]
                    );
                    resolve(rows);
                } catch (e) {
                    console.error(e);
                    reject(e);
                }
            });
        }

        const r1 = await deleteFromStripe();
        const r2 = await deleteFromCloudinary()

        const [ r3, r4, r5, r6] = await Promise.all([
            deleteFromCartItem(),
            deleteFromImagesTable(),
            deleteFromTransItem(),
            deleteFromProducts(),
        ]);


        hasDeleted = true;

        await conn.commit();
    } catch (e) {
        await conn.rollback();
        console.error(e);
        throw e;
    } finally {
        if (conn) conn.release();
    }

    return hasDeleted;
};

module.exports.updateProductQuantity = async function updateProductQuantity(selectedCartItems) {
    try {
      const updates = selectedCartItems.map((item) => {
        return pool.query("UPDATE Products SET stock=(stock-?) WHERE productId=?", [item.quantity, item.productId]);
      });
  
      const results = await Promise.all(updates);
      console.log(results);
    } catch (error) {
      throw new Error(`Failed to update quantity: ${error}`);
    }
  };
  