const pool = require("../config/databaseConfig");
const Users = require("./user");

const SibApiV3Sdk = require("sib-api-v3-sdk");
let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = "apikey";

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

const Announcements = {
    sendEmail: async ({ recipients, content }) => {
        sendSmtpEmail.subject = "NEW PRODUCT";
        sendSmtpEmail.htmlContent = `
            <html>
                <body>
                    ${` <h2 style="text-align:center">New <strong style="color:#66b966;background-color:#008a00"><em><u>PANDAN</u></em></strong><strong><em> </em></strong>Cake!</h2><blockquote style="text-align:center"><span style="color:#008a00">&quot;best product ever tbh!!!</span></blockquote>`}
                </body>
            </html>
            `;
        sendSmtpEmail.sender = {
            name: "Huang's Bakery",
            email: "no-reply@huangsbakerysg.com",
        };
        sendSmtpEmail.to = [
            { email: "huangsbakerysg@gmail.com", name: "Huang's Bakery" },
        ];
        sendSmtpEmail.bcc = [{ email: "", name: "" }];

        var response = false;
        try {
            response = apiInstance.sendTransacEmail(sendSmtpEmail);
        } catch (e) {
            console.log(e);
        }

        return response;
    },

    create: async (title, delta, userId, mailing) => {
        let conn;
        let state = null;
        try {
            conn = await pool.getConnection();
            await conn.beginTransaction();
            if (mailing) console.log("Mailing");

            const data = JSON.stringify(delta);
            const a_title = title;

            console.log(userId);

            const [rows, cols] = await conn.query(
                "INSERT INTO Announcements(title, content, authorId, mailingList) VALUES(?, ?, ?, ?)",
                [a_title, data, userId, mailing]
            );

            if (rows.insertId !== 0) state = "success";

            conn.commit();
        } catch (e) {
            console.error(e);

            if (conn) conn.rollback();
            throw e;
        } finally {
            if (conn) conn.release();
        }

        return state;
    },

    search: async (search, page) => {
        let conn;
        let results = {
            data: [],
            count: 0,
        };
        try {
            conn = await pool.getConnection();

            let offset = (page - 1) * 10;
            let title = `%${search}%`;

            const [rows, cols] = await conn.query(
                "SELECT a.announcementId, a.title, u.username, a.CREATED_AT FROM Announcements a, User u WHERE a.authorId = u.userId AND a.title LIKE ? LIMIT 10 OFFSET ?;",
                [title, offset]
            );

            const [q1, c1] = await conn.query(
                "SELECT COUNT(title) as COUNT FROM Announcements WHERE title LIKE ?;",
                [title, offset]
            );
            let count = q1[0].COUNT;

            results.data = rows;
            results.count = count;
        } catch (e) {
            console.error(e);
            throw e;
        } finally {
            if (conn) conn.release();
        }

        return results;
    },

    all: async () => {
        let conn;
        let results = [];
        try {
            conn = await pool.getConnection();

            const [rows, cols] = await conn.query(
                "SELECT a.announcementId, a.title, u.username, a.CREATED_AT FROM Announcements a, User u WHERE a.authorId = u.userId ORDER BY a.CREATED_AT DESC;"
            );

            results = rows;
        } catch (e) {
            console.error(e);
            throw e;
        } finally {
            if (conn) conn.release();
        }

        return results;
    },

    deleteOne: async (announcement_id) => {
        let conn;
        let state = null;
        try {
            conn = await pool.getConnection();

            const [rows, cols] = await conn.query(
                "DELETE FROM Announcements WHERE announcementId = ?",
                [announcement_id]
            );

            if (rows.affectedRows !== 0) state = "success";
        } catch (e) {
            console.error(e);
            throw e;
        } finally {
            if (conn) conn.release();
        }

        return state;
    },

    findOne: async (announcement_id) => {
        let conn;
        let results = [];
        try {
            conn = await pool.getConnection();

            const [rows, cols] = await conn.query(
                "SELECT a.title, a.content, u.username, a.CREATED_AT FROM Announcements a, User u WHERE u.userId = a.authorId AND a.announcementId = ?;",
                announcement_id
            );

            results = rows[0];
            results.content = JSON.parse(results.content);
        } catch (e) {
            console.error(e);
            throw e;
        } finally {
            if (conn) conn.release();
        }

        return results;
    },
};

module.exports = Announcements;
