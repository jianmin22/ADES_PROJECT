const express = require('express')
const router = express.Router();
const changeEmail = require('../../models/changeEmail')

router.post('/', changeEmail);

module.exports = router