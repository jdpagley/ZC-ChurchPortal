/**
 * Created by Josh Pagley on 5/1/14.
 */

//Models
var Checkin = require('../models/checkin.js');
var Member = require('../models/member.js');

//{'church': id, 'service': service, 'endDate': milliseconds, 'startDate':milliseconds }
exports.retrieve = function(req, res){
    var msgObj = req.query;

    console.log(msgObj);

    if(!msgObj.church){
        return res.json(400, {'error': "Email is required."});
    }

    if(!msgObj.service){
        return res.json(400, {'error': "Service is required."});
    }

    if(!msgObj.startDate){
        return res.json(400, {'error': "Start date is required."});
    }

    if(!msgObj.endDate){
        return res.json(400, {'error': "End date is required."});
    }

    console.log(new Date(parseInt(msgObj.startDate)));
    console.log(new Date(parseInt(msgObj.endDate)));

    Checkin.find({
        'church': msgObj.church,
        'service': msgObj.service,
        'createdAt': {$gte: new Date(parseInt(msgObj.startDate)), $lte: new Date(parseInt(msgObj.endDate))}
    }).sort({'createdAt': -1}).populate('member').exec(function(error, checkins){
            if(error){
                console.log('error');
                return res.json(500, {'error': 'Server Error', 'mongoError': error});
            } else if(!checkins){
                console.log('No checkins with that criteria.');
                return res.json(400, {'error': 'No checkins match that criteria.'});
            } else {
                console.log(checkins);
                return res.json(200, {'checkins': checkins});
            }
        });
}