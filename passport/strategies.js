var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var config =require('../config.js');
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');
 
 
module.exports = function(passport){
 
 
    passport.use(new FacebookStrategy(config.facebook,        
        function(token, refreshToken, profile, done) {
            findOrCreateUser = function(){
                // find a user in Mongo with provided username
                User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                    // In case of any error, return using the done method
                    if (err){
                        console.log('Error in Facebook Auth: '+err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                      return done(null, user);
                    } else {
                        // if there is no user with that email
                        // create the user
 
                        var newUser = new User();
                        newUser.facebook.id    = profile.id;
                        newUser.facebook.token = token;
                        newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                        // newUser.facebook.email = profile.emails[0].value; 
 
                        // save the user
                        newUser.save(function(err) {
                            if (err){
                                console.log('Error in Facebook Saving user: '+err);  
                                throw err;  
                            }
                            console.log('Facebook Registration succesful');    
                            return done(null, newUser);
                        });
                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );
 
    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }
    
}