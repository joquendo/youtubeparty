// Other method var strategies = require('./strategies.js');
var login = require('./login.js');
var signup = require('./signup.js');
var User = require('../models/user');

module.exports = function(passport){

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    login(passport);
    signup(passport);
    /* Other method
    // Setting up Passport Strategies for Login and SignUp/Registration
    strategies(passport);
    */
}