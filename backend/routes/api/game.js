const express = require('express')
const router = express.Router();
const { insertNumber,
    generateRandomNumber,
    getWinningNumbers,  allEntries, updateWinners, claim } = require('../../models/game')

router.post('/', insertNumber)
    .post('/generate', generateRandomNumber)
    .get('/winningNum', getWinningNumbers)
    .get('/allEntries', allEntries)
    .put('/winners', updateWinners)
    .put('/claim', claim)

module.exports = router