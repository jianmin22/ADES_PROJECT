const express = require('express')
const router = express.Router();
const auth = require('../../models/authentication')

router.post('/', auth.handleLogin);

module.exports = router