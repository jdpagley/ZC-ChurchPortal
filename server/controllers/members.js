/**
 * Created by Josh Pagley on 5/7/14.
 */

//Models
var Member = require('../models/member.js');

exports.create = function(req, res, callback){
    var msgObj = req.body;

    if(callback){
       if(typeof callback === 'function'){
           if(!msgObj.accountEmail){
               return callback(new Error('Account email is required.'), null);
           }

           if(!msgObj.accountPassword){
               return callback(new Error('Account password is required.'), null);
           }

           var newMember = new Member();
           newMember['name'] = msgObj.name;
           newMember['email'] = msgObj.accountEmail;
           newMember['password'] = newMember.generateHash(msgObj.accountPassword);

           newMember.save(function(error, member){
               if(error){
                   callback(error, null);
               } else {
                   callback(null, member);
               }
           })
       } else {
           console.log('callback is not a function.');
       }
    }
}

//{'id': churchId}
exports.retrieve = function(req, res){
    var msgObj = req.query;
    console.log(msgObj);

    if(!msgObj.id){
        return res.json(400, {'error': 'id is required.'});
    }

    Member.find({'metadata.memberships': msgObj.id}, function(error, members){
        console.log(members);
        if(error){
            console.log(error);
            return res.json(500, {'error': 'Server Error.', 'mongoError': error});
        } else if (!members || members.length < 1){
            console.log('No members for that church id.');
            return res.json(400, {'error': 'No members for that church id.'});
        } else {
            return res.json(200, {'members': members});
        }
    });

   /* Member.findOne({'email': 'jdpagley@yahoo.com'}, function(error, members){
        if(error){
            console.log(error);
        } else if (!members || members.length < 1) {
            console.log('no members.');
            console.log(members);
        } else {
            console.log(members);
            members.memberships.push(msgObj.id);

            members.save(function(error){
                if(error){
                    console.log(error);
                }
            })
        }
    });

    Member.findOne({'email': 'pagleyjohn@yahoo.com'}, function(error, members){
        if(error){
            console.log(error);
        } else if (!members || members.length < 1) {
            console.log('no members.');
            console.log(members);
        } else {
            console.log(members);
            members.memberships.push(msgObj.id);

            members.save(function(error){
                if(error){
                    console.log(error);
                }
            })
        }
    });

    Member.findOne({'email': 'jkpagley@yahoo.com'}, function(error, members){
        if(error){
            console.log(error);
        } else if (!members || members.length < 1) {
            console.log('no members.');
            console.log(members);
        } else {
            console.log(members);
            members.memberships.push(msgObj.id);

            members.save(function(error){
                if(error){
                    console.log(error);
                }
            })
        }
    }); */

    /*Member.create({
        name: 'Josh Pagley',
        email: 'jdpagley@yahoo.com',
        password: 'josh',
        profile: {
            address: {
                street: '6312 SE 10th PL',
                city: 'Ocala',
                state: 'FL',
                'zip': '34472'
            },
            phone: '111-222-3333',
            birthday: '1/16/95',
            gender: 'male',
            relationshipStatus: 'single',
            interests: ['nodejs', 'ios', 'tech', 'programming', 'business'],
            bio: 'I strive for excellence in everything I do. I am a developer and entrepreneur.'
        },
        metadata: {
            type: 'member',
            memberships: ["53b1c48041f828d00312c2e4"],
            createdAt: new Date()
        }
    }, function(error){
        if(error){
            console.log(error);
        }
        console.log('success');
    });

    Member.create({
        name: 'John Pagley',
        email: 'japagley@yahoo.com',
        password: 'john',
        profile: {
            address: {
                street: '6312 SE 10th PL',
                city: 'Ocala',
                state: 'FL',
                'zip': '34472'
            },
            phone: '111-222-3333',
            birthday: '1/16/95',
            gender: 'male',
            relationshipStatus: 'single',
            interests: ['marketing', 'web development', 'design', 'programming', 'business'],
            bio: 'I strive for excellence in everything I do. I am a marketer and entrepreneur.'
        },
        metadata: {
            type: 'member',
            memberships: ["53b1c48041f828d00312c2e4"],
            createdAt: new Date()
        }
    }, function(error){
        if(error){
            console.log(error);
        }
        console.log('success');
    });

    Member.create({
        name: 'Jeremy Pagley',
        email: 'jkpagley@yahoo.com',
        password: 'jeremy',
        profile: {
            address: {
                street: '6312 SE 10th PL',
                city: 'Ocala',
                state: 'FL',
                'zip': '34472'
            },
            phone: '111-222-3333',
            birthday: '1/16/95',
            gender: 'male',
            relationshipStatus: 'single',
            interests: ['photoshop', 'ios', 'games', 'programming', 'business'],
            bio: 'I strive for excellence in everything I do. I am a developer and entrepreneur.'
        },
        metadata: {
            type: 'member',
            memberships: ["53b1c48041f828d00312c2e4"],
            createdAt: new Date()
        }
    }, function(error){
        if(error){
            console.log(error);
        }
        console.log('success');
    });

    Member.create({
        name: 'Jeff Pagley',
        email: 'jjpagley@yahoo.com',
        password: 'jeff',
        profile: {
            address: {
                street: '6312 SE 10th PL',
                city: 'Ocala',
                state: 'FL',
                'zip': '34472'
            },
            phone: '111-222-3333',
            birthday: '1/16/95',
            gender: 'male',
            relationshipStatus: 'single',
            interests: ['tech', 'being the best', 'girls', 'working out', 'microsoft'],
            bio: 'I strive for excellence in everything I do. I am an it admin.'
        },
        metadata: {
            type: 'member',
            memberships: ["53b1c48041f828d00312c2e4"],
            createdAt: new Date()
        }
    }, function(error){
        if(error){
            console.log(error);
        }
        console.log('success');
    });*/

}

//{'id': memberId}
exports.retrieveMemberById = function(req, res){
    var msgObj = req.query;
    console.log(msgObj);

    if(!msgObj.id){
        return res.json(400, {'error': 'id is required.'});
    }

    Member.findOne({'_id': msgObj.id}, function(error, member){
        if(error){
            console.log(error);
            return res.json(500, {'error': 'Server Error.', 'mongoError': error});
        } else if (!member){
            console.log('No member with that id.');
            return res.json(400, {'error': 'No member with that id.'});
        } else {
            return res.json(200, {'member': member});
        }
    });
}

exports.retrieveChurchAdminMember = function(req, email, password, done){
    // Find church whose email is the same as the forms email
    // we are checking to see if the church trying to login exists.
    Member.findOne({'email': email}).populate('admin_of').exec(function(error, member){
        // if there are any errors, return the error before anything else
        if(error){
            return done(error);
        }

        // If no church is found then return the message
        if(!member){
            return done(null, false, req.flash('loginMessage', 'No Administrative user found.'));
        }

        //If church is found but password is wrong
        if (!member.validPassword(password)){
            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
        }

        // all is well, return successful church
        return done(null, member);
    });
}