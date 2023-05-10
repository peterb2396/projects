const express = require('express');
const router = express.Router();

const c_customer = require('./controllers/customer')

// get all customers
router.get('/', c_customer.GetAllCustomers)

router.get('/:customer_id', c_customer.CustomerByID)
router.get('/find/:input', c_customer.FindCustomer)



module.exports = router;
