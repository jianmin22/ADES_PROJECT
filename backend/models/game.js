require("dotenv").config();
const pool = require("../config/databaseConfig");

const insertNumber = async (req, res, next) => {
    try {
        const {uuid, input} = req.body;

        console.log("insertNumber Function game.js");

        // Getting the current date and 2 days ago
        const currentDate = new Date();
        const twoDaysAgo = new Date(currentDate);
        twoDaysAgo.setDate(currentDate.getDate() - 2);

        // Delete all input records from 2 days ago
        const deleteQuery = `DELETE FROM userInput WHERE date = ?`;
        await pool.query(deleteQuery, [twoDaysAgo]);


        if (uuid) {
            const checkQuery = `SELECT * FROM userInput WHERE user = ?`;
            const [rows] = await pool.query(checkQuery, [uuid]);

            if (rows.length < 3) {
                let hasDuplicate = false;

                rows.forEach((item) => {
                    console.log(item.numberInput)
                    if (item.numberInput === input) {
                        hasDuplicate = true;
                    }
                })

                if (hasDuplicate) {
                    return res.status(409).json({message: "No Duplicate values"});
                }
                const insertInputQuery = `INSERT INTO userInput (user, numberInput) VALUES (?, ?)`;
                const [insert] = await pool.query(insertInputQuery, [uuid, input]);

                const affectedRows = insert.affectedRows;

                if (affectedRows > 0) {
                    return res.sendStatus(200);
                } else {
                    return res.status(500).json({message: "Failed to insert number input."});
                }
            } else {
                return res.status(403).json({message: "Maximum number of inputs reached."});
            }
        } else {
            return res.status(400).json({message: "Missing UUID."});
        }
    } catch (error) {
        console.error(error)
        if (error ?. errno == 1292) {
            return res.status(400).json({message: "Wrong data."});

        } else if (error ?. errno == 1062) {
            return res.status(409).json({message: "No Duplicate values"});
        }

        return res.status(500).json({message: "Internal server error."});
    }

};

const generateRandomNumber = async (req, res, next) => {
    try {

        const random_number = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
        console.log(random_number)

        var timeQuery = ""
        var today;
        var laterDate;

        // today's timing
        var hour = new Date().getHours()
        var minutes = new Date().getMinutes()
        // if timing is more than 4pm in utc which is Singapore's timing
        if (hour > 16 && minutes >= 0) {
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0];
            today = formattedDate + " 18:00:00";
            const tmr = new Date(currentDate);
            tmr.setDate(currentDate.getDate() + 1);
            laterDate = tmr.toISOString().split('T')[0] + " 17:59:59";
            timeQuery = `SELECT *
            FROM winningNumbers
            WHERE (
            CONVERT_TZ(date, 'UTC', 'Asia/Singapore') >= ?
            AND CONVERT_TZ(date, 'UTC', 'Asia/Singapore') <= ?
        );
        ;`

        } else {
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0];
            today = formattedDate + " 17:59:59";

            const ystd = new Date(currentDate);
            ystd.setDate(currentDate.getDate() - 1);
            laterDate = ystd.toISOString().split('T')[0] + " 18:00:00";

            timeQuery = `SELECT *
            FROM winningNumbers
            WHERE (
            CONVERT_TZ(date, 'UTC', 'Asia/Singapore') <= ?
            AND CONVERT_TZ(date, 'UTC', 'Asia/Singapore') >= ?
        );
        ;`
        }

        console.log(today)
        console.log(laterDate)

        // check if there has been a winning number for 10am - 9:59am
        console.log("Line 71")

        const [winningExist] = await pool.query(timeQuery, [today, laterDate]);
        console.log(JSON.stringify(winningExist))
        if (winningExist.length < 1) {
            console.log("Winning number none yet")
            const insertWinningQuery = `INSERT INTO winningNumbers (winningNumbers) VALUES (?)`;
            const [result] = await pool.query(insertWinningQuery, [random_number]);
            const affectedRows = result.affectedRows;

            if (affectedRows > 0) {
                return res.sendStatus(201);
            }
        }

        return res.sendStatus(200)

    } catch (error) {
        console.error('Error:', error);
        res.sendStatus(500)
    }
};


const getWinningNumbers = async (req, res, next) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const today = formattedDate;
    const tmr = new Date(currentDate);
    tmr.setDate(currentDate.getDate() - 1);
    const formattedTmr = tmr.toISOString().split('T')[0];

    const getWinningQuery = `SELECT winningNumbers FROM winningNumbers ORDER BY date DESC LIMIT 1`
    console.log("line 101 winning Numbers")

    try {
        const [result] = await pool.query(getWinningQuery, [today, formattedTmr])
        console.log(JSON.stringify(result))

        if (result.length > 0) {
            const numbers = result[0].winningNumbers
            return res.status(200).json(numbers)

        } else {
            res.status(404).json({error: 'No winning numbers found.'});
        }

    } catch (error) {
        console.error('Error:', error);
    }

}

const allEntries = async (req, res, next) => {

    const {user} = req.query

    const getWinningQuery = `SELECT numberInput, date, won, claimed FROM userInput WHERE user = ?`
    try {

        const [result] = await pool.query(getWinningQuery, [user])

        if (result.length > 0) {
            const numbers = result
            return res.status(200).json(numbers)

        } else {
            res.status(404).json({error: 'No winning numbers found.'});
        }

    } catch (error) {
        console.error('Error:', error);
    }

}

const updateWinners = async (req, res, next) => {
    const updateQuery = `UPDATE userInput AS u
    SET won = 1  
    WHERE numberInput IN (
        SELECT wn.winningNumbers
        FROM winningNumbers AS wn
        WHERE wn.winningNumbers = u.numberInput AND u.date = DATE_SUB(wn.date, INTERVAL 24 HOUR)
    );
    `

    try {

        const [result] = await pool.query(updateQuery)
        return res.sendStatus(200)


    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }

}

const claim = async (req, res, next) => {
    const updateQuery = `UPDATE userInput SET claimed = 1 WHERE date = ? `
    const {date, userid} = req.query

    const awardPtsQuery = `UPDATE PointSystem SET totalPoints = totalPoints + 1000 WHERE userId = ?`
    try {
        const [result] = await pool.query(updateQuery, [date])

        const [result2] = await pool.query(awardPtsQuery, [userid])

        if (result2.affectedRows > 0) {
            return res.sendStatus(200)

        }

    } catch (error) {
        console.error(error)
        return res.sendStatus(500)
    }
}

module.exports = {
    insertNumber,
    generateRandomNumber,
    getWinningNumbers,
    allEntries,
    updateWinners,
    claim
};
