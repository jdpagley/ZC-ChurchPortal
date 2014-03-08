/**
 * Created by Josh Pagley 3/3/2014
 * controllers/church.js handles creating, retrieving, updating and deleting church profiles.
 * "CRUD" operations for churches.
 */

var validator = require('validator');
var async = require('async');
var _ = require('underscore');

//Models
var Church = require('../models/church.js');

// Create New Church
exports.create = function(req, email, password, done){
    var msgObj = req.body;
    console.log(msgObj);

    if(!msgObj){
        return done(null, false, req.flash('signupMessage', 'POST Body is required'))
    }

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

    if(!msgObj.address){
        return done(null, false, req.flash('signupMessage', 'Please provide a street address.'));
    }

    if(!msgObj.city){
        return done(null, false, req.flash('signupMessage', 'Please provide the city.'));;
    }

    if(!msgObj.state){
        return done(null, false, req.flash('signupMessage', 'Please select a state.'));
    }

    if(!msgObj.zip){
        return done(null, false, req.flash('signupMessage', 'Please provide a zip.'));
    }

    if(!msgObj.phone){
        return done(null, false, req.flash('signupMessage', 'Please select a state.'));
    }

    // This method is checking to see if the church email the church is using to create
    // a new account with already exists with another church.
    Church.findOne({'email': email}, function(error, church){
        if(error){
            return done(error);
        }
        // Check to see if there is already a church with that email
        if(church){
            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {
            // If there is no church with that email then create the church.
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
                    console.log('Error creating new church: ' + error);
                    throw error;
                }

                return done(null, newChurch);
            });

        }
    });
};

//Retrieve Church Information
exports.retrieve = function(req, email, password, done){
    // Find church whose email is the same as the forms email
    // we are checking to see if the church trying to login exists.
    Church.findOne({'email': email}, function(error,  church){
        // if there are any errors, return the error before anything else
        if(error){
            return done(error);
        }

        // If no church is found then return the message
        if(!church){
            return done(null, false, req.flash('loginMessage', 'No church found.'));
        }

        //If church is found but password is wrong
        if (!church.validPassword(password)){
            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
        }

        // all is well, return successful church
        return done(null, church);
    });
}

exports.update = function(req, res){

    var msgObj = req.body;

    if(!msgObj){
        return res.json(400, {"error": "POST body is required with valid parameters"});
    }

    if(!msgObj.email){
        return res.json(400, {"error": "Email required."});

    } else {
        Church.findOne({'email': msgObj.email}, function(error, church){
            if (error) {
                res.json(500, {"error": "Server error.", "mongoError": error});
            } else if (!church){
                res.json(404, {"error": "Account you are trying to update does not exist."});
            } else {
                if(msgObj.name){ church.name = msgObj.name; }

                if(msgObj.address){ church.address.street = msgObj.address; }

                if(msgObj.city){ church.address.city = msgObj.city; }

                if(msgObj.state){ church.address.state = msgObj.state; }

                if(msgObj.zip){ church.address.zip = msgObj.zip; }

                if(msgObj.phone){ church.phone = msgObj.phone; }

                if(msgObj.bio){ church.bio = msgObj.bio; }

                church.save(function(error, updatedChurch){
                    if(error){
                        return res.json(500, {"error": "Server error.", "mongoError": error});
                    } else {
                        return res.json(200, {"success": "Account Updated", "church": updatedChurch});
                    }
                });
            }
        })
    }
};

exports.delete = function(req, res){
    console.log('church deletion method hit.');
    var msgObj = req.query;
    console.log(msgObj);

    Church.findOne({'email': msgObj.email}, function(error, account){
        if(error){
            return res.json(500, {'error': 'Server Error', 'mongoError': error});

        } else if(!account){
            return res.json(404, {'error': 'Account you are trying to delete does not exist.'});

        } else {
            account.remove(function(error){
                if (error) {
                    res.json(500, {"error": "Server error.", "mongoError": error});
                } else {
                    res.json(200, {"message": "Account Deactivated."});
                }
            });
        }
    });
}


exports.retrieveFromSession = function(req, res){
    if(req.user){
        return res.json(200, {'success': 'Retrieved church from session', "church": req.user});
    } else {
        return res.json(400, {'error': 'No church in session.'});
    }
}

//msgObj should contain:
// {'email': email, 'password': oldPassword, 'newPassword': newPassword}
exports.resetPassword = function(req, res){
    var msgObj = req.body;

    if(!msgObj.email){
        return res.json(400, {"error": "Email required."});
    }

    if(!msgObj.password){
        return res.json(400, {"error": "Password required."});
    }

    if(!msgObj.newPassword){
        return res.json(400, {"error": "New password required."});
    }

    Church.findOne({'email': msgObj.email, 'password': msgObj.password}, function(error, account){
        if(error){
            return res.json(500, {'error': 'Server Error', 'mongoError': error});

        } else if(!account){
            return res.json(400, {'error': 'No account with that email and password combination'});

        } else {
            account.password = account.generateHash(msgObj.newPassword);
            account.save(function(error){
                if(error){
                    return res.json(500, {'error': 'Server Error', 'mongoError': error});
                } else {
                    return res.json(200, {'success': 'Successfully reset password'});
                }
            })
        }
    })

}
