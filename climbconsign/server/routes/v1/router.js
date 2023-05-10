const express = require('express')
const router = express.Router()

// ========= Items router ===========
const items = require('./items')
router.use('/items', items);

// ========= Customer router ========
const customers = require('./customers');
router.use('/customers', customers);

// =========== Auth router ==========
const auth = require('./auth')
router.post('/auth/:pin', auth)

// =========== Tax router ==========
const taxes = require('./taxes')
router.use('/taxes', taxes) 

module.exports = router