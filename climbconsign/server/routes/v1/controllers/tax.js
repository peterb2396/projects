const RGPLink = require('../../../RGPLink/RGPLink')

module.exports.get_all = async (req, res) => {
    const taxes = await RGPLink.GetAllTaxes()
    res.json(taxes)
}

// return the amount by code. (T -> 7)
module.exports.get_amount = async (req, res) => {
    const tax_code = req.params['code']
    const amount = await RGPLink.GetTaxAmountByCode(tax_code)
    res.json(amount)
}