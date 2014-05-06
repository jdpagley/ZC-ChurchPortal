/**
 * Created by Josh Pagley on 5/1/14.
 */

//Models
var Checkin = require('../models/checkin.js');
var Member = require('../models/member.js');

//{'church': id, 'service': service, 'endDate': milliseconds, 'startDate':milliseconds }
exports.retrieveCheckinsForServiceAndDateRange = function(req, res){
    var msgObj = req.query;

    console.log(msgObj);

    if(!msgObj.church){
        return res.json(400, {'error': "Email is required."});
    }

    if(!msgObj.service){
        return res.json(400, {'error': "Service is required."});
    }

    if(msgObj.startDate && msgObj.endDate && msgObj.startDate !== 'NaN' && msgObj.endDate !== 'NaN'){
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
            } else if(!checkins && checkins.length > 1){
                console.log('No checkins match the service or date range.');
                return res.json(400, {'error': 'No checkins match the service or date range.'});
            } else {
                console.log(checkins);
                return res.json(200, {'checkins': checkins});
            }
        });
    } else {
        console.log('Please spicify a date range');
        return res.json(400, {'error': 'Please specify a "Start Date" and "End Date". Thanks!'})
    }

}

//{'church':id, 'startDate': milliseconds, 'endDate': milliseconds}
exports.retrieveCheckinsForDateRange = function(req, res){
    var msgObj = req.query;

    console.log(msgObj);

    if(!msgObj.church){
        return res.json(400, {'error': "Email is required."});
    }


    if(msgObj.startDate && msgObj.endDate && msgObj.startDate !== 'NaN' && msgObj.endDate !== 'NaN'){
        console.log(new Date(parseInt(msgObj.startDate)));
        console.log(new Date(parseInt(msgObj.endDate)));

        Checkin.find({
            'church': msgObj.church,
            'createdAt': {$gte: new Date(parseInt(msgObj.startDate)), $lte: new Date(parseInt(msgObj.endDate))}
        }).sort({'createdAt': -1}).populate('member').exec(function(error, checkins){
            if(error){
                console.log('error');
                return res.json(500, {'error': 'Server Error', 'mongoError': error});
            } else if(!checkins){
                console.log('No checkins within those date ranges.');
                return res.json(400, {'error': 'No checkins within those date ranges.'});
            } else {
                console.log(checkins);
                return res.json(200, {'checkins': checkins});
            }
        });
    } else {
        console.log('Please spicify a date range');
        return res.json(400, {'error': 'Please specify a "Start Date" and "End Date". Thanks!'})
    }
}

