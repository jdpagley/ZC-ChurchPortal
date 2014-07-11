/**
 * Created by Josh Pagley on 7/9/14.
 *
 * Description: This will handle the like and unlike functionality for
 * posts.
 */

var async = require('async');

//Models
var Post = require('../models/post.js');

/**
 * Add like to Post
 *
 * Description: async.waterfall()
 *              (1) Check to see if member has already like post. If member has already liked
 *              post then firstTimeLike will be false. If it is the members first time liking
 *              the post firstTimeLike will be true.
 *              (2) If firstTimeLike is true then push new like onto post.likes array.
 *              If firstTimeLike is false then do nothing and call callback.
 *              (3) If firstTimeLike is true then save post document and return new like to client.
 *              If firstTimeLike is false then do nothing and respond to client.
 *
 * req.body: {'postID': id, 'by': id, 'name': accountName}
 */
exports.create = function(req, res){
    var msgObj = req.body;

    if(!msgObj){
        return res.json(400, {'error': 'POST body is required.'});
    }

    if(!msgObj.by){
        return res.json(400, {'error': 'Author is required.'});
    }

    if(!msgObj.name){
        return res.json(400, {'error': 'Author name is required.'});
    }

    if(!msgObj.postID){
        return res.json(400, {'error': 'Post _id is required.'});
    }

    Post.findById(msgObj.postID, function(error, post){
        if(error){
            return res.json(500, {'error': 'Server error.', 'mongoError': error});
        } else if (!post){
            return res.json(500, {'error': 'No post for that _id.'});
        } else {
            async.waterfall([
                function(done){
                    var firstTimeLike = post.likes.every(function(like){
                        if(like.by == msgObj.by){
                            return false;
                        } else {
                            return true;
                        }
                    });

                    console.log(firstTimeLike);
                    done(null, firstTimeLike);
                },
                function(firstTimeLike, done){
                    if(firstTimeLike){
                        console.log('Adding new like to post.');
                        var like = {
                            by: msgObj.by,
                            name: msgObj.name,
                            ts: new Date()
                        };

                        post.likes.push(like);

                        done(null, firstTimeLike);
                    } else {
                        done(null, firstTimeLike);
                    }
                }],
                function(error, firstTimeLike){
                    if(firstTimeLike){
                        console.log('Saving post with new like.');
                        post.save(function(error, post){
                            if(error){
                                return res.json(500, {'error': 'Server error.', 'mongoError': error});
                            } else {
                                return res.json(200, {'success': 'Successfully liked post.', 'like': post.likes.splice(post.likes.length - 1, 1)[0]});
                            }
                        })
                    } else {
                        return res.json(200, {'success': 'Member has already like this post.'});
                    }
                });
        }
    });
}

/**
 * Delete Like
 *
 * req.query: {'postID': id, 'likeID': id}
 */

exports.delete = function(req, res){
    var msgObj = req.query;

    if(!msgObj){
        return res.json(400, {'error': 'Query is required.'});
    }

    if(!msgObj.postID){
        return res.json(400, {'error': 'Post _id is required.'});
    }

    if(!msgObj.likeID){
        return res.json(400, {'error': 'Like _id is required.'});
    }

    Post.findById(msgObj.postID, function(error, post){
        if(error){
            return res.json(500, {'error': 'Server error.', 'mongoError': error});
        } else if (!post){
            return res.json(500, {'error': 'No post for that _id.'});
        } else {
            post.likes.id(msgObj.likeID).remove();

            post.save(function(error){
                if(error){
                    return res.json(500, {'error': 'Server error.', 'mongoError': error});
                } else {
                    return res.json(200, {'success': 'Successfully unliked post.'})
                }
            })
        }
    })
}