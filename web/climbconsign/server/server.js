const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
var session = require('express-session');
const dotenv = require('dotenv')


// First thing we want to do is to fetch all of the database connection async stuff, and after that happens, then
// continue to serve

async function run() {
    // Check if we have the proper db connection varsection
    const pool = await require('./RGPLink/DataLink')()
    if(!pool) {
        console.error("Could not connect to databse. Do you have a local install of RGP? Is it running?")
    }
    else { // The connection succeded, let's finish setting up the server
        // =========== EXPRESS ===========
        const app = express();
        const port = process.env.PORT || 1337;


        // ========== Body Parser ===========
        app.use(bodyParser.urlencoded({ extended: false})); // Parse application/x-www-form-urlencoded
        app.use(bodyParser.json()); // Parse application/json


        // ========== SETUP AUTH SESSIONS ==========
        const ONE_HOUR = 1000 * 60 * 3
        /* FIXME - Don't use MYSQL-SESSION, use something else
        const mysqlStore = require('express-mysql-session')(session); 
        app.use(session({
            secret: 'keyboard cat ello yall',
            resave: false,
            saveUninitialized: false,
            store: new mysqlStore({
                connectionLimit: 10,
                password: process.env.DB_PASSWORD,
                user: process.env.DB_USERNAME,
                database: process.env.DB_NAME,
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                createDatabaseTable: true
            }),
            cookie: {
                maxAge: ONE_HOUR,
                sameSite: true
            }
        }));
        app.use(passport.authenticate('session'));
        */

        // ========== SETUP PASSPORT ==========
        require('./passportconfig');

        // ========= Setup Routers ============
        const items = require('./routes/v1/items');
        app.use('/v1/', items);

        // ========== Start Listening =============
        app.listen(port, () => console.log(`Listening on port ${port}`));
        
    }
}
run()