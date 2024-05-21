const nodemailer = require("nodemailer");
require('dotenv').config();
const jwt = require('jsonwebtoken');
const emailFormat = require("../utils/emailFormat");

// EMAIL CONFIG =========================================
const sendEmail = async (userid, email, url, subject) => {
    console.log("emailSending.js was used");
    let success = true;
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PWD
        }
    });

    // END EMAIL CONFIG ======================================

    var html = ``;


        try { // create a jwt token for verification later on
            jwt.sign({
                user: userid
            }, process.env.EMAIL_SECRET, {
                expiresIn: '1d'
            }, (err, emailToken) => {

                if (err) {
                    console.error(err);
                    return;
                }

                // This is to check what type of email has to be sent
                if (subject === "Email Confirmation") {
                    // Determines which URL the user will go to get verified; we want the verification page to be a splash page
                    url = url + emailToken + "&id=" + userid;
                    html = emailFormat("Verify!", "Verify Account", "To continue with Huang's Bakery, please click on the button below!", url);
                } else if (subject === "Reset Password"){
                    url = url + emailToken + "&id=" + userid;
                    html = emailFormat("Reset Password", "Reset your account's password", "To continue with Huang's Bakery, please click on the button below!", url);
                }

                transporter.sendMail({ from: '"Huang Bakery" <huangbakerysg@gmail.com>', to: email, subject: subject, html: html });
            });

        } catch (e) {
            console.error(e);
            success = false;
            return success;
        }



    return success;
}

module.exports = sendEmail;
