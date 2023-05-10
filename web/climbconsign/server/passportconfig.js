const mysql = require('mysql2/promise');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const PinStrategy = require('passport-pin');
const bcrypt = require('bcrypt');



passport.use(new LocalStrategy(function verify(username, password, cb) {
    pool.getConnection((err, connection) => {
        connection.query('SELECT * FROM users WHERE username = ?', [username], (err, rows) => {
            connection.release();
            if(err)
                return cb(err); // Some error, get out
            if(rows.length < 1) 
                return cb(null, false, { message: 'Incorrect Username' }); // NO user row
            if(!bcrypt.compareSync(password, rows[0].pin)) 
                return cb(null, false, { message: 'Incorrect PIN'}); // Wrong pin
            return cb(null, rows[0]); // Matching pin
        })
    })
}));

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { username: user.username, level: user.level});
    });
});
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
});