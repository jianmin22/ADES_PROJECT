const pool = require("../config/databaseConfig");
require("dotenv").config();
const bcrypt = require("bcrypt");

const userPersonal = async (req, res, next) => {
    const userId = req.userId;

    console.log(`THIS IS THE USERID BEING PASSED: `);
    console.log(req.url);
    const userPersonalQuery = `SELECT username, email, birthday, userPassword FROM ades_project.User WHERE userid = ?`;

    try {
        const [rows, fields] = await pool.query(userPersonalQuery, [userId]);
        const foundUser = rows[0];
        const resBody = {
            username: foundUser.username,
            email: foundUser.email,
            birthday: foundUser.birthday,
            userPassword: foundUser.userPassword
        };

        if (!foundUser)
            return res.status(204).json({ message: `No User ${userId} records found.` });



        return res.status(200).json(resBody);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: `Something went wrong` });
    }
};

const userAddress = async (req, res, next) => {
    try {
        const userId = req.userId;
        console.log("userAddress in user.js")

        const userAddressQuery = `SELECT Addr.addressId, country, street, unitNumber, postalCode 
      FROM ades_project.Address Addr
      JOIN ades_project.UserAddress UA ON Addr.addressId = UA.addressId
      JOIN ades_project.User U ON U.userId = UA.custId
      WHERE UA.custId = ?`;

        const [rows] = await pool.query(userAddressQuery, [userId]);

        if (rows.length === 0)
            return res.status(204).json({ message: `No Address records found.` });



        const resBody = {
            addresses: rows
        };
        console.log(rows)

        return res.status(200).json(resBody);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
};


const userSpecificAdd = async (req, res, next) => {
    try {
        const { addrId } = req.params

        const userAddressQuery = `SELECT country, street, unitNumber, postalCode FROM Address
         WHERE addressId = ?`;

        const [rows, field] = await pool.query(userAddressQuery, addrId);

        console.log(`This ran ${addrId}`)
        console.log(rows)

        if (rows.length === 0)
            return res.status(204).json({ message: `No Address records found.` });



        const addressFound = rows[0]
        console.log(addressFound)
        return res.status(200).json(addressFound);

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

const userRecentlyViewed = async (req, res, next) => {
    const userId = req.userId;

    const userAddressQuery = `SELECT country, street, unitNumber, postalCode
      FROM ades_project.Address Addr
      JOIN ades_project.UserAddress UA ON Addr.addressId = UA.addressId
      JOIN ades_project.User U ON U.userId = UA.custId
      WHERE UA.custId = ?;
    `;

    const [rows, fields] = await pool.query(userAddressQuery, [userId]);

    const foundUser = rows[0];

    if (!foundUser)
        return res.status(204).json({ message: "No address records found." });



    const resBody = {
        country: foundUser.country,
        street: foundUser.street,
        unitNumber: foundUser.unitNumber,
        postalCode: foundUser.postalCode
    };

    res.status(200).json(resBody);
};

const userName = async (req, res, next) => {
    try {
        const userId = req.userId;

        const userAddressQuery = `SELECT username FROM User WHERE userId = ?`;

        const [rows, fields] = await pool.query(userAddressQuery, [userId]);

        const foundUser = rows[0];

        if (!foundUser)
            return res.status(204).json({ message: "No name records found." });



        const resBody = {
            username: foundUser.username
        };

        res.status(200).json(resBody);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

const updateUserPersonalInfo = async (req, res, next) => {
    let { username, pwd, email, birthday } = req.body;
    const userId = req.userId;

    console.log("::::::::THIS UPDATE RAN::::::");
    if (!birthday) {
        birthday = null;
    }

    try {
        var userUpdatePersonalQuery;
        var password;
        var parameters = [userId];
        if (pwd === "") {
            userUpdatePersonalQuery = `UPDATE User SET email = ?, birthday = ?, username = ? WHERE userId = ?`;
            parameters = [email, birthday, username, userId];
        } else {
            userUpdatePersonalQuery = `UPDATE User SET email = ?, birthday = ?, username = ?, userPassword = ? WHERE userId = ?`;
            password = await bcrypt.hash(pwd, 10);
            parameters = [
                email,
                birthday,
                username,
                password,
                userId
            ];
        }

        console.log("This is the password" + password);

        const [rows, fields] = await pool.query(userUpdatePersonalQuery, parameters);

        const affectedRows = rows.affectedRows;
        console.log(`ROWS AFFECTED ${affectedRows}`);

        if (affectedRows) {
            res.status(200).send("OK");
        } else {
            res.status(204).send("No Content");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

const comparePwd = async (req, res, next) => {
    const { oldPwd } = req.body;
    const userId = req.userId;

    try {
        const userUpdatePersonalQuery = `SELECT userPassword FROM User WHERE userId = ?`;
        const [rows, fields] = await pool.query(userUpdatePersonalQuery, [userId,]);

        const foundUser = rows[0];
        const match = await bcrypt.compare(oldPwd, foundUser.userPassword);
        console.log(`Match? ${match}`);

        if (!foundUser) {
            res.status(204).send("No content");
        } else if (match) {
            res.status(200).send("Password matches");
        } else {
            res.status(401).send("Incorrect password");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

const updateAddr = async (req, res, next) => {

    console.log("UPDATE ADDR RAN")

    let {
        addrId,
        country,
        street,
        unitNumber,
        pc
    } = req.body;

    try {

        const updateAddrQuery = `UPDATE Address SET country = ?, street = ?, unitNumber = ?, postalCode = ? WHERE addressId = ?`

        const [rows, fields] = await pool.query(updateAddrQuery, [
            country,
            street,
            unitNumber,
            pc,
            addrId
        ]);

        const affectedRows = rows.affectedRows;
        console.log(`IN UPDATE ADDR ROWS AFFECTED ${affectedRows}`);

        if (affectedRows) {
            res.status(200).send({ affectedRows });
        } else {
            res.status(204).send("No Content");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }

}
const addAddr = async (req, res, next) => {

    let { country, street, unitNumber, pc } = req.body;

    try {
        const addAddrQuery = `INSERT INTO Address (country, street, unitNumber, postalCode)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            country = VALUES(country),
            street = VALUES(street),
            unitNumber = VALUES(unitNumber),
            postalCode = VALUES(postalCode);`;

        const [result] = await pool.query(addAddrQuery, [country, street, unitNumber, pc]);

        // Retrieve the inserted ID
        const insertedId = result.insertId;
        console.log(`Inserted ID: ${insertedId}`);

        const affectedRows = result.affectedRows;
        console.log(`ROWS AFFECTED: ${affectedRows}`);

        if (affectedRows) {
            res.status(200).json({ id: insertedId }); // Send the inserted ID in the response
        } else {
            res.status(204).send('No Content');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


const addAddrUser = async (req, res, next) => {
    const userId = req.userId;
    let { id } = req.body;

    try {
        const addAddrQuery = `INSERT INTO UserAddress (addressId, custId) VALUES (?, ?)`

        const [rows, fields] = await pool.query(addAddrQuery, [id, userId]);

        console.log("This ran")
        console.log(id)

        const affectedRows = rows.affectedRows;
        console.log(`This is the affected rows in add addressy user ${affectedRows}`);

        if (affectedRows) {
            let status = 200;
            console.log({ affectedRows })
            return res.status(status || 500).send({ affectedRows });
        } else {
            return res.status(204).send('No Content');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

const deleteeaddr = async (req, res, next) => {

    let { id } = req.body
    console.log(id)
    console.log("Delete ran")

    try {
        const deleteQuery = `DELETE FROM Address WHERE addressId = ?`

        const [result, fields] = await pool.query(deleteQuery, [id]);

        const affectedRows = result.affectedRows;
        console.log(`ROWS AFFECTED ${affectedRows}`);

        if (affectedRows) {
            res.status(200).send('OK');
        } else {
            res.status(204).send('No Content');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

const deleteUserAddr = async (req, res, next) => {
    let { id } = req.body
    try {
        const deleteQuery = `DELETE FROM UserAddress WHERE addressId = ?`

        const [rows, fields] = await pool.query(deleteQuery, [id]);

        const affectedRows = rows.changedRows;
        console.log(`ROWS AFFECTED ${affectedRows}`);

        if (affectedRows) {
            res.status(200).send('OK');
        } else {
            res.status(204).send('No Content');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

const deleteUser = async (req, res, next) => {

    const userId = req.userId;

    console.log(`Delete User ran ${userId}`)
    try {
        const deleteQuery = `DELETE FROM User WHERE userId = ?`

        const [rows, fields] = await pool.query(deleteQuery, [userId]);

        const affectedRows = rows.changedRows;
        console.log(`ROWS AFFECTED ${affectedRows}`);

        if (affectedRows) {
            res.status(200).send('OK');
        } else {
            res.status(204).send('No Content');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }

}

const dateJoined = async (req, res, next) => {
    try {
        const userId = req.userId;

        const userDateJoined = `SELECT DATE(dateJoined) as dateJoined FROM User WHERE userId = ?`;

        const [rows, fields] = await pool.query(userDateJoined, [userId]);

        const foundUser = rows[0];

        if (!foundUser)
            return res.status(204).json({ message: "No name records found." });



        const resBody = {
            dateJoined: foundUser.dateJoined
        };

        res.status(200).json(resBody);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}



module.exports = {
    userPersonal,
    userAddress,
    userRecentlyViewed,
    userName,
    userSpecificAdd,
    updateUserPersonalInfo,
    comparePwd,
    updateAddr,
    addAddr,
    addAddrUser,
    deleteUserAddr,
    deleteeaddr,
    deleteUser,
    dateJoined
};
