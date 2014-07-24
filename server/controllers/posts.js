/**
 * Created by Josh Pagley on 4/3/14.
 */

var validator = require('validator');
var async = require('async');
var _ = require('underscore');

//Models
var Post = require('../models/post.js');
var CommentPage = require('../models/commentPage.js');

/**
 * Create New Post
 *
 * req body: {'author': authorID, 'owner': ownerID, 'text': postText}
 *
 * author: This is the person who created the post. This could be the church or a member.
 * owner: This is the church id of where the post was posted to. This is always a church.
 * text: This is the content of the post.
 */
exports.create = function(req, res){
    var msgObj = req.body;
    console.log(msgObj);

    if(!msgObj){
        return res.json(400, {'error': 'POST body is required.'});
    }

    if(!msgObj.author){
        return res.json(400, {'error': 'postAuthor required.'});
    }

    if(!msgObj.owner){
        return res.json(400, {'error': 'postRecipient required.'});
    }

    if(!msgObj.text){
        return res.json(400, {'error': 'Post message required.'});
    }

    if(!msgObj.type){
        return res.json(400, {'error': 'Post type required.'});
    }

    var newPost = {
        'type': msgObj.type,
        'author': msgObj.author,
        'owner': msgObj.owner,
        'num_comment_pages': 0,
        'num_comments': 0,
        'detail': {
            'text': msgObj.text
        }
    }

    Post.create(newPost, function(error, post){
        if(error){
            return res.json(500, {'error': 'Server Error', 'mongoError': error});
        } else {
            Post.findById(post._id).populate('author').exec(function(error, populatedPost){
                if(error){
                    return res.json(500, {'error': 'Server Error', 'mongoError': error});
                } else {
                    return res.json(200, {'success': 'Successfully created new post.', 'post': populatedPost});
                }
            })
        }
    });
}

/**
 * Retrieve Posts
 *
 * This will retrieve all the posts for the
 * church's main feed.
 *
 * req.query: {'churchID': id}
 */
exports.retrieve = function(req, res){
    var msgObj = req.query;
    console.log(msgObj);

    if(!msgObj){
        return res.json(400, {'error': 'POST body is required.'});
    }

    if(!msgObj.owner){
        return res.json(400, {'error': 'Owner _id is required.'});
    }

    if(msgObj.owner){

        var options = [
            {path: 'author'}
        ];

        Post.find({'owner': msgObj.owner}).skip(msgObj.num_posts || 0).limit(50).populate(options).exec(function(error, posts){
            if(error){
                console.log(error);
                return res.json(500, {'error': 'Server Error', 'mongoError': error});
            } else {
                console.log(posts);
                return res.json(200, {'success': 'Successfully retrieved posts.', 'posts': posts});
            }
        })
    }
}

/**
 * Delete Post
 *
 * This will delete the post and all comment pages
 * belonging to this post.
 *
 * req.query: {'postID': id}
 */
exports.delete = function(req, res){
    var msgObj = req.query;
    console.log(msgObj);

    if(!msgObj){
        return res.json(400, {'error': 'POST body is required.'});
    }

    if(!msgObj.postID){
        return res.json(400, {'error': 'postAuthor required.'});
    }

    Post.findById(msgObj.postID, function(error, post){
        if(error){
            console.log(error);
            return res.json(500, {'error': 'Server Error', 'mongoError': error});
        } else if(!post) {
            return res.json(400, {'error': 'No post for that post ID'});
        } else {
            async.parallel([
                function(done){
                    post.remove(function(error){
                        if(error){
                            done(error);
                        } else {
                            done();
                        }
                    });
                },
                function(done){
                    if(msgObj.postID){
                        CommentPage.remove({'node_id': msgObj.postID}, function(error){
                            if(error){
                                done(error);
                            } else {
                                done();
                            }
                        });
                    } else {
                        done(new Error('No post id to query comment pages.'));
                    }

                }],
                function(error){
                    if(error){
                        console.log(error);
                        return res.json(500, {'error': error});
                    } else {
                        return res.json(200, {'success': 'Successfully deleted post.'});
                    }
                });
        }
    });
}