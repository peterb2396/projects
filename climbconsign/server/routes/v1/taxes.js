const express = require('express')
const router = express.Router()

const c_tax = require('./controllers/tax')

router.get('/', c_tax.get_all)

router.get('/:code/amount', c_tax.get_amount)

module.exports = router