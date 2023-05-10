const passport = require('passport');
const PinStrategy = require('passport-pin');

const RGPLink = require('./RGPLink/RGPLink')

// Authenticate using the PINs provided with RGP
passport.use(new PinStrategy(
    async function(pin, done) {
        try {
            // Fetch the user
            const user = await RGPLink.AuthPIN(pin)
            // if there isn't a user, return false with no error
            if(!user) return done(null, false)
            // Otherwise, return the user
            else return done(null, user)
        } catch (err) { // Fetching failed
            // pass an error back if we get one
            done(err)
        }
    }
));

// Serialize User
passport.serializeUser(function(user, done) {
    done(null, user);
});

// Deserialize user
passport.deserializeUser(function(user, done) {
    done(null, user);
});