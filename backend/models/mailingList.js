require("dotenv").config();
const pool = require("../config/databaseConfig");

const getSubscribedUsers = async (req, res, next) => {
    const query = `SELECT * FROM ades_project.User WHERE subscribed = 1;`

    try {
        const [result] = await pool.query(query)

        return res.status(200).json(result)
    } catch (error) {
        console.error(error)
    }
}

const getAllUsers = async (req, res, next) => {
    const query = `SELECT * FROM User`
    try {
        const [result] = await pool.query(query)

        return res.status(200).json(result)
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    getSubscribedUsers,
    getAllUsers
};
