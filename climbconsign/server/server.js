const express = require('express');         // HTTP Server
const bodyParser = require('body-parser');  // Body Parser
const dotenv = require('dotenv').config();  // Env Config
const session = require('express-session')
const passport = require('passport')
const cors = require("cors")
var path = require('path');


// ==== Main function ====
// All of this is in a function so that we can use 
// async methods for things like initializing the database, etc
async function run() {
    // Check if we have the proper db connection 
    const DataLink = require('./RGPLink/DataLink')
    const pool = DataLink.initialize()
    if(!pool) {
        console.error("Could not connect to databse. Do you have a local install of RGP? Is it running?")
    }
    else { // The connection succeded, let's finish setting up the server
        // =========== EXPRESS ===========
        const app = express();
        app.use(cors())

        // ========= Allow image storage ========
        app.use (express.urlencoded({extended: true}));
        app.use(express.static(path.join(__dirname, 'public')));

        const port = process.env.PORT || 1337; 

        // ========== Body Parser ===========
        app.use(bodyParser.urlencoded({ extended: false})); // Parse application/x-www-form-urlencoded
        app.use(bodyParser.json());                         // Parse application/json

        // ========== SETUP AUTH SESSIONS ==========
        const five_minutes = 1000 * 60 * 5

        app.use(session({
            secret: 'keyboard cat ello yall',
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: five_minutes,
                sameSite: true
            }
        }));
        app.use(passport.authenticate('session'));
        // ========== SETUP PASSPORT ==========
        require('./passportconfig');

        // ========== SETUP ROUTING =========== 
        // API v1 Router
        const router_v1 = require('./routes/v1/router')
        app.use('/v1/', router_v1)

        // ========== Start Listening =============
        app.listen(port, () => console.log(`Listening on port ${port}`));
    }
}
// Call our async run method
run()