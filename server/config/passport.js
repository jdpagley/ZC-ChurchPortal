// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy,
    validator = require('validator'),
    churchs = require('../controllers/churchs.js');

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
    }, function(req, email, password, done){
            process.nextTick(function(){
                // controllers/churchs.js will handle creating new church.
                churchs.create(req, email, password, done);
            });
    }));

    // Local Login =====================================================
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, email, password, done){
        // controllers/churchs.js will handle retrieving user account
        // and sending it to the client.
        churchs.retrieve(req, email, password, done);
    }));
}
