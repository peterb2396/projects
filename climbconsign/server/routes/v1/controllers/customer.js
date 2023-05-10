const ConsignLink = require('../../../RGPLink/ConsignLink')



// Fetches all customers
exports.GetAllCustomers = async (req, res) => {
    const customers = await ConsignLink.GetAllCustomers()
    res.json(customers)
}
// Fetches a selected customer by ID
exports.CustomerByID = async (req, res) => {
    // Grab the requested customer_id from the params
    const {customer_id} = req.params
    
    // Fetch the customer from the ConsignLink
    const customer = await ConsignLink.GetCustomerByID(customer_id)

    if(customer.length == 0) // IF it's empty aka not found
        res.status(404).json(customer)

    // Send the result
    res.json(customer)
}

exports.FindCustomer = async (req, res) => {
    // Fetch the search string
    const {input} = req.params

    // Fetch the customers with the input search string
    const customers = await ConsignLink.FindCustomer(input)
    
    // Send the customers
    res.json(customers)
}