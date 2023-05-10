const RGPLink = require('../../RGPLink/RGPLink')

// ============ Only a single function is needed, so we'll just export it ===============
module.exports = async (req, res) => {
    // Grab the pin from the request body
    const {pin} = req.params
     // Fetch the user
     if(!pin) return res.status(400).send("Bad request")
     try {
        const user = await RGPLink.AuthPIN(pin)
        // if there isn't a user, return false with no error
        if(!user) return res.status(401).send("Unauthorized")
        // Otherwise, return the user
        else return res.json(user)
    } catch (err) {
        console.error(err)
        // pass an error back if we get one
        res.status(500).send(err)
    }
}