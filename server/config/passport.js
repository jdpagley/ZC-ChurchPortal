// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy,
    validator = require('validator');

// load up the church model
var Church = require('../models/church.js');

// expose this function to our app
module.exports = function(passport){
    // passport session setup =========================================
    //required for persistent login sessions
    //passport needs the ability to serialize and unserialize users out of a session

    //used to serialize the user for session
    passport.serializeUser(function(church, done){
        done(null, church.id);
    });

    passport.deserializeUser(function(id, done){
        Church.findById(id, function(error, church){
            done(error, church);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
        function(req, email, password, done){
            process.nextTick(function(){
                var msgObj = req.body;
                console.log(msgObj);

                if(!msgObj.email){
                    return done(null, false, req.flash('signupMessage', 'Please provide an Email Address.'));
                } else {
                    try {
                        validator.isEmail(msgObj.email)
                    } catch (exception){
                        return done(null, false, req.flash('signupMessage', 'Please use a valid Email Address.'));
                    }
                }

                if(!msgObj.password){
                    return done(null, false, req.flash('signupMessage', 'Please provide a password that has more than 3 characters.'));
                }

                if(!msgObj.name){
                    return done(null, false, req.flash('signupMessage', 'Please provide a church name.'));
                }


                //Find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                Church.findOne({'email': email}, function(error, user){
                    if(error){
                        return done(error);
                    }
                    // check to see if there is already a user with that eamil
                    if(user){
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {
                        // if there is no user with that email
                        // create the user
                        var newChurch = new Church();

                        // set the church's local credentials
                        newChurch.email = email;
                        newChurch.password = newChurch.generateHash(password);
                        newChurch.name = msgObj.name;
                        newChurch.address.street = msgObj.address;
                        newChurch.address.city = msgObj.city;
                        newChurch.address.state = msgObj.state;
                        newChurch.address.zip = msgObj.zip;
                        newChurch.phone = msgObj.phone;
                        newChurch.bio = msgObj.bio;

                        // save the church
                        newChurch.save(function(error){
                            if(error){
                                throw error;
                            }

                            return done(null, newChurch);
                        });
                    }
                });
            });
        })
    )

    // Local Login =====================================================
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, email, password, done){
        // find user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists.
        Church.findOne({'email': email}, function(error,  church){
            // if there are any errors, return the error before anything else
            if(error){
                return done(error);
            }

            // if no user is found, return the message
            if(!church){
                return done(null, false, req.flash('loginMessage', 'No church found.'));
            }

            //if user is found but password is wrong
            if (!church.validPassword(password)){
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            }

            // all is well, return successful user
            return done(null, church);

        });
    }));
}
