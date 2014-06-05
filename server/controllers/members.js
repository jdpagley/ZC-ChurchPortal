/**
 * Created by Josh Pagley on 5/7/14.
 */

//Models
var Member = require('../models/member.js');

//{'id': churchId}
exports.retrieve = function(req, res){
    var msgObj = req.query;
    console.log(msgObj);

    if(!msgObj.id){
        return res.json(400, {'error': 'id is required.'});
    }

    Member.find({'memberships': msgObj.id}, function(error, members){
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

//    Member.findOne({'email': 'jdpagley@yahoo.com'}, function(error, members){
//        if(error){
//            console.log(error);
//        } else if (!members || members.length < 1) {
//            console.log('no members.');
//            console.log(members);
//        } else {
//            console.log(members);
//            members.memberships.push(msgObj.id);
//
//            members.save(function(error){
//                if(error){
//                    console.log(error);
//                }
//            })
//        }
//    });
//
//    Member.findOne({'email': 'pagleyjohn@yahoo.com'}, function(error, members){
//        if(error){
//            console.log(error);
//        } else if (!members || members.length < 1) {
//            console.log('no members.');
//            console.log(members);
//        } else {
//            console.log(members);
//            members.memberships.push(msgObj.id);
//
//            members.save(function(error){
//                if(error){
//                    console.log(error);
//                }
//            })
//        }
//    });
//
//    Member.findOne({'email': 'jkpagley@yahoo.com'}, function(error, members){
//        if(error){
//            console.log(error);
//        } else if (!members || members.length < 1) {
//            console.log('no members.');
//            console.log(members);
//        } else {
//            console.log(members);
//            members.memberships.push(msgObj.id);
//
//            members.save(function(error){
//                if(error){
//                    console.log(error);
//                }
//            })
//        }
//    });
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