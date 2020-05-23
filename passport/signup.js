var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var config =require('../config.js');
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

            findOrCreateUser = function(){
                // find a user in Mongo with provided username
                User.findOne({ 'username' :  username }, function(err, user) {
                    // In case of any error, return using the done method
                    if (err){
                        console.log('Error in SignUp: '+err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists with username: '+username);
                        return done(null, false, req.flash('message','User Already Exists'));
                    } else {
                        // if there is no user with that email
                        // create the user
                        var newUser = new User();

                        // set the user's local credentials
                        newUser.username = username;
                        newUser.password = createHash(password);
                        newUser.email = req.param('email');
                        newUser.firstname = req.param('firstname');
                        newUser.lastname = req.param('lastname');
              
                        // save the user
                        newUser.save(function(err) {
                            if (err){
                                console.log('Error in Saving user: '+err);  
                                throw err;  
                            }
                            console.log('User Registration succesful');    
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

    passport.use('facebook', new FacebookStrategy(config.facebook,
        function(token, refreshToken, profile, done) {
            findOrCreateUser = function(){

                console.log('profile',profile);
                // find a user in Mongo with provided username
                User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                    // In case of any error, return using the done method
                    if (err){
                        console.log('Error in Facebook Auth: '+err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('user already exists');
                        console.log('user', user);
                      return done(null, user);
                    } else {

                        console.log('no user with that email')
                        // if there is no user with that email
                        // create the user

                        var newUser = new User();

                        // set the user's local credentials
                        newUser.facebook.id    = profile.id;
                        newUser.facebook.token = token;
                        newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                        newUser.facebook.email = profile.emails[0].value; 

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

    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}