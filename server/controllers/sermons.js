/**
 * Created by Josh Pagley on 4/19/14.
 */

var async = require('async');

//Models
var Sermon = require('../models/sermon.js');
var Church = require('../models/church.js');

//{'owner': id, 'title': string, 'series': string, 'part': number, 'speaker': string, 'notes': string, 'audio': url, 'video':url}
exports.create = function(req, res){
    var msgObj = req.body;

    if(!msgObj){
        return res.json(400, {"error": "POST body is required with valid parameters"});
    }

    if(!msgObj.owner){
        return res.json(400, {"error": "Owner required."});
    }

    if(!msgObj.title){
        return res.json(400, {"error": "Title required."});
    }

    var newSermon = {};

    async.series([
        function(callback){
            Church.findOne({'_id': msgObj.owner}, function(error, sermon){
                if(error){
                    callback(error);
                } else if (!sermon){
                    callback(new Error('Owner does not exist.'));
                } else {
                    callback();
                }
            });
        },
        function(callback){
            if(msgObj.owner){ newSermon.owner = msgObj.owner; }
            if(msgObj.title){ newSermon.title = msgObj.title; }
            if(msgObj.series){ newSermon.series = msgObj.series; }
            if(msgObj.part){ newSermon.part = msgObj.part; }
            if(msgObj.speaker){ newSermon.speaker = msgObj.speaker; }
            if(msgObj.audio){ newSermon.audio = msgObj.audio; }
            if(msgObj.notes){ newSermon.notes = msgObj.notes; }
            if(msgObj.video){ newSermon.video = msgObj.video}

            callback();
        }],
        function(error){
            if(error){
                res.json(500, {'error': error});
            } else {
                Sermon.create(newSermon, function(error, sermon){
                    if(error){
                        return res.json(500, {'error': 'Server Error.', 'mongoError': error});
                    } else {
                        return res.json(200, {'success': 'Successfully created sermon.', 'sermon': sermon});
                    }
                });
            }
        });

}

//{'owner': id}
exports.retrieveAllSermons = function(req, res){
    var msgObj = req.query;

    if(!msgObj){
        return res.json(400, {'error': 'POST body is required.'});
    }

    if(!msgObj.owner){
        return res.json(400, {'error': 'churchID is required.'});
    }

    if(msgObj.owner){

        Sermon.find({'owner': msgObj.owner}).sort({'createdAt': -1}).exec(function(error, sermons){
            if(error){
                console.log(error);
                return res.json(500, {'error': 'Server Error', 'mongoError': error});
            } else if (!sermons){
                return res.json(200, {'message': 'Owner has no sermons.'});
            } else {
                //reverse the order of the comments in the array.
                res.json(200, {'success': 'Successfully retrieved sermons.', 'sermons': sermons});
                return;
            }
        });
    }
}

// {'id': id}
exports.retrieveSermonById = function(req, res){
    var msgObj = req.query;
    console.log(msgObj);

    if(!msgObj){
        return res.json(400, {'error': 'POST body is required.'});
    }

    if(!msgObj.id){
        return res.json(400, {'error': 'churchID is required.'});
    }

    if(msgObj.id){

        Sermon.findById(msgObj.id, function(error, sermon){
            if(error){
                console.log(error);
                return res.json(500, {'error': 'Server Error', 'mongoError': error});
            } else if (!sermon){
                console.log('No sermon with that _id.');
                return res.json(400, {'error': 'No sermon with that _id'});
            } else {
                //reverse the order of the comments in the array.
                res.json(200, {'success': 'Successfully retrieved sermon.', 'sermon': sermon});
                return;
            }
        });
    }
}

//{'id': id}
exports.update = function(req, res){
    var msgObj = req.body;

    if(!msgObj){
        return res.json(400, {"error": "POST body is required with valid parameters"});
    }

    if(!msgObj._id){
        return res.json(400, {"error": "id required."});
    }

    if(msgObj._id){
        Sermon.findById(msgObj._id, function(error, sermon){
            if(error){
                return res.json(500, {'error': 'Server Error.', 'mongoError': error});
            } else if (!sermon){
                return res.json(400, {'error': 'Sermon with that id does not exist.'});
            } else {

                if(msgObj.title){ sermon.title = msgObj.title; }
                if(msgObj.series){ sermon.series = msgObj.series; }
                if(msgObj.part){ sermon.part = msgObj.part; }
                if(msgObj.speaker){ sermon.speaker = msgObj.speaker; }
                if(msgObj.audio){ sermon.audio = msgObj.audio; }
                if(msgObj.notes){ sermon.notes = msgObj.notes; }
                if(msgObj.video){ sermon.video = msgObj.video}

                sermon.save(function(error, updatedSermon){
                    if(error){
                        return res.json(500, {'error': 'Server Error.', 'mongoError': error});
                    } else {
                        console.log('Successfully updated sermon: ' + JSON.stringify(updatedSermon));
                        return res.json(200, {'success': 'Successfully updated sermon.', 'sermon': updatedSermon});
                    }
                })
            }
        });
    }
}

//{'id': id}
exports.delete = function(req, res){
    var msgObj = req.query;

    if(!msgObj){
        return res.json(400, {'error': 'DELETE query is required.'});
    }

    if(!msgObj.id){
        return res.json(400, {'error': 'id is required.'});
    }

    if(msgObj.id){
        Sermon.findById(msgObj.id, function(error, sermon){
            if(error){
                return res.json(500, {'error': 'Server Error.', 'mongoError': error});
            } else if (!sermon){
                return res.json(400, {'error': 'Sermon with that id does not exist.'});
            } else {
                sermon.remove(function(error){
                    if(error){
                        return res.json(500, {'error': 'Server Error.', 'mongoError': error});
                    } else {
                        return res.json(200, {'success': 'Sermon has been removed.'});
                    }
                });
            }
        });
    }
}

// createComment function expects req.body to contain json object:
// {'owner': id, 'authorType': church, 'author': id, 'authorName': name, 'body': string  }
exports.createComment = function(req, res){
    var msgObj = req.body;
    console.log(msgObj)

    if(!msgObj){
        return res.json(400, {'error': 'POST body is required.'});
    }

    if(!msgObj.owner){
        return res.json(400, {'error': 'Owner Id is required.'});
    }

    if(!msgObj.authorType){
        return res.json(400, {'error': 'Author Type is required.'});
    }

    if(!msgObj.author){
        return res.json(400, {'error': 'Author is required.'});
    }

    if(!msgObj.authorName){
        return res.json(400, {'error': 'Author name is required.'});
    }

    if(!msgObj.body){
        return res.json(400, {'error': 'Body is required.'});
    }

    Sermon.findById(msgObj.owner, function(error, sermon){
        if(error){
            return res.json(500, {'error': 'Server Error.', 'mongoError': error});
        } else if (!sermon){
            return res.json(400, {'error': 'No post with that owner ID'});
        } else {

            console.log('post: ' + JSON.stringify(sermon));

            sermon.comments.push({
                'authorType': msgObj.authorType,
                'author_church': msgObj.author,
                'author_name': msgObj.authorName,
                'body': msgObj.body
            });

            sermon.save(function(error, post){
                if(error){
                    return res.json(500, {'error': 'Server Error.', 'mongoError': error});
                } else {
                    console.log('New comment created on post: ' + sermon.comments[sermon.comments.length - 1]);
                    return res.json(200, {'success': 'Successfully added new comment.', 'comment': sermon.comments[sermon.comments.length - 1]});
                }
            });
        }
    });
}