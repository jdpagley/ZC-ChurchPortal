/**
 * Created by Josh Pagley on 4/19/14.
 */

var async = require('async');
var _ = require('underscore');

//Models
var Sermon = require('../models/sermon.js');
var Church = require('../models/church.js');
var Series = require('../models/series.js')

/**
 * Create New Sermon:
 *
 * New Series = True.
 * async.waterfall():
 *  (1) Create new series and pass on new series object to async callback.
 *  (2) Create new sermon using the series _id passed to it. Pass on new
 *      sermon object to async callback function.
 *  (3) Push newly created sermon _id on to the sermons array of the
 *      series object.
 *
 * req.body: {
 *  owner: Church_id,
 *  series: { _id: Existing_Series_ID, name: string, newSeries: boolean},
 *  title: Series_title,
 *  part: Series_Part,
 *  speaker: Sermon_Speaker,
 *  tags: [Array_of_string_tags],
 *  video: video_file_for_sermon,
 *  audio: audio_file_for_sermon,
 *  notes: notes_for_sermon
 * }
 */
exports.create = function(req, res){
    var msgObj = req.body;
    console.log(msgObj);

    if(!msgObj){
        return res.json(400, {"error": "POST body is required with valid parameters"});
    }

    if(!msgObj.owner){
        return res.json(400, {"error": "Owner required."});
    }

    if(!msgObj.title){
        return res.json(400, {"error": "Title required."});
    }

    if(!msgObj.series){
        return res.json(400, {"error": "Series object is required."});
    }

    if(msgObj.series.newSeries){
        console.log('New Series');
        if(!msgObj.series.name){
            return res.json(400, {"error": "New series name is required."});
        }

        async.waterfall([
            function(done){
                console.log('Step 1');
                var series = {};
                series['name'] = msgObj.series.name;
                series['owner'] = msgObj.owner;
                series['ts'] = new Date();
                Series.create(series, function(error, series){
                    if(error){
                        done(error);
                    } else if (!series){
                        done(new Error('No new series object'));
                    } else {
                        done(null, series);
                    }
                });
            },
            function(series, done){
                console.log('Step 2');
                var sermon = {};
                sermon['owner'] = msgObj.owner;
                sermon['series'] = series._id;
                sermon['series_name'] = series.name;
                sermon['title'] = msgObj.title;
                sermon['part'] = msgObj.part || "";
                sermon['speaker'] = msgObj.speaker || "";
                sermon['tags']  = msgObj.tags;
                sermon['ts'] = new Date();
                sermon['content'] = {};
                sermon['content']['audio'] = msgObj.audio;
                sermon['content']['video'] = msgObj.video;
                sermon['content']['notes'] = msgObj.notes;

                Sermon.create(sermon, function(error, sermon){
                    if(error){
                        done(error);
                    } else if (!sermon){
                        done(new Error('No new series object.'));
                    } else {
                        done(null, sermon);
                    }
                });
            },
            function(sermon, done){
                console.log('Step 3');
                Series.findByIdAndUpdate(sermon.series, {$push: {sermons: sermon._id}}).populate('sermons').exec(function(error, series){
                    if(error){
                        done(error);
                    } else if (!series){
                        done(new Error('No new series object.'));
                    } else {
                        done(null, sermon, series);
                    }
                });
            }],
            function(error, sermon, series){
                console.log('Final Step');
                if(error){
                    console.log(error);
                    return res.json(500, {"error": error});
                } else {
                    return res.json(200, {'success': 'Successfully created new series and added new sermon.', 'sermon': sermon, 'series': series});
                }
            });
    } else if(!msgObj.series.newSeries) {
        if(msgObj.series._id){

            if(!msgObj.series.name){
                return res.json(400, {"error": 'Series name is required.'});
            }

            async.waterfall([
                function(done){
                    var sermon = {};
                    sermon['owner'] = msgObj.owner;
                    sermon['series'] = msgObj.series._id;
                    sermon['series_name'] = msgObj.series.name;
                    sermon['title'] = msgObj.title;
                    sermon['part'] = msgObj.part || "";
                    sermon['speaker'] = msgObj.speaker || "";
                    sermon['tags']  = msgObj.tags;
                    sermon['ts'] = new Date();
                    sermon['content'] = {};
                    sermon['content']['audio'] = msgObj.audio;
                    sermon['content']['video'] = msgObj.video;
                    sermon['content']['notes'] = msgObj.notes;

                    Sermon.create(sermon, function(error, sermon){
                        if(error){
                            done(error);
                        } else if (!sermon){
                            done(new Error('No new series object.'));
                        } else {
                            done(null, sermon);
                        }
                    });
                },
                function(sermon, done){
                    Series.findByIdAndUpdate(sermon.series, {$push: {sermons: sermon._id}}).populate('sermons').exec(function(error, series){
                        if(error){
                            done(error);
                        } else if (!series){
                            done(new Error('No new series object.'));
                        } else {
                            done(null, sermon, series);
                        }
                    });
                }],
                function(error, sermon, series){
                    if(error){
                        console.log(error);
                        return res.json(500, {"error": error});
                    } else {
                        return res.json(200, {'success': 'Successfully added new sermon to existing series.', 'sermon': sermon, 'series': series});
                    }
                });
        } else {
            return res.json(400, {'error': 'Existing series _id is required to add new sermon to series.'});
        }
    }

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

    async.waterfall([
        function(done){
            Series.find({'owner': msgObj.owner}).populate('sermons').exec(function(error, series){
                if(error){
                    done(error);
                } else if (!series){
                    done(new Error('Owner has no series.'));
                } else {
                    done(null, series);
                }
            });
        },
        function(series, done){
            var sermons = [];
            if(series.length > 0){
                async.series([
                    function(done){
                        series.forEach(function(element){
                            sermons = sermons.concat(element.sermons);
                        });
                        done();
                    }],
                    function(){
                        done(null, sermons, series);
                    });
            } else {
                done(null);
            }
        }],
        function(error, sermons, series){
            if(error){
                return res.json(500, {'error': error});
            } else if(series){
                return res.json(200, {'success': 'Successfully retrieved', 'sermons': sermons, 'series': series});
            }
        })


}

// {'id': sermonId}
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
                if(msgObj.part){ sermon.part = msgObj.part; }
                if(msgObj.speaker){ sermon.speaker = msgObj.speaker; }
                if(msgObj.audio){ sermon.content.audio = msgObj.audio; }
                if(msgObj.notes){ sermon.content.notes = msgObj.notes; }
                if(msgObj.video){ sermon.content.video = msgObj.video; }
                if(msgObj.tags){ sermon.tags = msgObj.tags; }

                sermon.save(function(error, updatedSermon){
                    if(error){
                        return res.json(500, {'error': 'Server Error.', 'mongoError': error});
                    } else {
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

    if(!msgObj._id){
        return res.json(400, {'error': 'Sermon id is required.'});
    }

    if(!msgObj.series){
        return res.json(400, {'error': 'Sermon series is required.'});
    }

    async.series([
        function(done){
            Series.findById(msgObj.series, function(error, series){
                if(error){
                    done(error);
                } else if(!series){
                    done(new Error('No series object for that series ID.'));
                } else {
                    series.sermons.forEach(function(element, index){
                        if(element == msgObj._id){
                            series.sermons.splice(index, 1);
                        }
                    });

                    series.save(function(error){
                        if(error){
                            done(error);
                        } else {
                            done();
                        }
                    })
                }
            })
        },
        function(done){
            if(msgObj._id){
                Sermon.findByIdAndRemove(msgObj._id, function(error){
                    if(error){
                        done(error);
                    } else {
                        done();
                    }
                });
            }
        },
        function(done){
            //Remove all posts associated with sermon.
            done();
        }],
        function(error){
            if(error){
                return res.json(500, {'error': error});
            } else {
                return res.json(200, {'success': 'Successfully deleted sermon.'});
            }
        });
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
            return res.json(400, {'error': 'No sermon with that owner ID'});
        } else {

            console.log('sermon: ' + JSON.stringify(sermon));

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

//{'sermonId': id, 'commentId': id, 'author': id, 'authorName':name}
exports.likeSermonComment = function(req, res){
    var msgObj = req.body;
    console.log(msgObj)

    if(!msgObj){
        return res.json(400, {'error': 'POST body is required.'});
    }

    if(!msgObj.commentId){
        return res.json(400, {'error': 'CommentId is required.'});
    }

    if(!msgObj.sermonId){
        return res.json(400, {'error': 'SermonId is required.'});
    }

    if(!msgObj.author){
        return res.json(400, {'error': 'Author is required.'});
    }

    if(!msgObj.authorName){
        return res.json(400, {'error': 'Author name is required.'});
    }

    Sermon.findById(msgObj.sermonId, function(error, sermon){
        if(error){
            return res.json(500, {'error': 'Server Error.', 'mongoError': error});
        } else if (!sermon){
            return res.json(400, {'error': 'No sermon with that ID'});
        } else {

            console.log('sermon: ' + JSON.stringify(sermon));

            //Make sure church doesn't like the same comment more than once.
            async.series([
                    //1. Check to see if church has liked comment yet.
                function(done){
                    //1.1 Loop through likes and check to see if author already exists on a like doc
                    async.each(sermon.comments.id(msgObj.commentId).likes,
                        function(element, callback){
                            if(element.author_church == msgObj.author){
                                callback(new Error('Cant like comment twice.'));
                            } else {
                                callback();
                            }
                        },
                        function(error){
                            if(error){
                                console.log('async.each error: ' + error);
                                done(error);
                            } else {
                                done();
                            }
                        })
                }],
                function(error){
                    if(error){
                        //2. Send back error message if church has already liked comment.
                        console.log('error: ' + error);
                        return res.json(400, {'error': error.Error});
                    } else {
                        //3. Save new comment like and return to client.
                        sermon.comments.id(msgObj.commentId).likes.push({
                            'author_church': msgObj.author,
                            'author_name': msgObj.authorName
                        });

                        sermon.save(function(error, updatedSermon){
                            if(error){
                                return res.json(500, {'error': 'Server Error.', 'mongoError': error});
                            } else {
                                var commentLikesLength = updatedSermon.comments.id(msgObj.commentId).likes.length;
                                console.log('New like: ' + updatedSermon.comments.id(msgObj.commentId).likes[commentLikesLength - 1]);
                                return res.json(200, {'success': 'Successfully liked comment.', 'like': updatedSermon.comments.id(msgObj.commentId).likes[commentLikesLength - 1]});
                            }
                        });
                    }
                })
        }
    });
}