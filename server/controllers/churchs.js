/**
 * Created by Josh Pagley 3/3/2014
 * controllers/church.js handles creating, retrieving, updating and deleting church profiles.
 * "CRUD" operations for churches.
 */

var validator = require('validator'),
    async = require('async'),
    _ = require('underscore'),
    members = require('./members.js');

//Models
var Church = require('../models/church.js'),
    Member = require('../models/member.js');

//// Create New Church expects json object in req.body
//// {'email': email, 'password': password, 'name': name, 'address': streetAddress, 'city': city, 'state': state, 'zip': zip, 'phone': phone}
//exports.create = function(req, email, password, done){
//    var msgObj = req.body;
//    console.log(msgObj);
//
//    if(!msgObj){
//        return done(null, false, req.flash('signupMessage', 'POST Body is required'))
//    }
//
//    if(!msgObj.email){
//        return done(null, false, req.flash('signupMessage', 'Please provide an Email Address.'));
//    } else {
//        try {
//            validator.isEmail(msgObj.email)
//        } catch (exception){
//            return done(null, false, req.flash('signupMessage', 'Please use a valid Email Address.'));
//        }
//    }
//
//    if(!msgObj.password){
//        return done(null, false, req.flash('signupMessage', 'Please provide a password that has more than 3 characters.'));
//    }
//
//    if(!msgObj.name){
//        return done(null, false, req.flash('signupMessage', 'Please provide a church name.'));
//    }
//
//    if(!msgObj.address){
//        return done(null, false, req.flash('signupMessage', 'Please provide a street address.'));
//    }
//
//    if(!msgObj.city){
//        return done(null, false, req.flash('signupMessage', 'Please provide the city.'));;
//    }
//
//    if(!msgObj.state){
//        return done(null, false, req.flash('signupMessage', 'Please select a state.'));
//    }
//
//    if(!msgObj.zip){
//        return done(null, false, req.flash('signupMessage', 'Please provide a zip.'));
//    }
//
//    // This method is checking to see if the church email the church is using to create
//    // a new account with already exists with another church.
//    Church.findOne({'email': email}, function(error, church){
//        if(error){
//            return done(error);
//        }
//        // Check to see if there is already a church with that email
//        if(church){
//            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
//        } else {
//            // If there is no church with that email then create the church.
//            var newChurch = new Church();
//
//            if(email){ newChurch.email = email; }
//            if(password){ newChurch.password = newChurch.generateHash(password); }
//            if(msgObj.name){ newChurch.name = msgObj.name; }
//            if(msgObj.address){ newChurch.address.street = msgObj.address; }
//            if(msgObj.city){ newChurch.address.city = msgObj.city; }
//            if(msgObj.state){ newChurch.address.state = msgObj.state; }
//            if(msgObj.zip){ newChurch.address.zip = msgObj.zip; }
//            if(msgObj.website){ newChurch.website = msgObj.website; }
//            if(msgObj.phone){ newChurch.phone = msgObj.phone; }
//            if(msgObj.bio){ newChurch.bio = msgObj.bio; }
//
//            // save the church
//            newChurch.save(function(error){
//                if(error){
//                    console.log('Error creating new church: ' + error);
//                    throw error;
//                }
//
//                return done(null, newChurch);
//            });
//
//        }
//    });
//};

// Create New Church expects json object in req.body
// {'email': email, 'name': name, 'address': streetAddress, 'city': city, 'state': state, 'zip': zip, 'phone': phone,
// 'website': url, 'denomination': denomination, 'bio': bio, 'services': [{'day': day, 'time': time}], 'accountEmail': email,
// 'accountPassword': password}
exports.create = function(req, done){
    var msgObj = req.body;
    console.log(msgObj);

    if(!msgObj){
        return done(null, false, {message: 'POST body is required.'});
    }

    if(!msgObj.email){
        return done(null, false, {message: 'Email is required.'})
    } else {
        try {
            validator.isEmail(msgObj.email)
        } catch (exception){
            return done(null, false, {message: 'Please specify a valid email for your church email address.'});
        }
    }

    if(!msgObj.name){
        return done(null, false, {message: 'Church name is required.'})
    }

    if(!msgObj.address){
        return done(null, false, {message: 'Church address is required.'});
    }

    if(!msgObj.city){
        return done(null, false, {message: 'City is required.'})
    }

    if(!msgObj.state){
        return done(null, false, {message: 'State is required.'})
    }

    if(!msgObj.zip){
        return done(null, false, {message: 'Zip code is required.'})
    }

    if(!msgObj.accountEmail){
        return done(null, false, {message: 'Administrative account email is required.'});
    } else {
        try {
            validator.isEmail(msgObj.email)
        } catch (exception){
            return done(null, false, {message: 'Please specify a valid email for your church administration account.'});
        }
    }

    if(!msgObj.accountPassword){
        return done(null, false, {message: 'Administrative account password is required.'});
    }

    //This method is checking to see if the email for administration account already exists.
    Member.findOne({'email': msgObj.accountEmail}, function(error, church){
        if(error){
            return done(null, false, {code: 500, message: 'Oops! We are having trouble creating your account at this time. Please try again later.'});
        }
        if(church){
            return done(null, false, {message: 'Administration account email is already in use.'});
        } else {
            async.waterfall([
                function(callback){
                    //Second create new church organization
                    var newChurch = new Church();

                    if(msgObj.email){ newChurch.email = msgObj.email; }
                    if(msgObj.name){ newChurch.name = msgObj.name; }
                    if(msgObj.address){ newChurch.address.street = msgObj.address; }
                    if(msgObj.city){ newChurch.address.city = msgObj.city; }
                    if(msgObj.state){ newChurch.address.state = msgObj.state; }
                    if(msgObj.zip){ newChurch.address.zip = msgObj.zip; }
                    if(msgObj.website){ newChurch.website = msgObj.website; }
                    if(msgObj.phone){ newChurch.phone = msgObj.phone; }
                    if(msgObj.denomination){ newChurch.denomination = msgObj.denomination; }
                    if(msgObj.bio){ newChurch.bio = msgObj.bio; }

                    async.each(msgObj.services,
                        function(service, done){
                            newChurch.services.push({day: service.day, time: service.time});
                            done();
                        },
                        function(error){
                            newChurch.save(function(error, church){
                                if(error){
                                    callback(error);
                                }
                                return callback(null, church);
                            });
                        });

                },
                function(church, callback){
                    //First create new admin account for church.
                    var newMember = new Member();
                    newMember['name'] = msgObj.name;
                    newMember['email'] = msgObj.accountEmail;
                    newMember['password'] = newMember.generateHash(msgObj.accountPassword);
                    newMember['admin_of'].push(church._id);
                    newMember['type'] = 'admin';


                    newMember.save(function(error, member){
                        if(error){
                            callback(error, null);
                        } else {
                            var newAdmin = { member: member._id, authorization: 'admin'};
                            Church.findByIdAndUpdate(church._id, {$push: {administrators: newAdmin}}, function(error, church){
                                if(error){
                                    callback(error);
                                } else if (!church) {
                                    callback(new Error('No account updated.'));
                                } else {
                                    callback(null, member, church);
                                }
                            });
                        }
                    });
                }],
                function(error, member, church){
                    if(error){
                        console.log(error);
                        return done(null, false, {code: 500, message: 'Oops! We are having trouble creating your account at this time. Please try again later.'});
                    } else if(!member){
                        console.log('No member exists.');
                        return done(null, false, {code: 500, message: 'Oops! We are having some trouble at this time. Please try again later.'});
                    } else {
                        console.log('Member exists!');
                        console.log(member);
                        return done(null, member);
                    }
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

    console.log(msgObj);

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
                        //{'statusCode': 500, 'error': 'Server Error.', 'mongoError': 'error'};
                    } else {
                        return res.json(200, {"success": "Account Updated", "church": updatedChurch});
                        //{'statusCode': 200, 'success': 'Account Updated.', 'church': 'updateChurch'};
                    }
                });
            }
        })
    }
};

exports.delete = function(req, res){
    console.log('church deletion method hit.');
    var msgObj = req.query;

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

        Member.findById(req.user._id).populate('admin_of').exec(function(error, member){
            if(error){
                return res.json(500, {'error': 'Error retrieving account information from session.'});
            } else if (!member){
                return res.json(500, {'error': 'No administrative account with that Id.'});
            } else {
                return res.json(200, {'success': 'Retrieved account from session.', "church": member.admin_of[0], 'admin': member});
            }
        });
    } else {
        return res.json(400, {'error': 'No account in session.'});
    }
}

//msgObj should contain:
// {'email': email, 'password': oldPassword, 'newPassword': newPassword}
exports.resetPassword = function(req, res){
    var msgObj = req.body;

    console.log(msgObj);

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

// updateChurchService expects json object in req.body
// services is an array of service objects.
// {'email': email, services: [{'day': serviceDay, 'time': serviceTime}]}
exports.updateChurchServices = function(req, res){
    var msgObj = req.body;
    console.log(msgObj);

    if(!msgObj.email){
        return res.json(400, {"error": "Email required."});
    }

    if(!msgObj.services && msgObj.services.length !== 1){
        return res.json(400, {"error": 'Services required.'})
    }

    Church.findOne({'email': msgObj.email}, function(error, account){
        if(error){
            console.log('findOne: ' + error);
            return res.json(500, {'error': 'Server Error', 'mongoError': error});

        } else if(!account){
            return res.json(400, {'error': 'No account with that email'});

        } else {
            account.services = msgObj.services;

            account.save(function(error){
                if(error){
                    console.log('account.save: ' + error);
                    return res.json(500, {'error': 'Server Error', 'mongoError': error});
                } else {
                    return res.json(200, {'success': 'Successfully updated services.'});
                }
            })
        }
    })
}
