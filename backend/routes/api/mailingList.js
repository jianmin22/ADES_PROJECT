const express = require('express')
const router = express.Router()
const {getSubscribedUsers, getAllUsers} = require('../../models/mailingList')
const verifyRoles = require('../../middleware/verifyRoles');

router.get('/',getSubscribedUsers)
        .get('/all', getAllUsers)

module.exports = router