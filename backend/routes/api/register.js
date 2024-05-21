const express = require('express')
const router = express.Router()
const registerController = require('../../controller/registerController')

router.post('/', registerController.handleNewUser)
    .post('/newc', registerController.handleNewCart)
    .post('/newp', registerController.handleNewPoints);

module.exports = router